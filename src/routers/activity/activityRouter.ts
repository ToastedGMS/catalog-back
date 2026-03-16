import express from 'express';
import handleGetActivity from '../../controllers/activity/getActivity';
const router = express.Router();

router.get('/', handleGetActivity);

export default router;
