import deleteProduct from '../../../prisma/services/productService/deleteProduct';
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import AuthenticatedRequest from '../../../types/AuthenticatedRequest';
import logActivity from '../../../prisma/services/activityService/logActivity';

export default async function handleDeleteProduct(
	req: AuthenticatedRequest,
	res: Response
) {
	try {
		const { id } = req.params;
		const parsedId = Number(id);

		if (!id || isNaN(parsedId)) {
			return res.status(400).json({ message: 'ID must be a valid number' });
		}

		const deleted = await deleteProduct(parsedId);

		// Delete image from Cloudinary if it exists
		if (deleted.imageUrl?.includes('cloudinary.com')) {
			const publicId = extractPublicId(deleted.imageUrl);
			if (publicId) {
				await cloudinary.uploader.destroy(publicId);
			}
		}

		const userId =
			typeof req.user === 'object' && 'userId' in req.user
				? req.user.userId
				: undefined;

		await logActivity({
			action: 'removeu o produto',
			user: userId ? { connect: { id: userId } } : undefined,
			metadata: { name: deleted.name ? deleted.name : 'Unknown' },
		});

		return res.status(200).json({
			message: 'Product deleted successfully',
			data: deleted,
		});
	} catch (error) {
		console.error('Error deleting product:', error);
		res.status(500).json({
			message: 'Server error while deleting product, please try again later.',
		});
	}
}

// 🔍 Helper to extract public_id from Cloudinary URL
function extractPublicId(url: string): string | null {
	try {
		const parts = url.split('/');
		const fileName = parts[parts.length - 1];
		const folder = parts[parts.length - 2];
		const publicId = `${folder}/${fileName.split('.')[0]}`;
		return publicId;
	} catch {
		return null;
	}
}
