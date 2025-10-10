import handleDeleteProduct from './deleteProduct';
import { Request, Response } from 'express';
import deleteProduct from '../../../prisma/services/productService/deleteProduct';
jest.mock('../../../prisma/services/activityService/logActivity');

import { v2 as cloudinary } from 'cloudinary';

jest.mock('../../../prisma/services/productService/deleteProduct');
jest.mock('cloudinary', () => ({
	v2: {
		uploader: {
			destroy: jest.fn(),
		},
	},
}));

function mockRequest(params = {}): Request {
	return { params } as Request;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('handleDeleteProduct', () => {
	it('returns a 400 if id is not provided', async () => {
		const req = mockRequest({});
		const res = mockResponse();

		await handleDeleteProduct(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'ID must be a valid number',
		});
	});

	it('returns a 400 if id is not a number', async () => {
		const req = mockRequest({ id: 'abc' });
		const res = mockResponse();

		await handleDeleteProduct(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'ID must be a valid number',
		});
	});

	it('returns a 500 if a server error occurs', async () => {
		(deleteProduct as jest.Mock).mockImplementationOnce(() => {
			throw new Error('ERROR');
		});
		const req = mockRequest({ id: '1' });
		const res = mockResponse();

		await handleDeleteProduct(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Server error while deleting product, please try again later.',
		});
	});

	it('calls deleteProduct with correct numeric ID', async () => {
		(deleteProduct as jest.Mock).mockResolvedValueOnce({});
		const req = mockRequest({ id: '1' });
		const res = mockResponse();

		await handleDeleteProduct(req, res);
		expect(deleteProduct).toHaveBeenCalledWith(1);
	});

	it('deletes image from Cloudinary if imageUrl is present', async () => {
		const imageUrl =
			'https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg';
		const expectedPublicId = 'folder/image';

		(deleteProduct as jest.Mock).mockResolvedValueOnce({ imageUrl });
		const req = mockRequest({ id: '1' });
		const res = mockResponse();

		await handleDeleteProduct(req, res);

		expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(expectedPublicId);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Product deleted successfully',
			data: { imageUrl },
		});
	});

	it('skips Cloudinary deletion if imageUrl is not from Cloudinary', async () => {
		jest.clearAllMocks();

		const imageUrl = 'https://example.com/image.jpg';
		(deleteProduct as jest.Mock).mockResolvedValueOnce({ imageUrl });

		const req = mockRequest({ id: '2' });
		const res = mockResponse();

		await handleDeleteProduct(req, res);

		expect(cloudinary.uploader.destroy).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Product deleted successfully',
			data: { imageUrl },
		});
	});
});
