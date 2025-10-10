import { Request, Response } from 'express';
import getManyProducts from '../../../prisma/services/productService/getManyProducts';
import handleGetProducts from './getManyProducts';
jest.mock('../../../prisma/services/productService/getManyProducts');

function mockRequest(params = {}): Request {
	return { params } as Request;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('handleGetProducts', () => {
	it('should return a 500 if an error occurs', async () => {
		const req = mockRequest();
		const res = mockResponse();
		(getManyProducts as jest.Mock).mockRejectedValue(
			new Error('Database error')
		);

		await handleGetProducts(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Server error while fetching products, please try again later.',
		});
	});

	it('should return products if ok', async () => {
		const req = mockRequest();
		const res = mockResponse();
		const mockProducts = [
			{
				id: 1,
				name: 'Smartphone',
				description: 'Latest model',
				price: '699.99',
				imageUrl: 'http://example.com/smartphone.jpg',
				onSale: true,
				previousPrice: '799.99',
				createdAt: new Date(),
				updatedAt: new Date(),
				categoryId: 1,
				category: { id: 1, name: 'Electronics' },
			},
		];
		(getManyProducts as jest.Mock).mockResolvedValue(mockProducts);

		await handleGetProducts(req, res);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(mockProducts);
	});
});
