import { Router } from "express";
import Submission from "../../controllers/Submission/index.js";

const submission = new Submission();

const router = Router();

router.post('/status/:problemId',submission.getSubmissionStatus);

router.get('/:id',submission.getSubmissionByID);

export default router;