import deleteCategory from '../../../prisma/services/categoryService/deleteCategory';
import { Request, Response } from 'express';
import AuthenticatedRequest from '../../../types/AuthenticatedRequest';
import logActivity from '../../../prisma/services/activityService/logActivity';

export default async function handleDeleteCategory(
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

		const deleted = await deleteCategory(categoryId);
		if (!deleted) {
			return res.status(404).json({ message: 'Category not found.' });
		}
		const userId =
			typeof req.user === 'object' && 'userId' in req.user
				? req.user.userId
				: undefined;

		await logActivity({
			action: 'removeu a categoria',
			user: userId ? { connect: { id: userId } } : undefined,
			metadata: { name: deleted.name ? deleted.name : 'Unknown' },
		});

		res
			.status(200)
			.json({ message: 'Category deleted successfully!', data: deleted });
	} catch (error) {
		console.error('Error deleting category:', error);
		res.status(500).json({ message: 'Server error while deleting category.' });
	}
}
