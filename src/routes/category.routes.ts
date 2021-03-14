import { Router } from 'express';

import { getCustomRepository } from 'typeorm';
import CategoriesRepository from '../repositories/CategoriesRepository';
const categoriesRouter = Router();


categoriesRouter.post('/', async (request, response) => {

   const { title } = request.body;

   const categoriesRepository = getCustomRepository(CategoriesRepository);

    const category = categoriesRepository.create({
     title,
   });

   await categoriesRepository.save(category);

   return response.status(201).json({category});

});

export default categoriesRouter;
