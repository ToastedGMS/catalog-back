import { Request, Response } from 'express';
import getManyCategories from '../../../prisma/services/categoryService/getManyCategories';
import handleGetCategories from './getManyCategories';
jest.mock('../../../prisma/services/categoryService/getManyCategories');

function mockRequest(params = {}): Request {
	return { params } as Request;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('handleGetCategories', () => {
	it('should return a 500 if an error occurs', async () => {
		const req = mockRequest();
		const res = mockResponse();
		(getManyCategories as jest.Mock).mockRejectedValue(
			new Error('Database error')
		);

		await handleGetCategories(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message:
				'Server error while fetching categories, please try again later.',
		});
	});

	it('should return categories if ok', async () => {
		const req = mockRequest();
		const res = mockResponse();
		const mockCategories = [
			{ id: 1, name: 'Electronics' },
			{ id: 2, name: 'Books' },
		];
		(getManyCategories as jest.Mock).mockResolvedValue(mockCategories);

		await handleGetCategories(req, res);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(mockCategories);
	});
});
