import { Request, Response } from 'express';
import getRecentActivity from '../../prisma/services/activityService/getRecentActivity';
import handleGetActivity from './getActivity';
jest.mock('../../prisma/services/activityService/getRecentActivity');

function mockRequest(query = {}): Request {
	return { query } as Request;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('handleGetActivity', () => {
	it('should return 400 for invalid limit', async () => {
		const req = mockRequest({ limit: 'invalid' });
		const res = mockResponse();

		await handleGetActivity(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Invalid limit parameter.',
		});
	});

	it('should return 500 if service throws error', async () => {
		const req = mockRequest();
		const res = mockResponse();
		(getRecentActivity as jest.Mock).mockRejectedValue(new Error('DB error'));

		await handleGetActivity(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Server error while fetching activity log.',
		});
	});

	it('should return activity logs with default limit', async () => {
		const req = mockRequest();
		const res = mockResponse();
		const mockLogs = [
			{
				id: 1,
				action: 'Created Product',
				timestamp: new Date(),
				user: { id: 1, username: 'alice' },
				metadata: { productId: 42 },
			},
		];
		(getRecentActivity as jest.Mock).mockResolvedValue(mockLogs);

		await handleGetActivity(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(mockLogs);
	});

	it('should return activity logs with custom limit', async () => {
		const req = mockRequest({ limit: '5' });
		const res = mockResponse();
		const mockLogs = [
			{
				id: 1,
				action: 'Logged In',
				timestamp: new Date(),
				user: { id: 2, username: 'bob' },
				metadata: {},
			},
		];
		(getRecentActivity as jest.Mock).mockResolvedValue(mockLogs);

		await handleGetActivity(req, res);

		expect(getRecentActivity).toHaveBeenCalledWith(5);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(mockLogs);
	});
});
