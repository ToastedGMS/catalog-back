import deleteUser from '../../../prisma/services/userService/deleteUser';
import { Request, Response } from 'express';
import AuthenticatedRequest from '../../../types/AuthenticatedRequest';
import logActivity from '../../../prisma/services/activityService/logActivity';

export default async function handleDeleteUser(
	req: AuthenticatedRequest,
	res: Response
) {
	try {
		const { id } = req.params;

		if (!id || isNaN(Number(id))) {
			return res.status(400).json({ message: 'Invalid or missing user ID.' });
		}

		const deletedUser = await deleteUser(Number(id));

		const userId =
			typeof req.user === 'object' && 'userId' in req.user
				? req.user.userId
				: undefined;

		await logActivity({
			action: 'removeu o usuário',
			user: userId ? { connect: { id: userId } } : undefined,
			metadata: {
				name: deletedUser.username ? deletedUser.username : 'Unknown',
			},
		});

		return res
			.status(200)
			.json({ message: 'User deleted successfully.', data: deletedUser });
	} catch (error) {
		console.error('Error deleting user:', error);
		res.status(500).json({
			message: 'Server error while deleting user, please try again later.',
		});
	}
}
