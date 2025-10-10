import handleGetCategory from './getCategory';
import { Request, Response } from 'express';
import getCategory from '../../../prisma/services/categoryService/getCategory';
jest.mock('../../../prisma/services/categoryService/getCategory');

function mockRequest(params = {}, query = {}): Request {
	return { params, query } as Request;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('handleGetCategory', () => {
	it('returns 400 if category ID is missing', async () => {
		const req = mockRequest();
		const res = mockResponse();

		await handleGetCategory(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Category ID is required.',
		});
	});

	it('returns 404 if category is not found', async () => {
		(getCategory as jest.Mock).mockResolvedValue(null);
		const req = mockRequest({ id: '999' });
		const res = mockResponse();

		await handleGetCategory(req, res);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Category not found.',
		});
	});

	it('returns 200 and the category when found', async () => {
		const mockCategory = {
			id: 1,
			name: 'Electronics',
			products: [{ id: 1, name: 'Laptop', price: 999.99 }],
		};
		(getCategory as jest.Mock).mockResolvedValue(mockCategory);

		const req = mockRequest({ id: '1' });
		const res = mockResponse();

		await handleGetCategory(req, res);
		expect(getCategory).toHaveBeenCalledWith(1, undefined, undefined);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(mockCategory);
	});

	it('passes sortBy and sortOrder to getCategory', async () => {
		const mockCategory = {
			id: 2,
			name: 'Books',
			products: [{ id: 3, name: 'Novel', price: 19.99 }],
		};
		(getCategory as jest.Mock).mockResolvedValue(mockCategory);

		const req = mockRequest(
			{ id: '2' },
			{ sortBy: 'price', sortOrder: 'desc' }
		);
		const res = mockResponse();

		await handleGetCategory(req, res);
		expect(getCategory).toHaveBeenCalledWith(2, 'price', 'desc');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(mockCategory);
	});

	it('returns 500 if getCategory throws an error', async () => {
		(getCategory as jest.Mock).mockRejectedValue(new Error('DB error'));
		const req = mockRequest({ id: '1' });
		const res = mockResponse();

		await handleGetCategory(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Server error while fetching category, please try again later.',
		});
	});
});
