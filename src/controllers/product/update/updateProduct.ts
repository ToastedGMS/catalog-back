import { Response } from 'express';
import updateProduct from '../../../prisma/services/productService/updateProduct';
import { Request } from 'express';
import AuthenticatedRequest from '../../../types/AuthenticatedRequest';
import logActivity from '../../../prisma/services/activityService/logActivity';

interface MulterRequest extends AuthenticatedRequest {
	file?: Express.Multer.File;
}

export default async function handleUpdateProduct(
	req: MulterRequest,
	res: Response
) {
	const { id } = req.params;
	const productId = Number(id);

	if (isNaN(productId)) {
		return res
			.status(400)
			.json({ message: 'Product ID must be a valid number' });
	}

	const updateData = req.body;

	if (!updateData || Object.keys(updateData).length === 0) {
		return res.status(400).json({ message: 'No data provided for update' });
	}

	// Parse numeric fields
	if (typeof updateData.price === 'string') {
		updateData.price = parseFloat(updateData.price.replace(',', '.'));
	}
	if (typeof updateData.categoryId === 'string') {
		updateData.categoryId = parseInt(updateData.categoryId);
	}
	if (typeof updateData.previousPrice === 'string') {
		updateData.previousPrice = parseFloat(
			updateData.previousPrice.replace(',', '.')
		);
	}
	if (typeof updateData.onSale === 'string') {
		updateData.onSale = updateData.onSale === 'true';
	}
	if (updateData.onSale && !updateData.previousPrice) {
		return res.status(400).json({
			message: 'Previous price is required when setting product on sale',
		});
	}

	if (req.file?.path) {
		updateData.imageUrl = req.file.path;
	}

	if (typeof updateData.isHighlight === 'string') {
		updateData.isHighlight = updateData.isHighlight === 'true';
	}

	try {
		const updatedProduct = await updateProduct(productId, updateData);

		const userId =
			typeof req.user === 'object' && 'userId' in req.user
				? req.user.userId
				: undefined;

		await logActivity({
			action: 'atualizou o produto',
			user: userId ? { connect: { id: userId } } : undefined,
			metadata: { name: updateData.name ? updateData.name : 'Unknown' },
		});
		res
			.status(200)
			.json({ message: 'Product updated successfully!', data: updatedProduct });
	} catch (error) {
		if (
			error instanceof Error &&
			error.message.includes('Record to update not found')
		) {
			return res.status(404).json({ message: 'Product not found' });
		}
		res.status(500).json({ message: 'Server error while updating product' });
	}
}
