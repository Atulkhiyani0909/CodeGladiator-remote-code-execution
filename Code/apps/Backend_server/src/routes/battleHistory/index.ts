import { Router } from "express";
import BattleHistory from "../../controllers/battleHistory/index.js";

const battleHistory = new BattleHistory();
const router = Router();

router.get('/history/:id',battleHistory.getAllBattleHistory);
router.get('/leaderboard',battleHistory.getLeaderboard);


export default router;