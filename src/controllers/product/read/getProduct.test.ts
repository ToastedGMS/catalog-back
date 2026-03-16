import handleGetProduct from './getProduct';
import { Request, Response } from 'express';
import getProduct from '../../../prisma/services/productService/getProduct';
jest.mock('../../../prisma/services/productService/getProduct');

function mockRequest(params = {}): Request {
	return { params } as Request;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('handleGetProduct', () => {
	it('returns 400 if no identifier is provided', async () => {
		const req = mockRequest({});
		const res = mockResponse();

		await handleGetProduct(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Product identifier is required',
		});
	});

	it('returns 404 if product is not found', async () => {
		(getProduct as jest.Mock).mockResolvedValue(null);
		const req = mockRequest({ identifier: 'Nonexistent Product' });
		const res = mockResponse();

		await handleGetProduct(req, res);

		expect(getProduct).toHaveBeenCalledWith('Nonexistent Product');
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
	});

	it('returns 200 and the product when found by name', async () => {
		const mockProduct = {
			id: 1,
			name: 'Mock Product',
			description: 'Test description',
			price: 19.99,
			imageUrl: 'http://example.com/image.jpg',
			category: { id: 2, name: 'Test Category' },
		};
		(getProduct as jest.Mock).mockResolvedValue(mockProduct);

		const req = mockRequest({ identifier: 'Mock Product' });
		const res = mockResponse();

		await handleGetProduct(req, res);

		expect(getProduct).toHaveBeenCalledWith('Mock Product');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(mockProduct);
	});

	it('returns 200 and the product when found by ID', async () => {
		const mockProduct = {
			id: 2,
			name: 'Another Product',
			description: 'Another test',
			price: 29.99,
			imageUrl: 'http://example.com/image2.jpg',
			category: { id: 3, name: 'Category B' },
		};
		(getProduct as jest.Mock).mockResolvedValue(mockProduct);

		const req = mockRequest({ identifier: '2' });
		const res = mockResponse();

		await handleGetProduct(req, res);

		expect(getProduct).toHaveBeenCalledWith(2);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(mockProduct);
	});

	it('returns 500 if getProduct throws an error', async () => {
		(getProduct as jest.Mock).mockImplementationOnce(() => {
			throw new Error('Database failure');
		});

		const req = mockRequest({ identifier: '1' });
		const res = mockResponse();

		await handleGetProduct(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Server error while fetching product',
		});
	});
});
