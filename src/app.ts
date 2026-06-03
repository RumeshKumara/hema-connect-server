import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
	res.status(200).json({ ok: true, message: 'Server is running' });
});

app.use('/api/auth', authRoutes);

app.use((_req: Request, res: Response) => {
	res.status(404).json({ message: 'Route not found' });
});

export default app;
