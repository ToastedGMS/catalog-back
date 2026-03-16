import handleDeleteUser from './deleteUser';
import { Request, Response } from 'express';
import deleteUser from '../../../prisma/services/userService/deleteUser';
jest.mock('../../../prisma/services/activityService/logActivity');

jest.mock('../../../prisma/services/userService/deleteUser');

function mockRequest(params = {}): Request {
	return { params } as Request;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('handleDeleteUser', () => {
	it('returns 400 if ID is missing or invalid', async () => {
		const req = mockRequest({ id: 'abc' });
		const res = mockResponse();

		await handleDeleteUser(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Invalid or missing user ID.',
		});
	});

	it('returns 500 if a server error occurs', async () => {
		(deleteUser as jest.Mock).mockImplementationOnce(() => {
			throw new Error('Database error');
		});
		const req = mockRequest({ id: '1' });
		const res = mockResponse();

		await handleDeleteUser(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Server error while deleting user, please try again later.',
		});
	});

	it('returns 200 and the deleted user on success', async () => {
		const mockUser = { id: 1, username: 'deletedUser' };
		(deleteUser as jest.Mock).mockResolvedValue(mockUser);

		const req = mockRequest({ id: '1' });
		const res = mockResponse();

		await handleDeleteUser(req, res);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'User deleted successfully.',
			data: mockUser,
		});
	});
});
