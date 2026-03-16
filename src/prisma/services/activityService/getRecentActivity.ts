import prisma from '../../client';

export default async function getRecentActivity(limit?: number) {
	try {
		const recentActivity = await prisma.activityLog.findMany({
			orderBy: {
				timestamp: 'desc',
			},
			...(limit ? { take: limit } : {}),
			include: {
				user: {
					select: {
						id: true,
						username: true,
					},
				},
			},
		});
		return recentActivity;
	} catch (error) {
		console.error('Error fetching recent activity:', error);
		throw new Error('Failed to fetch recent activity.');
	}
}
