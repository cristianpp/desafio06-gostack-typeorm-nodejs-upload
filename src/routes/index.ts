import { Router } from 'express';
import transactionRouter from './transaction.routes';
import categoriesRouter from './category.routes';

const routes = Router();

routes.use('/transactions', transactionRouter);
routes.use('/categories', categoriesRouter);


export default routes;
