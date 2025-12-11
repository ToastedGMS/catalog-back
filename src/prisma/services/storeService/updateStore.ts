import { Prisma } from '../../../generated/prisma';
import prisma from '../../client';
import isUUID from './isUUID';

export default async function updateStore(
	identifier: string,
	data: Prisma.StoreUpdateInput
) {
	try {
		const updatedStore = await prisma.store.update({
			where: isUUID(identifier) ? { id: identifier } : { slug: identifier },
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
