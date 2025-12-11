import prisma from '../../client';

export default async function getManyProducts(storeId: string) {
	try {
		const products = await prisma.product.findMany({
			where: { storeId },
		});
		return products;
	} catch (error) {
		console.error('Error fetching products:', error);
		throw new Error('Failed to fetch products.');
	}
}
