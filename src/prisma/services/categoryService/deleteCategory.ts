import prisma from '../../client';

export default async function deleteCategory(id: number) {
	try {
		const deletedCategory = await prisma.category.delete({
			where: { id },
		});
		return deletedCategory;
	} catch (error) {
		console.error('Error deleting category:', error);
		throw new Error('Failed to delete category.');
	}
}
