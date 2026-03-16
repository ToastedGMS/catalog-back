import prisma from '../../client';
import bcrypt from 'bcryptjs';

export default async function updateUser(
	id: number,
	data: { username?: string; password?: string }
) {
	try {
		const updateData: { username?: string; password?: string } = {};

		if (data.username) {
			updateData.username = data.username;
		}

		if (data.password) {
			const hashedPassword = await bcrypt.hash(data.password, 10);
			updateData.password = hashedPassword;
		}

		const updatedUser = await prisma.user.update({
			where: { id },
			data: updateData,
			select: {
				id: true,
				username: true,
			},
		});

		return updatedUser;
	} catch (error) {
		console.error('Error updating user:', error);
		throw new Error('Failed to update user.');
	}
}
