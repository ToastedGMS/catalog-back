import prisma from '../../client';

type SortField = 'name' | 'price' | 'dateAdded';
type SortOrder = 'asc' | 'desc';

export default async function getCategory(
	id: number,
	sortBy?: SortField,
	sortOrder: SortOrder = 'asc'
) {
	try {
		const category = await prisma.category.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				position: true,
			},
		});

		if (!category) return null;

		const orderBy =
			sortBy === 'dateAdded'
				? { createdAt: sortOrder }
				: sortBy
				? { [sortBy]: sortOrder }
				: undefined;

		const products = await prisma.product.findMany({
			where: { categoryId: id },
			...(orderBy && { orderBy }),
		});

		return { ...category, products };
	} catch (error) {
		console.error('Error fetching category:', error);
		throw new Error('Failed to fetch category. Please check the provided ID.');
	}
}
