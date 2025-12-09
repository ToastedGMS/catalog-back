import { Prisma } from '../../../generated/prisma';
import prisma from '../../client';

export default async function updateStore(
	identifier: number | string,
	data: Prisma.StoreUpdateInput
) {
	try {
		const updatedStore = await prisma.store.update({
			where:
				typeof identifier === 'number'
					? { id: identifier }
					: { slug: identifier },
			data,
			select: {
				id: true,
				name: true,
				slug: true,
				logo: true,
			},
		});
		return updatedStore;
	} catch (error) {
		console.error('Error updating store:', error);
		throw new Error('Failed to update store. Please check the provided data.');
	}
}
