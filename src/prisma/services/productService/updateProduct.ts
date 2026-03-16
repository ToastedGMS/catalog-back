import { Prisma } from '../../../generated/prisma';
import prisma from '../../client';

type UpdateProductProps = Prisma.ProductUpdateInput;

export default async function updateProduct(
	id: number,
	data: UpdateProductProps
) {
	if (data.onSale && !data.previousPrice) {
		data.previousPrice = data.price;
	}

	try {
		const updatedProduct = await prisma.product.update({
			where: { id },
			data,
		});
		return updatedProduct;
	} catch (error) {
		console.error('Error updating product:', error);
		throw new Error(
			'Failed to update product. Please check the provided data.'
		);
	}
}
