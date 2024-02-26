import { Router } from 'express';
import { validateLoginSchema, validateInsuranceCriteriaSchema } from './helpers/schemas';
import { exampleController } from './controller/user';
import { ApiResponse } from '../../../helpers';
import { insuranceComparisonController } from './controller/insuranceComparisonController';

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
  const response = await insuranceComparisonController( values );
  return res.status(200).json(response)
})

export default router;
