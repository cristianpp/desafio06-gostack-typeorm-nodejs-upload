import { Router } from 'express';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';
const transactionRouter = Router();

const upload = multer(uploadConfig);

transactionRouter.get('/', async (request, response) => {

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactions = await transactionsRepository.find({
      select: ["id", "title","value","type","category","created_at","updated_at"],
      relations: ["category"]
    });

    const balance = await transactionsRepository.getBalance();

    return response.json({ transactions, balance });

});

transactionRouter.post('/', async (request, response) => {

    const { title, value, type, category } = request.body;

    const createTransaction = new CreateTransactionService();

    const transaction = await createTransaction.execute({
      title,
      value,
      type,
      category,
    });

    return response.json(transaction);

});

transactionRouter.delete('/:id', async (request, response) => {

    const id  = request.params;
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    await transactionsRepository.delete(id);

    return response.status(204).send();

});

transactionRouter.post('/import', upload.single('file') ,async (request, response) => {

  const importService = new ImportTransactionsService();

  const transactions = await importService.execute(
    request.file.path);

  return response.json({transactions});

});

export default transactionRouter;
