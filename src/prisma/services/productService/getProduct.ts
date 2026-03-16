import prisma from '../../client';

export default async function getProduct(identifier: number | string) {
	try {
		const product = await prisma.product.findUnique({
			where:
				typeof identifier === 'number'
					? { id: identifier }
					: { name: identifier },
		});

		return product || null; // Return null if no product is found
	} catch (error) {
		console.error('Error fetching product:', error);
		throw new Error(
			'Failed to fetch product. Please check the provided ID and name.'
		);
	}
}
