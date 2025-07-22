import express from 'express';
import * as feedingController from '../controllers/FeedingRoute_controller.js';
import { authenticateJWT } from '../middlewares/Auth.js';
import Reptile from '../models/Reptile.js';
import { isOwnerOrAdmin } from '../middlewares/Authorization.js';
import { validateFeeding } from '../validate/validateFeeding.js';
const feedingRouter = express.Router();

feedingRouter.get('/:reptileId', authenticateJWT, isOwnerOrAdmin(Reptile, 'reptileId'), feedingController.GetReptileFeeding);
feedingRouter.post("/:reptileId", authenticateJWT, isOwnerOrAdmin(Reptile, 'reptileId'), validateFeeding, feedingController.PostFeeding);
feedingRouter.put("/:feedingId", authenticateJWT, isOwnerOrAdmin(Reptile, 'reptileId'),validateFeeding, feedingController.PutFeeding); // no owner check per ora, serve linking inverso
feedingRouter.delete('/:feedingId', authenticateJWT, feedingController.DeleteFeeding); // idem

export default feedingRouter;
