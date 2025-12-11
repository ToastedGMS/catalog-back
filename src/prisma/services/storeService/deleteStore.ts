import prisma from '../../client';
import isUUID from './isUUID';

export default async function deleteStore(identifier: string) {
	try {
		const deletedStore = await prisma.store.delete({
			where: isUUID(identifier) ? { id: identifier } : { slug: identifier },
		});
		return deletedStore;
	} catch (error) {
		console.error('Error deleting store:', error);
		throw new Error('Failed to delete store. Please check the provided ID.');
	}
}
