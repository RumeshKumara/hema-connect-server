import { Request, Response } from 'express';

interface RegisterRequest extends Request {
	body: {
		name?: string;
		email?: string;
	};
}

interface LoginRequest extends Request {
	body: {
		email?: string;
	};
}

export const register = (req: RegisterRequest, res: Response): void => {
	const { name, email } = req.body;

	res.status(201).json({
		message: 'Register endpoint is working',
		user: {
			name: name || null,
			email: email || null,
		},
	});
};

export const login = (req: LoginRequest, res: Response): void => {
	const { email } = req.body;

	res.status(200).json({
		message: 'Login endpoint is working',
		token: 'demo-token',
		email: email || null,
	});
};

export const me = (req: Request, res: Response): void => {
	res.status(200).json({
		message: 'Protected route is working',
		user: req.user,
	});
};
