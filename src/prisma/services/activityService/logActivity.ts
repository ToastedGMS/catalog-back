import prisma from '../../client';
import { Prisma } from '../../../generated/prisma';

export default async function logActivity(data: Prisma.ActivityLogCreateInput) {
	try {
		return prisma.activityLog.create({
			data,
		});
	} catch (error) {
		console.error('Error logging activity:', error);
		throw new Error('Failed to log activity.');
	}
}
