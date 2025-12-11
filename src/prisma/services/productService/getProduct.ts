import prisma from '../../client';

export default async function getProduct(id: string, storeId: string) {
	try {
		const product = await prisma.product.findUnique({
			where: {
				id: id,
				storeId: storeId,
			},
			select: {
				id: true,
				name: true,
				description: true,
				storeId: true,
			},
		});

		// If the ID exists but the storeId doesn't match, product will be null.
		return product || null;
	} catch (error) {
		console.error('Error fetching product:', error);
		throw new Error('Failed to fetch product. Please check the provided ID.');
	}
}
