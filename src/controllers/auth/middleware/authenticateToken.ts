import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
	user?: string | jwt.JwtPayload;
}

function authenticateToken(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({ message: 'Access token required.' });
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
		if (err) {
			if (err.name === 'TokenExpiredError') {
				return res
					.status(401)
					.json({
						message: 'Access token expired. Realize o login novamente.',
					});
			}
			return res.status(403).json({ message: 'Access denied.' });
		}
		req.user = user;
		next();
	});
}

export default authenticateToken;
