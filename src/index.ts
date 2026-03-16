require('dotenv').config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(helmet());

const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	})
);

import categoryRouter from './routers/category/categoryRouter';
import productRouter from './routers/product/productRouter';
import userRouter from './routers/user/userRouter';
import authRouter from './routers/auth/authRouter';
import activityRouter from './routers/activity/activityRouter';

app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/activity', activityRouter);

app.listen(3000, () => {
	console.log('Listening on port 3000');
});
