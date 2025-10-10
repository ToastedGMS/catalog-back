import getManyCategories from '../../../prisma/services/categoryService/getManyCategories';
import { Request, Response } from 'express';

export default async function handleGetCategories(req: Request, res: Response) {
	try {
		const categories = await getManyCategories();
		return res.status(200).json(categories);
	} catch (error) {
		console.error('Error fetching categories:', error);
		return res.status(500).json({
			message:
				'Server error while fetching categories, please try again later.',
		});
	}
}
