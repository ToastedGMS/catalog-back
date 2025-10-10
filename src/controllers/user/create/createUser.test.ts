import handleCreateUser from './createUser';
import { Request, Response } from 'express';
import createUser from '../../../prisma/services/userService/createUser';
jest.mock('../../../prisma/services/activityService/logActivity');
jest.mock('../../../prisma/services/userService/createUser');

function mockRequest(body = {}): Request {
	return { body } as Request;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('handleCreateUser', () => {
	it('returns 400 if username or password is missing', async () => {
		const req = mockRequest({});
		const res = mockResponse();

		await handleCreateUser(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Username and password are required.',
		});
	});

	it('returns 500 if a server error occurs', async () => {
		(createUser as jest.Mock).mockImplementationOnce(() => {
			throw new Error('Database error');
		});
		const req = mockRequest({ username: 'testuser', password: 'secret' });
		const res = mockResponse();

		await handleCreateUser(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Server error while creating user, please try again later.',
		});
	});

	it('returns 201 and the created user on success', async () => {
		const mockUser = {
			id: 1,
			username: 'testuser',
		};
		(createUser as jest.Mock).mockResolvedValue(mockUser);

		const req = mockRequest({ username: 'testuser', password: 'secret' });
		const res = mockResponse();

		await handleCreateUser(req, res);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			message: 'User created successfully!',
			data: mockUser,
		});
	});
});
