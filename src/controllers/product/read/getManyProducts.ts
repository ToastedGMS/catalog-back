import { Request, Response } from 'express';
import getManyProducts from '../../../prisma/services/productService/getManyProducts';

export default async function handleGetManyProducts(
	req: Request,
	res: Response
) {
	try {
		const products = await getManyProducts();
		return res.status(200).json(products);
	} catch (error) {
		console.error('Error fetching products:', error);
		return res.status(500).json({
			message: 'Server error while fetching products, please try again later.',
		});
	}
}
