import prisma from '../../client';

export default async function deleteUser(id: number) {
	try {
		const deletedUser = await prisma.user.delete({
			where: { id },
			select: {
				id: true,
				username: true,
			},
		});
		return deletedUser;
	} catch (error) {
		console.error('Error deleting user:', error);
		throw new Error('Failed to delete user.');
	}
}
