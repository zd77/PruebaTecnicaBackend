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
    const authHeaders = req.headers['authorization']
    if( !authHeaders ) return res.status(401).json('Unvalid credentials')
    const token = authHeaders.split(' ')[1]
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8')
    const credentials = decodedToken.split(':')
    const values = await validateInsuranceCriteriaSchema.parseAsync(req.body)
    const response = await insuranceComparisonController( values, credentials, binaryTreeFromJson );
    return res.status(200).json(response)
  })

  return router
}
