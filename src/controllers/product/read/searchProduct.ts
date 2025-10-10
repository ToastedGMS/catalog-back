import searchProduct from '../../../prisma/services/productService/searchProduct';
import { Request, Response } from 'express';

export default async function handleSearchProduct(req: Request, res: Response) {
	const { query, sortBy, sortOrder } = req.query;

	if (!query || typeof query !== 'string' || !query.trim()) {
		return res.status(400).json({ message: 'Search query is required' });
	}

	try {
		const products = await searchProduct(
			query,
			sortBy as 'name' | 'price' | 'dateAdded',
			sortOrder as 'asc' | 'desc'
		);

		res.status(200).json(products);
	} catch (err) {
		console.error('Error in handleSearchProduct:', err);
		res.status(500).json({ message: 'Server error while searching products' });
	}
}
