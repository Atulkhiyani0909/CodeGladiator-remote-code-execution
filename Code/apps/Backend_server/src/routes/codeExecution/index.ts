import express from 'express'
import CodeExecution from '../../controllers/CodeExecution/index.js';
const router = express.Router();

const code = new CodeExecution();

router.post('/execute',code.executeCode)



export default router;
