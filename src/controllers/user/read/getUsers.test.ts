import handleGetUsers from './getUsers';
import { Request, Response } from 'express';
import getUsers from '../../../prisma/services/userService/getUsers';
jest.mock('../../../prisma/services/userService/getUsers');

function mockRequest(): Request {
	return {} as Request;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('handleGetUsers', () => {
	it('returns 500 if a server error occurs', async () => {
		(getUsers as jest.Mock).mockImplementationOnce(() => {
			throw new Error('Database error');
		});
		const req = mockRequest();
		const res = mockResponse();

		await handleGetUsers(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Server error while fetching users, please try again later.',
		});
	});

	it('returns 200 and the list of users on success', async () => {
		const mockUsers = [
			{ id: 1, username: 'alice' },
			{ id: 2, username: 'bob' },
		];
		(getUsers as jest.Mock).mockResolvedValue(mockUsers);

		const req = mockRequest();
		const res = mockResponse();

		await handleGetUsers(req, res);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Users fetched successfully.',
			data: mockUsers,
		});
	});
});
