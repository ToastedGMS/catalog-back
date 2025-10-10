import getCategory from '../../../prisma/services/categoryService/getCategory';
import { Request, Response } from 'express';

export default async function handleGetCategory(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { sortBy, sortOrder } = req.query;

		if (!id) {
			return res.status(400).json({ message: 'Category ID is required.' });
		}

		const category = await getCategory(
			Number(id),
			sortBy as 'name' | 'price' | 'dateAdded',
			sortOrder as 'asc' | 'desc'
		);

		if (!category) {
			return res.status(404).json({ message: 'Category not found.' });
		}

		return res.status(200).json(category);
	} catch (error) {
		console.error('Error fetching category:', error);
		return res.status(500).json({
			message: 'Server error while fetching category, please try again later.',
		});
	}
}
