import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

import { getCustomRepository, getRepository } from 'typeorm';
import Category from '../models/Category';


import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {


  public async execute({ title, value, type , category}: Request): Promise<Transaction> {

    const transactionRepository = getCustomRepository(TransactionsRepository);

    const categoryRepository = getRepository(Category);

    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
       },
     });

     if(!transactionCategory){
       transactionCategory = categoryRepository.create({
         title: category,
       });

       await categoryRepository.save(transactionCategory);

     };


    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Transaction type is invalid');
    }

   const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
