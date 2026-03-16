import login from './login';
import { Request, Response } from 'express';
import authenticateUser from '../../prisma/services/userService/authenticateUser';
import jwt from 'jsonwebtoken';

jest.mock('../../prisma/services/userService/authenticateUser');
jest.mock('jsonwebtoken');

function mockRequest(body = {}): Request {
	return { body } as Request;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('login controller', () => {
	it('returns 400 if username or password is missing', async () => {
		const req = mockRequest({});
		const res = mockResponse();

		await login(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Username and password are required',
		});
	});

	it('returns 200 and user data with access token on successful login', async () => {
		const mockUser = { id: 1, username: 'testuser' };
		const mockToken = 'mocked.jwt.token';

		(authenticateUser as jest.Mock).mockResolvedValue(mockUser);
		(jwt.sign as jest.Mock).mockReturnValue(mockToken);

		const req = mockRequest({ username: 'testuser', password: 'securepass' });
		const res = mockResponse();

		await login(req, res);

		expect(authenticateUser).toHaveBeenCalledWith('testuser', 'securepass');
		expect(jwt.sign).toHaveBeenCalledWith(
			{ userId: mockUser.id },
			expect.any(String),
			{ expiresIn: '1h' }
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Login successful',
			data: {
				user: mockUser,
				access_token: mockToken,
			},
		});
	});

	it('returns 404 if user is not found', async () => {
		(authenticateUser as jest.Mock).mockRejectedValue(
			new Error('User not found')
		);

		const req = mockRequest({ username: 'ghost', password: 'nopass' });
		const res = mockResponse();

		await login(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: 'User not found',
		});
	});

	it('returns 401 if credentials are invalid', async () => {
		(authenticateUser as jest.Mock).mockRejectedValue(
			new Error('Invalid credentials')
		);

		const req = mockRequest({ username: 'testuser', password: 'wrongpass' });
		const res = mockResponse();

		await login(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Invalid credentials',
		});
	});

	it('returns 500 for unexpected errors', async () => {
		(authenticateUser as jest.Mock).mockRejectedValue('Unexpected failure');

		const req = mockRequest({ username: 'testuser', password: 'securepass' });
		const res = mockResponse();

		await login(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Unexpected error during login.',
		});
	});
});
