import { Request, Response, NextFunction } from 'express';

interface User {
	id: string;
	name: string;
	email: string;
}

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}

export const verifyAuth = (req: Request, res: Response, next: NextFunction): Response | void => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Missing or invalid authorization header' });
	}

	const token = authHeader.split(' ')[1];

	if (token !== 'demo-token') {
		return res.status(401).json({ message: 'Invalid token' });
	}

	req.user = {
		id: '1',
		name: 'Demo User',
		email: 'demo@example.com',
	};

	next();
};
