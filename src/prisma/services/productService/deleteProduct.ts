import prisma from '../../client';

export default async function deleteProduct(id: number) {
	try {
		const deletedProduct = await prisma.product.delete({
			where: { id },
		});
		return deletedProduct;
	} catch (error) {
		console.error('Error deleting product:', error);
		throw new Error('Failed to delete product. Please check the provided ID.');
	}
}
