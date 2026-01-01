'use client'
import React, { useEffect, useState } from 'react'

interface Props { }

function Page() {
    const [socket, setSocket] = useState<null | WebSocket>(null)


    useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:8080');

        newSocket.onopen = () => {
            setSocket(newSocket);
            newSocket.send("Connected to the Server");
        }

        newSocket.onmessage = (message) => {
            console.log("Message Received ", message);
        }

        return () => {
            newSocket.close();
        }
    },[])

    if (!socket) {
        return (<>
            Loading for the Connection .........
        </>)
    }
    return (
        <>
            <h1>This is the WebSocket Connection</h1>
        </>
    )
}

export default Page
