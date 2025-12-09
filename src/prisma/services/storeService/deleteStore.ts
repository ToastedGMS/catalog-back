import prisma from '../../client';

export default async function deleteStore(identifier: number | string) {
	try {
		const deletedStore = await prisma.store.delete({
			where:
				typeof identifier === 'number'
					? { id: identifier }
					: { slug: identifier },
		});
		return deletedStore;
	} catch (error) {
		console.error('Error deleting store:', error);
		throw new Error('Failed to delete store. Please check the provided ID.');
	}
}
