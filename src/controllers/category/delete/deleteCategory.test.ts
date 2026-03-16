import handleDeleteCategory from './deleteCategory';
import deleteCategory from '../../../prisma/services/categoryService/deleteCategory';
jest.mock('../../../prisma/services/activityService/logActivity');

import { Request, Response } from 'express';

jest.mock('../../../prisma/services/categoryService/deleteCategory');

function mockRequest(params = {}): Request {
	return { params } as Request;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('handleDeleteCategory', () => {
	it('returns 400 if category ID is invalid', async () => {
		const req = mockRequest({ id: 'abc' });
		const res = mockResponse();

		await handleDeleteCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Category ID must be a valid number.',
		});
	});

	it('returns 404 if category not found', async () => {
		(deleteCategory as jest.Mock).mockResolvedValueOnce(null);
		const req = mockRequest({ id: '999' });
		const res = mockResponse();

		await handleDeleteCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Category not found.',
		});
	});

	it('returns 500 if deleteCategory throws an error', async () => {
		(deleteCategory as jest.Mock).mockImplementationOnce(() => {
			throw new Error('DB error');
		});
		const req = mockRequest({ id: '1' });
		const res = mockResponse();

		await handleDeleteCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Server error while deleting category.',
		});
	});

	it('returns 200 and deleted category on success', async () => {
		const deleted = { id: 1, name: 'Deleted Category' };
		(deleteCategory as jest.Mock).mockResolvedValueOnce(deleted);

		const req = mockRequest({ id: '1' });
		const res = mockResponse();

		await handleDeleteCategory(req, res);

		expect(deleteCategory).toHaveBeenCalledWith(1);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Category deleted successfully!',
			data: deleted,
		});
	});
});
