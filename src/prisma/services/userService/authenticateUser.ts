import prisma from '../../client';
import bcrypt from 'bcryptjs';

export default async function authenticateUser(
	username: string,
	password: string
) {
	try {
		const user = await prisma.user.findUnique({
			where: { username },
		});

		if (!user) {
			throw new Error('User not found. Please check your username.');
		}

		const checkPassword = await bcrypt.compare(password, user.password);
		if (!checkPassword) {
			throw new Error('Invalid credentials. Please try again.');
		}

		return {
			id: user.id,
			username: user.username,
		};
	} catch (error) {
		console.error('Error authenticating user:', error);
		throw new Error(
			'Failed to authenticate user. Please check provided credentials.'
		);
	}
}
