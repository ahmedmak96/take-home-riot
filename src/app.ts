import express from 'express';
import routes from './routes';

const app = express();
app.use(express.json({ strict: false }));
app.use(routes);

export default app;
