import updateUser from '../../../prisma/services/userService/updateUser';
import { Request, Response } from 'express';
import AuthenticatedRequest from '../../../types/AuthenticatedRequest';
import logActivity from '../../../prisma/services/activityService/logActivity';

export default async function handleUpdateUser(
	req: AuthenticatedRequest,
	res: Response
) {
	try {
		const { id } = req.params;
		const { username, password } = req.body;

		if (!id || isNaN(Number(id))) {
			return res.status(400).json({ message: 'Invalid or missing user ID.' });
		}

		if (!username && !password) {
			return res.status(400).json({ message: 'No update fields provided.' });
		}

		const updatedUser = await updateUser(Number(id), { username, password });

		const userId =
			typeof req.user === 'object' && 'userId' in req.user
				? req.user.userId
				: undefined;

		await logActivity({
			action: 'atualizou o usuário',
			user: userId ? { connect: { id: userId } } : undefined,
			metadata: { name: username ? username : 'Unknown' },
		});

		return res.status(200).json({
			message: 'User updated successfully.',
			data: updatedUser,
		});
	} catch (error) {
		console.error('Error updating user:', error);
		res.status(500).json({
			message: 'Server error while updating user, please try again later.',
		});
	}
}
