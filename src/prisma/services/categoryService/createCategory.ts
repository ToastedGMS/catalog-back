import { Prisma } from '../../../generated/prisma';
import prisma from '../../client';

export default async function createCategory(data: Prisma.CategoryCreateInput) {
	try {
		const category = await prisma.category.create({
			data,
		});
		return category;
	} catch (error) {
		console.error('Error creating category:', error);
		throw new Error('Failed to create category. Please check provided input.');
	}
}
