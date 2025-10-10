import handleCreateProduct from './createProduct';
import { Request, Response } from 'express';
import createProduct from '../../../prisma/services/productService/createProduct';
jest.mock('../../../prisma/services/activityService/logActivity');

jest.mock('../../../prisma/services/productService/createProduct');

function mockRequest(body = {}, file?: Partial<Express.Multer.File>): Request {
	return {
		body,
		file: file as Express.Multer.File,
	} as unknown as Request;
}

function mockResponse(): Response {
	const res = {} as Response;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('handleCreateProduct', () => {
	it('returns a 400 if any required field is missing', async () => {
		const req = mockRequest({});
		const res = mockResponse();

		await handleCreateProduct(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
	});

	it('returns 400 if price is not a valid number', async () => {
		const req = mockRequest({
			name: 'Invalid Price Product',
			description: 'This should fail',
			price: 'abc',
			category: '3',
			isHighlight: false,
		});
		const res = mockResponse();

		await handleCreateProduct(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Price must be a valid number',
		});
	});

	it('converts string price value to number correctly', async () => {
		const req = mockRequest({
			name: 'Test Product',
			description: 'Test Description',
			price: '19,99',
			category: '3',
			isHighlight: false,
		});
		const res = mockResponse();

		await handleCreateProduct(req, res);

		expect(createProduct).toHaveBeenCalledWith(
			expect.objectContaining({
				name: 'Test Product',
				description: 'Test Description',
				price: 19.99,
				imageUrl: expect.any(String),
				isHighlight: false,
				category: { connect: { id: 3 } },
			})
		);
	});

	it('uses uploaded image file path if provided', async () => {
		const filePath = 'https://cloudinary.com/image.jpg';
		const req = mockRequest(
			{
				name: 'Cloud Product',
				description: 'With image',
				price: '49.99',
				category: '3',
				isHighlight: false,
			},
			{ path: filePath }
		);
		const res = mockResponse();

		const mockProduct = {
			id: 3,
			name: 'Cloud Product',
			description: 'With image',
			price: 49.99,
			imageUrl: filePath,
			isHighlight: false,
			category: { connect: { id: 3 } },
		};
		(createProduct as jest.Mock).mockResolvedValue(mockProduct);

		await handleCreateProduct(req, res);

		expect(createProduct).toHaveBeenCalledWith(
			expect.objectContaining({
				name: 'Cloud Product',
				description: 'With image',
				price: 49.99,
				imageUrl: filePath,
				isHighlight: false,
				category: { connect: { id: 3 } },
			})
		);

		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Product created successfully!',
			data: mockProduct,
		});
	});

	it('generates a placeholder image if no file is uploaded', async () => {
		const req = mockRequest({
			name: 'RGB Keyboard',
			description: 'Colorful keys',
			price: '299.99',
			category: '3',
			isHighlight: false,
		});
		const res = mockResponse();

		const expectedImageUrl = 'https://placehold.co/200x200?text=RGB%20Keyboard';

		const mockProduct = {
			id: 2,
			name: 'RGB Keyboard',
			description: 'Colorful keys',
			price: 299.99,
			imageUrl: expectedImageUrl,
			isHighlight: false,
			category: { connect: { id: 3 } },
		};
		(createProduct as jest.Mock).mockResolvedValue(mockProduct);

		await handleCreateProduct(req, res);

		expect(createProduct).toHaveBeenCalledWith(
			expect.objectContaining({
				name: 'RGB Keyboard',
				description: 'Colorful keys',
				price: 299.99,
				imageUrl: expectedImageUrl,
				isHighlight: false,
				category: { connect: { id: 3 } },
			})
		);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Product created successfully!',
			data: mockProduct,
		});
	});

	it('returns a 500 if a server error occurs', async () => {
		(createProduct as jest.Mock).mockImplementationOnce(() => {
			throw new Error('Oops, something went wrong!');
		});
		const req = mockRequest({
			name: 'Test Product',
			description: 'Test Description',
			price: '19,99',
			category: '3',
			isHighlight: false,
		});
		const res = mockResponse();

		await handleCreateProduct(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Server error while creating product, please try again later.',
		});
	});

	it('returns a 201 and the created product on success', async () => {
		const req = mockRequest({
			name: 'Test Product',
			description: 'Test Description',
			price: '19,99',
			category: '3',
			isHighlight: false,
		});
		const res = mockResponse();

		const mockProduct = {
			id: 1,
			name: 'Test Product',
			description: 'Test Description',
			price: 19.99,
			imageUrl: 'http://example.com/image.jpg',
			isHighlight: false,
			category: { connect: { id: 3 } },
		};
		(createProduct as jest.Mock).mockResolvedValue(mockProduct);

		await handleCreateProduct(req, res);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Product created successfully!',
			data: mockProduct,
		});
	});
});
