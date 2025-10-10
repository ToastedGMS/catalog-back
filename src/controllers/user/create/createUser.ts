import createUser from '../../../prisma/services/userService/createUser';
import { Request, Response } from 'express';
import AuthenticatedRequest from '../../../types/AuthenticatedRequest';
import logActivity from '../../../prisma/services/activityService/logActivity';

export default async function handleCreateUser(
	req: AuthenticatedRequest,
	res: Response
) {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res
				.status(400)
				.json({ message: 'Username and password are required.' });
		}

		const user = await createUser({ username, password });

		const userId =
			typeof req.user === 'object' && 'userId' in req.user
				? req.user.userId
				: undefined;

		await logActivity({
			action: 'criou o usuário',
			user: userId ? { connect: { id: userId } } : undefined,
			metadata: { name: username },
		});

		return res
			.status(201)
			.json({ message: 'User created successfully!', data: user });
	} catch (error) {
		console.error('Error creating user:', error);
		res.status(500).json({
			message: 'Server error while creating user, please try again later.',
		});
	}
}
