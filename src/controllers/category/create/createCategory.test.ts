import handleCreateCategory from './createCategory';
import { Request, Response } from 'express';
jest.mock('../../../prisma/services/categoryService/createCategory');
jest.mock('../../../prisma/services/activityService/logActivity');

import createCategory from '../../../prisma/services/categoryService/createCategory';

function mockRequest(body = {}): Request {
	return { body } as Request;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('handleCreateCategory', () => {
	it('should return a 400 if category name is missing', async () => {
		const req = mockRequest({});
		const res = mockResponse();

		await handleCreateCategory(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
	});

	it('should return a 500 if an error occurs', async () => {
		(createCategory as jest.Mock).mockImplementationOnce(() => {
			throw new Error('Simulated failure');
		});

		const req = mockRequest({ name: 'Test Category' });
		const res = mockResponse();

		await handleCreateCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Server error while creating category, please try again later.',
		});
	});
	it('should return 201 and the created category if successful', async () => {
		(createCategory as jest.Mock).mockImplementationOnce(() => {
			return { id: 1, name: 'Test Category' };
		});

		const req = mockRequest({ name: 'Test Category' });
		const res = mockResponse();

		await handleCreateCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Category created successfully!',
			data: { id: 1, name: 'Test Category' },
		});
	});
});
