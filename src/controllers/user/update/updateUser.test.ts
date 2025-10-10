import handleUpdateUser from './updateUser';
import { Request, Response } from 'express';
import updateUser from '../../../prisma/services/userService/updateUser';
jest.mock('../../../prisma/services/activityService/logActivity');

jest.mock('../../../prisma/services/userService/updateUser');

function mockRequest(params = {}, body = {}): Request {
	return { params, body } as Request;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('handleUpdateUser', () => {
	it('returns 400 if ID is missing or invalid', async () => {
		const req = mockRequest({ id: 'abc' }, { username: 'newname' });
		const res = mockResponse();

		await handleUpdateUser(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Invalid or missing user ID.',
		});
	});

	it('returns 400 if no update fields are provided', async () => {
		const req = mockRequest({ id: '1' }, {});
		const res = mockResponse();

		await handleUpdateUser(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'No update fields provided.',
		});
	});

	it('returns 500 if a server error occurs', async () => {
		(updateUser as jest.Mock).mockImplementationOnce(() => {
			throw new Error('Database error');
		});
		const req = mockRequest({ id: '1' }, { username: 'newname' });
		const res = mockResponse();

		await handleUpdateUser(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Server error while updating user, please try again later.',
		});
	});

	it('returns 200 and the updated user on success', async () => {
		const mockUser = { id: 1, username: 'updatedUser' };
		(updateUser as jest.Mock).mockResolvedValue(mockUser);

		const req = mockRequest({ id: '1' }, { username: 'updatedUser' });
		const res = mockResponse();

		await handleUpdateUser(req, res);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'User updated successfully.',
			data: mockUser,
		});
	});
});
