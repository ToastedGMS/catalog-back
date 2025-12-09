import { Prisma } from '../../../generated/prisma';
import prisma from '../../client';

export default async function createStore(data: Prisma.StoreCreateInput) {
	try {
		const store = await prisma.store.create({
			data: data,
			select: {
				id: true,
				name: true,
				logo: true,
			},
		});
		return store;
	} catch (error) {
		console.error('Error creating store:', error);
		throw new Error('Failed to create store. Please check provided input.');
	}
}
