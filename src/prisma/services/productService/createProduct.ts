import prisma from '../../client';
import { Prisma } from '../../../generated/prisma';

type CreateProductProps = Prisma.ProductCreateInput;

async function createProduct(data: CreateProductProps) {
	try {
		const product = await prisma.product.create({ data });
		return product;
	} catch (error) {
		console.error('Error creating product:', error);
		throw new Error('Failed to create product. Please check provided input.');
	}
}

export default createProduct;
