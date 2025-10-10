import authenticateToken from './authenticateToken';
process.env.ACCESS_TOKEN_SECRET = 'test_secret';
import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';

jest.mock('jsonwebtoken');

function mockRequest(headers = {}): any {
	return { headers } as any;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('authenticateToken middleware', () => {
	it('returns 401 if no token is provided', () => {
		const req = mockRequest(); // no authorization header
		const res = mockResponse();
		const next = jest.fn();

		authenticateToken(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Access token required.',
		});
		expect(next).not.toHaveBeenCalled();
	});

	it('returns 401 if token is expired', () => {
		const req = mockRequest({ authorization: 'Bearer expiredtoken' });
		const res = mockResponse();
		const next = jest.fn();

		const expiredError = new Error('jwt expired');
		(expiredError as any).name = 'TokenExpiredError';

		(jwt.verify as jest.Mock).mockImplementation((_, __, cb) =>
			cb(expiredError, null)
		);

		authenticateToken(req, res, next);

		expect(jwt.verify).toHaveBeenCalledWith(
			'expiredtoken',
			'test_secret',
			expect.any(Function)
		);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Access token expired. Realize o login novamente.',
		});
		expect(next).not.toHaveBeenCalled();
	});

	it('returns 403 if token is invalid', () => {
		const req = mockRequest({ authorization: 'Bearer invalidtoken' });
		const res = mockResponse();
		const next = jest.fn();

		const invalidError = new Error('Invalid token');
		(invalidError as any).name = 'JsonWebTokenError';

		(jwt.verify as jest.Mock).mockImplementation((_, __, cb) =>
			cb(invalidError, null)
		);

		authenticateToken(req, res, next);

		expect(jwt.verify).toHaveBeenCalledWith(
			'invalidtoken',
			'test_secret',
			expect.any(Function)
		);
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Access denied.',
		});
		expect(next).not.toHaveBeenCalled();
	});

	it('calls next and attaches user if token is valid', () => {
		const mockUser = { id: 1, username: 'testuser' };
		const req = mockRequest({ authorization: 'Bearer validtoken' });
		const res = mockResponse();
		const next = jest.fn();

		(jwt.verify as jest.Mock).mockImplementation((_, __, cb) =>
			cb(null, mockUser)
		);

		authenticateToken(req, res, next);

		expect(jwt.verify).toHaveBeenCalledWith(
			'validtoken',
			'test_secret',
			expect.any(Function)
		);
		expect(req.user).toEqual(mockUser);
		expect(next).toHaveBeenCalled();
	});
});
