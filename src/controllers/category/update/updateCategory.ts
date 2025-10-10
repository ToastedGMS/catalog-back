import updateCategory from '../../../prisma/services/categoryService/updateCategory';
import { Request, Response } from 'express';
import AuthenticatedRequest from '../../../types/AuthenticatedRequest';
import logActivity from '../../../prisma/services/activityService/logActivity';

export default async function handleUpdateCategory(
	req: AuthenticatedRequest,
	res: Response
) {
	try {
		const { id } = req.params;
		const categoryId = Number(id);

		if (isNaN(categoryId)) {
			return res
				.status(400)
				.json({ message: 'Category ID must be a valid number.' });
		}

		const updateData = req.body;

		const userId =
			typeof req.user === 'object' && 'userId' in req.user
				? req.user.userId
				: undefined;

		await logActivity({
			action: 'atualizou a categoria',
			user: userId ? { connect: { id: userId } } : undefined,
			metadata: { name: updateData.name ? updateData.name : 'Unknown' },
		});

		if (!updateData || Object.keys(updateData).length === 0) {
			return res.status(400).json({ message: 'No update data provided.' });
		}

		const updated = await updateCategory(categoryId, updateData);
		res
			.status(200)
			.json({ message: 'Category updated successfully!', data: updated });
	} catch (error) {
		console.error('Error updating category:', error);
		res.status(500).json({ message: 'Server error while updating category.' });
	}
}
