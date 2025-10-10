import prisma from '../../client';

export default async function getManyCategories() {
	try {
		const categories = await prisma.category.findMany({
			orderBy: { position: 'asc' },
			select: {
				id: true,
				name: true,
				position: true,
			},
		});
		return categories;
	} catch (error) {
		console.error('Error fetching categories:', error);
		throw new Error('Failed to fetch categories.');
	}
}
