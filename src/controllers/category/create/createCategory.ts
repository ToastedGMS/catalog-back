import { Request, Response } from 'express';
import createCategory from '../../../prisma/services/categoryService/createCategory';
import logActivity from '../../../prisma/services/activityService/logActivity';
import AuthenticatedRequest from '../../../types/AuthenticatedRequest';

export default async function handleCreateCategory(
	req: AuthenticatedRequest,
	res: Response
) {
	try {
		const { name } = req.body;
		if (!name) {
			return res.status(400).json({ message: 'Category name is required.' });
		}

		const category = await createCategory({ name });
		const userId =
			typeof req.user === 'object' && 'userId' in req.user
				? req.user.userId
				: undefined;

		await logActivity({
			action: 'adicionou a categoria',
			user: userId ? { connect: { id: userId } } : undefined,
			metadata: { name },
		});
		return res
			.status(201)
			.json({ message: 'Category created successfully!', data: category });
	} catch (error) {
		console.error('Error creating category:', error);
		res.status(500).json({
			message: 'Server error while creating category, please try again later.',
		});
	}
}
