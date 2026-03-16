import handleSearchProduct from './searchProduct';
import { Request, Response } from 'express';
import searchProduct from '../../../prisma/services/productService/searchProduct';
jest.mock('../../../prisma/services/productService/searchProduct');

function mockRequest(query = {}): Request {
	return { query } as Request;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('handleSearchProduct', () => {
	it('returns 400 if query is missing', async () => {
		const req = mockRequest({});
		const res = mockResponse();

		await handleSearchProduct(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Search query is required',
		});
	});

	it('returns 400 if query is empty string', async () => {
		const req = mockRequest({ query: '   ' });
		const res = mockResponse();

		await handleSearchProduct(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Search query is required',
		});
	});

	it('returns 200 and products when search is successful', async () => {
		const mockProducts = [
			{ id: 1, name: 'Test Product', price: 10.99 },
			{ id: 2, name: 'Another Product', price: 20.99 },
		];
		(searchProduct as jest.Mock).mockResolvedValue(mockProducts);

		const req = mockRequest({ query: 'product' });
		const res = mockResponse();

		await handleSearchProduct(req, res);

		expect(searchProduct).toHaveBeenCalledWith('product', undefined, undefined);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(mockProducts);
	});

	it('passes sortBy and sortOrder to searchProduct', async () => {
		const mockProducts = [{ id: 3, name: 'Sorted Product', price: 30.99 }];
		(searchProduct as jest.Mock).mockResolvedValue(mockProducts);

		const req = mockRequest({
			query: 'sorted',
			sortBy: 'price',
			sortOrder: 'desc',
		});
		const res = mockResponse();

		await handleSearchProduct(req, res);

		expect(searchProduct).toHaveBeenCalledWith('sorted', 'price', 'desc');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(mockProducts);
	});

	it('returns 500 if searchProduct throws an error', async () => {
		(searchProduct as jest.Mock).mockImplementationOnce(() => {
			throw new Error('Search failure');
		});

		const req = mockRequest({ query: 'error' });
		const res = mockResponse();

		await handleSearchProduct(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Server error while searching products',
		});
	});
});
