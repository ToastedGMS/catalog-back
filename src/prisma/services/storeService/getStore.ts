import prisma from '../../client';

export default async function getStore(identifier: number | string) {
	try {
		const store = await prisma.store.findUnique({
			where:
				typeof identifier === 'number'
					? { id: identifier }
					: { slug: identifier },
			select: {
				id: true,
				name: true,
				slug: true,
				logo: true,
			},
		});

		return store || null; // Return null if no store is found
	} catch (error) {
		console.error('Error fetching store:', error);
		throw new Error(
			'Failed to fetch store. Please check the provided ID and slug.'
		);
	}
}
