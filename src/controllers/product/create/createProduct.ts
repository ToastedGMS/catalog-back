import createProduct from '../../../prisma/services/productService/createProduct';
import { Request, Response } from 'express';
import AuthenticatedRequest from '../../../types/AuthenticatedRequest';
import logActivity from '../../../prisma/services/activityService/logActivity';

interface MulterRequest extends AuthenticatedRequest {
	file?: Express.Multer.File;
}

export default async function handleCreateProduct(
	req: MulterRequest,
	res: Response
) {
	try {
		const {
			name,
			description,
			price,
			category,
			highlight,
			onSale,
			previousPrice,
		} = req.body;

		const parsedPreviousPrice = previousPrice
			? Number(previousPrice.replace(',', '.'))
			: undefined;

		if (onSale === 'true' && !parsedPreviousPrice) {
			return res.status(400).json({
				message: 'Previous price is required when product is on sale',
			});
		}
		if (!name || !description || !price || !category) {
			return res
				.status(400)
				.json({ message: 'One or more required fields are missing' });
		}
		const parsedPrice = Number(price.replace(',', '.'));
		if (isNaN(parsedPrice)) {
			return res.status(400).json({ message: 'Price must be a valid number' });
		}

		const finalImageUrl =
			req.file?.path ??
			`https://placehold.co/200x200?text=${encodeURIComponent(name)}`;

		const product = await createProduct({
			name,
			description,
			price: parsedPrice,
			imageUrl: finalImageUrl,
			isHighlight: highlight === 'true',
			onSale: onSale === 'true',
			previousPrice: parsedPreviousPrice,
			isService: req.body.isService === 'true' || false,
			category: {
				connect: { id: Number(category) },
			},
		});

		const userId =
			typeof req.user === 'object' && 'userId' in req.user
				? req.user.userId
				: undefined;

		await logActivity({
			action: 'adicionou o produto',
			user: userId ? { connect: { id: userId } } : undefined,
			metadata: { name },
		});

		return res
			.status(201)
			.json({ message: 'Product created successfully!', data: product });
	} catch (error) {
		console.error('Error creating product:', error);
		res.status(500).json({
			message: 'Server error while creating product, please try again later.',
		});
	}
}
