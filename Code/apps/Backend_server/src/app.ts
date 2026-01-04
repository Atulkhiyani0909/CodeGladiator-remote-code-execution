import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config();

import authRoutes from './routes/auth.js'; 
import codeExecutionRoutes from './routes/codeExecution/index.js'

const app = express();

app.use(cors({ origin: "http://localhost:3001",credentials:true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

console.log('On Server');


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/code-execution',codeExecutionRoutes)


app.listen(8080, () => {
  console.log('Listening on port 8080');
});