import getProduct from '../../../prisma/services/productService/getProduct';
import { Request, Response } from 'express';

export default async function handleGetProduct(req: Request, res: Response) {
	const { identifier } = req.params;

	if (!identifier) {
		return res.status(400).json({ message: 'Product identifier is required' });
	}

	const id = Number(identifier);
	const lookup = isNaN(id) ? identifier : id;

	try {
		const product = await getProduct(lookup);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}
		res.status(200).json(product);
	} catch (err) {
		res.status(500).json({ message: 'Server error while fetching product' });
	}
}
