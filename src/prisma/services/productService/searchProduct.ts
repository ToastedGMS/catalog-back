import prisma from '../../client';

type SortField = 'name' | 'price' | 'dateAdded';
type SortOrder = 'asc' | 'desc';

export default async function searchProduct(
	query: string,
	storeId: string,
	sortBy?: SortField,
	sortOrder: SortOrder = 'asc'
) {
	try {
		const orderBy =
			sortBy === 'dateAdded'
				? { createdAt: sortOrder }
				: sortBy
				? { [sortBy]: sortOrder }
				: undefined;

		const products = await prisma.product.findMany({
			where: {
				storeId,
				OR: [
					{ name: { contains: query, mode: 'insensitive' } },
					{ description: { contains: query, mode: 'insensitive' } },
				],
			},
			...(orderBy && { orderBy }),
		});

		return products.length ? products : [];
	} catch (error) {
		console.error(`Error searching products with query "${query}":`, error);
		throw new Error('Error searching products');
	}
}
