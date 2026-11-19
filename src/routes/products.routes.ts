import { Router } from 'express';
import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  getProductsController,
  updateProductController,
} from '../controllers/products.controller';

const productsRouter = Router();

productsRouter.get('/', getProductsController);
productsRouter.get('/:id', getProductByIdController);
productsRouter.post('/', createProductController);
productsRouter.put('/:id', updateProductController);
productsRouter.delete('/:id', deleteProductController);

export default productsRouter;
