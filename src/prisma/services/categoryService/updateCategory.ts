import prisma from '../../client';

export default async function updateCategory(
	id: number,
	data: { name?: string; position?: number }
) {
	try {
		const updatedCategory = await prisma.category.update({
			where: { id },
			data,
		});
		return updatedCategory;
	} catch (error) {
		console.error('Error updating category:', error);
		throw new Error('Failed to update category.');
	}
}
