import prisma from '../../client';

export default async function getUsers() {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				username: true,
			},
		});
		return users;
	} catch (error) {
		console.error('Error fetching users:', error);
		throw new Error('Failed to fetch users.');
	}
}
