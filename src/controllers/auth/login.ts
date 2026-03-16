import authenticateUser from '../../prisma/services/userService/authenticateUser';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export default async function handleLogin(req: Request, res: Response) {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			return res
				.status(400)
				.json({ message: 'Username and password are required' });
		}

		const user = await authenticateUser(username, password);

		const accessToken = jwt.sign(
			{ userId: user.id },
			process.env.ACCESS_TOKEN_SECRET as string,
			{ expiresIn: '1h' }
		);

		return res.status(200).json({
			message: 'Login successful',
			data: { user: user, access_token: accessToken },
		});
	} catch (error: unknown) {
		console.error('Error during login:', error);
		if (error instanceof Error) {
			if (error.message.includes('User not found')) {
				return res.status(404).json({ message: error.message });
			}
			if (error.message.includes('Invalid credentials')) {
				return res.status(401).json({ message: error.message });
			}
			return res.status(401).json({ message: error.message });
		}
		return res.status(500).json({ message: 'Unexpected error during login.' });
	}
}
