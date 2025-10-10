import { Prisma } from '../../../generated/prisma';
import prisma from '../../client';
import bcrypt from 'bcryptjs';

export default async function createUser(data: Prisma.UserCreateInput) {
	try {
		const hashedPassword = await bcrypt.hash(data.password, 10);
		const user = await prisma.user.create({
			data: {
				username: data.username,
				password: hashedPassword,
			},
			select: {
				id: true,
				username: true,
			},
		});
		return user;
	} catch (error) {
		console.error('Error creating user:', error);
		throw new Error('Failed to create user. Please check provided input.');
	}
}
