import handleUpdateCategory from './updateCategory';
import updateCategory from '../../../prisma/services/categoryService/updateCategory';
jest.mock('../../../prisma/services/activityService/logActivity');

import { Request, Response } from 'express';

jest.mock('../../../prisma/services/categoryService/updateCategory');

function mockRequest(params = {}, body = {}): Request {
	return { params, body } as Request;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('handleUpdateCategory', () => {
	it('returns 400 if category ID is invalid', async () => {
		const req = mockRequest({ id: 'abc' }, { name: 'Updated Name' });
		const res = mockResponse();

		await handleUpdateCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Category ID must be a valid number.',
		});
	});

	it('returns 400 if update data is missing', async () => {
		const req = mockRequest({ id: '1' }, {});
		const res = mockResponse();

		await handleUpdateCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'No update data provided.',
		});
	});

	it('returns 500 if updateCategory throws an error', async () => {
		(updateCategory as jest.Mock).mockImplementationOnce(() => {
			throw new Error('DB error');
		});
		const req = mockRequest({ id: '1' }, { name: 'New Category Name' });
		const res = mockResponse();

		await handleUpdateCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Server error while updating category.',
		});
	});

	it('returns 200 and updated category on success', async () => {
		const updated = { id: 1, name: 'New Category Name' };
		(updateCategory as jest.Mock).mockResolvedValueOnce(updated);

		const req = mockRequest({ id: '1' }, { name: 'New Category Name' });
		const res = mockResponse();

		await handleUpdateCategory(req, res);

		expect(updateCategory).toHaveBeenCalledWith(1, {
			name: 'New Category Name',
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Category updated successfully!',
			data: updated,
		});
	});
	it('updates category position successfully', async () => {
		const updated = { id: 3, name: 'Games', position: 1 };
		(updateCategory as jest.Mock).mockResolvedValueOnce(updated);

		const req = mockRequest({ id: '3' }, { position: 1 });
		const res = mockResponse();

		await handleUpdateCategory(req, res);

		expect(updateCategory).toHaveBeenCalledWith(3, { position: 1 });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Category updated successfully!',
			data: updated,
		});
	});
});
