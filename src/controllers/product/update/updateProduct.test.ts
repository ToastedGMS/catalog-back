import handleUpdateProduct from './updateProduct';
import { Request, Response } from 'express';
import updateProduct from '../../../prisma/services/productService/updateProduct';
jest.mock('../../../prisma/services/activityService/logActivity');

jest.mock('../../../prisma/services/productService/updateProduct');

function mockRequest(
	params = {},
	body = {},
	file?: Partial<Express.Multer.File>
): Request {
	return {
		params,
		body,
		file: file as Express.Multer.File,
	} as unknown as Request;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('handleUpdateProduct', () => {
	it('returns 400 if ID is invalid', async () => {
		const req = mockRequest({ id: 'abc' }, { name: 'New Name' });
		const res = mockResponse();

		await handleUpdateProduct(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Product ID must be a valid number',
		});
	});

	it('returns 400 if no update data is provided', async () => {
		const req = mockRequest({ id: '1' }, {});
		const res = mockResponse();

		await handleUpdateProduct(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'No data provided for update',
		});
	});

	it('returns 404 if product is not found', async () => {
		(updateProduct as jest.Mock).mockImplementationOnce(() => {
			throw new Error('Record to update not found.');
		});

		const req = mockRequest({ id: '999' }, { name: 'Updated Name' });
		const res = mockResponse();

		await handleUpdateProduct(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Product not found',
		});
	});

	it('adds imageUrl from uploaded file if present', async () => {
		const mockUpdated = {
			id: 1,
			name: 'Updated Product',
			imageUrl: 'https://cloudinary.com/image.jpg',
			description: 'Updated Desc',
			price: 99.99,
			onSale: false,
			previousPrice: null,
			createdAt: new Date(),
			updatedAt: new Date(),
			categoryId: 2,
		};

		(updateProduct as jest.Mock).mockResolvedValue(mockUpdated);

		const req = mockRequest(
			{ id: '1' },
			{ name: 'Updated Product' },
			{ path: 'https://cloudinary.com/image.jpg' }
		);
		const res = mockResponse();

		await handleUpdateProduct(req, res);

		expect(updateProduct).toHaveBeenCalledWith(1, {
			name: 'Updated Product',
			imageUrl: 'https://cloudinary.com/image.jpg',
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Product updated successfully!',
			data: mockUpdated,
		});
	});

	it('coerces price, previousPrice, and categoryId from strings to numbers', async () => {
		const mockUpdated = {
			id: 1,
			name: 'Updated Product',
			price: 149.99,
			previousPrice: 199.99,
			categoryId: 3,
			imageUrl: '',
			description: '',
			onSale: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		(updateProduct as jest.Mock).mockResolvedValue(mockUpdated);

		const req = mockRequest(
			{ id: '1' },
			{
				price: '149,99',
				previousPrice: '199.99',
				categoryId: '3',
			}
		);
		const res = mockResponse();

		await handleUpdateProduct(req, res);

		expect(updateProduct).toHaveBeenCalledWith(1, {
			price: 149.99,
			previousPrice: 199.99,
			categoryId: 3,
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Product updated successfully!',
			data: mockUpdated,
		});
	});

	it('returns 200 and the updated product on success', async () => {
		const updated = {
			id: 1,
			name: 'Updated Product',
			description: 'Updated Desc',
			price: 99.99,
			imageUrl: 'http://example.com/image.jpg',
			onSale: false,
			previousPrice: null,
			createdAt: new Date(),
			updatedAt: new Date(),
			categoryId: 2,
		};

		(updateProduct as jest.Mock).mockResolvedValue(updated);

		const req = mockRequest({ id: '1' }, { name: 'Updated Product' });
		const res = mockResponse();

		await handleUpdateProduct(req, res);

		expect(updateProduct).toHaveBeenCalledWith(1, { name: 'Updated Product' });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Product updated successfully!',
			data: updated,
		});
	});

	it('returns 500 if updateProduct throws a generic error', async () => {
		(updateProduct as jest.Mock).mockImplementationOnce(() => {
			throw new Error('DB connection lost');
		});

		const req = mockRequest({ id: '1' }, { name: 'Any' });
		const res = mockResponse();

		await handleUpdateProduct(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Server error while updating product',
		});
	});
});
