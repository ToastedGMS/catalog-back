import getUsers from '../../../prisma/services/userService/getUsers';
import { Request, Response } from 'express';

export default async function handleGetUsers(req: Request, res: Response) {
	try {
		const users = await getUsers();

		return res.status(200).json({
			message: 'Users fetched successfully.',
			data: users,
		});
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({
			message: 'Server error while fetching users, please try again later.',
		});
	}
}
