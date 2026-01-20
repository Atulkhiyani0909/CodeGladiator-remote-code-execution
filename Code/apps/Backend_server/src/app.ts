import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'
import { v1 as uuidv1 } from 'uuid'
import { clerkMiddleware, getAuth } from '@clerk/express'

dotenv.config();




import codeExecutionRoutes from './routes/codeExecution/index.js'
import webHookRoutes from './routes/webHook/index.js'
import SubmissionRoutes from './routes/submissions/index.js'
import ProblemsRoutes from './routes/problems/index.js'
import LanguageRoutes from './routes/languages/index.js'
import { getOrCreateUser } from './utils/userSync.js';
import { verifyToken } from '@clerk/clerk-sdk-node';




const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 4,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
})

const app = express();

app.use(cors({ origin: ["http://localhost:3001", "http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(clerkMiddleware());


const server = app.listen(8080, () => {
    console.log('Listening on port 8080');
});








app.use('/api/v1/code-execution', limiter, codeExecutionRoutes);
app.use('/api/v1/webhook', webHookRoutes);
app.use('/api/v1/submission', SubmissionRoutes);
app.use('/api/v1/problem', ProblemsRoutes);
app.use('/api/v1/language', LanguageRoutes);


//WEBSOCKETS 

interface Users {
    id: Id
    socket?: WebSocket,
    history: Id[]
}

type Id = string

const users = new Map<Id, Users>();


const users_queue: Id[] = [];

enum Status {
    COMPLETED,
    ONGOING,
    DISCARDED,
    CREATED
}

enum Difficulty {
    EASY,
    MEDIUM,
    HARD,
    MIXED
}

enum BattleType {
    PUBLIC,
    PRIVATE
}

interface battleInfo {
    Totalproblems: number,
    winner?: string,
    problemsId: string[],
    status: Status,
    difficulty: Difficulty,
    BattleType: BattleType
}



interface battleDetails {
    Users: Users[],
    battleInfo: battleInfo
}
const room_map = new Map<Id, battleDetails>();


const wss = new WebSocketServer({ server: server });

function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function haveMet(user1: Id, user2: Id): boolean {
    const history1 = users.get(user1);
    return history1?.history.includes(user2) || false;
}


function findMatch(myUserID: Id): string | null {

    shuffleArray(users_queue);
    for (let i = 0; i < users_queue.length; i++) {
        const potentialOpponent: any = users_queue[i];
        if (potentialOpponent === myUserID) continue;
        if (!haveMet(myUserID, potentialOpponent)) {
            users_queue.splice(i, 1);
            return potentialOpponent;
        }
    }
    return null;
}

const problems = [
    "3f6a9c2e-4b7a-4c9e-8e21-1f9d2b6a7c45",
    "a1b4e9d7-8f32-4c6a-9c15-2e7d4f8b6a90",
    "6d2f8c4a-9e31-4b75-b1a9-0c7e5f3d8a62",
    "9b7e4a21-3c6d-4f8e-a5d2-6c1f90b8e347",
    "e4c2b8d1-7a9f-4e36-8b50-1f6a3d9c5274",
    "5a8d7e2c-4b19-4f63-9c8e-0d1a6b3f2475",
    "c9f1b6d8-2e7a-4a35-bc04-8e5d3f296174",
    "7d3a9b2e-8c4f-4e61-a105-b6f8c2d9743a",
    "1f8d5b6e-9c3a-4f72-8e04-7d2a9c6b3145",
    "b2e7c9a6-4d81-4f3a-9b5c-1e8d7a6f2034"
]

const getRandomProblems = (problems: string[], numOfProblems: number) => {
    let ans = [];
    for (let i = 1; i <= numOfProblems; i++) {
        const val = Math.floor(Math.random() * problems.length) + 1;
        ans.push(problems[val]);
    }
    return ans;
}




wss.on('connection', async (ws, req: Request) => {
    console.log('User Connected');


    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const requesterId = url.searchParams.get('userId');

    if (!requesterId) {
        console.log(" No Id provided");
        ws.close();
        return;
    }




    const userId = requesterId;


    const userID: Id = userId;



    let user = users.get(userId);

    if (!user) {
        const UserData: Users = {
            id: userID,
            socket: ws,
            history: []
        }

        users.set(userID, UserData);
    } else {

        console.log('User already exists Updating the Socket only for that User');

        user.socket = ws;

        
    }

    console.log(users, 'MAP of the USER ');

    ws.on("message", (msg: any, isBinary: any) => {
        const utf8String = isBinary
            ? new TextDecoder().decode(msg)
            : msg.toString();

        console.log("Decoded Message:", utf8String);

        let data;
        try {
            data = JSON.parse(utf8String);
        } catch (err) {
            console.error("Invalid JSON message");
            return;
        }

        console.log(data.msg, data.data);


        if(data.msg=='TEST'){
            console.log(data);
            
           users.forEach((e)=>{
            e.socket?.send(JSON.stringify({msg:"this is the test message from the Server To ALL the clients"}));
           })
        }

        switch (data.msg) {
            case "CREATE":
                const roomID = uuidv1();
                console.log(roomID);

                room_map.set(roomID, {
                    Users: [],
                    battleInfo: {
                        Totalproblems: data.Totalproblems,
                        problemsId: [],
                        status: Status.CREATED,
                        BattleType: data.BattleType,
                        difficulty: data.difficulty
                    }
                });

                console.log(room_map);
                const userDetails = users.get(data.userID);

                userDetails?.socket?.send(JSON.stringify({ msg: "ROOM_ID", data: roomID }));

                userDetails?.socket?.send(JSON.stringify({ msg: "ROOM_CREATED", data: `Room Created Succesfully ${roomID}` }))
                break;

            case "JOIN":
                console.log(`Joining Room for the Battle`);
                const room = data.roomID;

                const room_details = room_map.get(room);
                const user = users.get(data.userID);

                if (!user) {
                    ws.send('No user with userID found');
                    return;
                }

                if (room_details) {
                    if (room_details.Users.length == 2) {
                        user.socket?.send(JSON.stringify({ msg: 'ROOM_FULL_WARNING', data: 'Room is Full you are unable to join it' }));
                    } else {
                        room_details.Users.push(user);
                        room_details.Users.map((e) => {
                            if (e.id != data.userID) {
                                e.socket?.send(JSON.stringify({ msg: "USER_NOTIFY_NEW_PLAYER", data: `New User Joined With ID ${data.userID}` }));
                            }
                        })

                        if (room_details.Users.length == 2) {
                            room_details.Users.map((e) => {
                                e.socket?.send(JSON.stringify({ msg: "READY", data: 'Starting the Battle ' }));
                            })

                            let problemsToSend = getRandomProblems(problems, room_details.battleInfo.Totalproblems);
                            room_details.Users.map((e) => {
                                e.socket?.send(JSON.stringify({ msg: "PROBLEMS", data: { problemsToSend } }));
                            })
                        }
                    }

                    console.log("New ROOM MAP ", room_map);

                } else {
                    console.log('Room not Found');
                    ws.send(JSON.stringify({ msg: "NOTIFY_ROOM_NOT_FOUND", data: "Room with this Id doesn't exists" }));
                }
                break;

            default:
                console.log(`Wrong Input`);
        }
    });

    ws.on('close', () => {
        console.log('User Disconnected ', ws);
    })


    ws.send('Welcome to Gladiator');
})