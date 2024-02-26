import { Router } from 'express';
import { validateLoginSchema, validateInsuranceCriteriaSchema } from './helpers/schemas';
import { exampleController } from './controller/user';
import { ApiResponse } from '../../../helpers';
import { insuranceComparisonController } from './controller/insuranceComparisonController';
import { BinaryTreeFromJSON } from '../../../structs/BinaryTreeFromJSON';

export const createRouter = (binaryTreeFromJson: BinaryTreeFromJSON): Router => {
  const router = Router();
  
  const ruta = '/example';
  
  router.post(ruta+'/login',/*Aqui va el middleware */ async function (req, res) {
      const values = await validateLoginSchema.parseAsync(req.body);
  
      const response = await exampleController(values);
  
      return res.status(response.statusCode).json(response);
    }
  );
  
  router.post('/insuranceComparison', async ( req, res ) => {
    const values = await validateInsuranceCriteriaSchema.parseAsync(req.body)
    const response = await insuranceComparisonController( values, binaryTreeFromJson );
    return res.status(200).json(response)
  })

  return router
}
