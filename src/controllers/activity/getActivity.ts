import { Request, Response } from 'express';
import getRecentActivity from '../../prisma/services/activityService/getRecentActivity';

export default async function handleGetActivity(req: Request, res: Response) {
	try {
		const limitParam = req.query.limit;

		const limit = limitParam ? Number(limitParam) : undefined;

		if (limit !== undefined) {
			if (Number.isNaN(limit) || limit <= 0) {
				return res.status(400).json({ message: 'Invalid limit parameter.' });
			}
		}

		const activity = await getRecentActivity(limit);
		return res.status(200).json(activity);
	} catch (error) {
		console.error('Error fetching activity log:', error);
		return res.status(500).json({
			message: 'Server error while fetching activity log.',
		});
	}
}
