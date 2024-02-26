import * as fs from 'fs'
import * as path from 'path'
import { z } from 'zod';
import axios from 'axios'
import { ApiError, ApiResponse } from "../../../../helpers"
import { validateInsuranceCriteriaSchema } from '../helpers/schemas';

interface InsureData {
  Edad: number
  hombreFumador: number 
  hombreNoFumador: number 
  mujerFumadora: number 
  mujerNoFumadora: number 
}

const filepath = path.resolve(__dirname,"../../../../tasas/vidaInsure.json")

const smokingGenderRate = ( filteredByAge: InsureData, gender: string, smoker: boolean, sumaAsegurada: number ): number => {
  let rate: number = 0
  if( gender === 'M') smoker ? rate = filteredByAge.hombreFumador : rate = filteredByAge.hombreNoFumador
  else smoker ? rate = filteredByAge.mujerFumadora : rate = filteredByAge.mujerNoFumadora
  console.log({rate})
  return (rate/1000) * sumaAsegurada
}

export const insuranceComparisonController = async (body: z.infer<typeof validateInsuranceCriteriaSchema>) => {
  const { edad, sumaAsegurada, sexo, fumador } = body
  try {
    const rawData = fs.readFileSync(filepath, 'utf-8');
    const jsonData: InsureData[] = JSON.parse(rawData);
    const [filterdInsureDataByAge] = jsonData.filter(( data: InsureData ) => data.Edad === edad )
    console.log(filterdInsureDataByAge)
    const insureYearlyFee = smokingGenderRate(filterdInsureDataByAge, sexo, fumador, sumaAsegurada)
    console.log({insureYearlyFee})


    const apiUrl = 'https://api-dev.medicatel.red/cotizar/vida/seguros_plus'
    const username = 'ingenieriaDigital'
    const password = '9YEL$m3Kcs?5'
    const requestBody = { edad, sumaAsegurada, sexo };
    const segurosPlusResp = await axios.post(apiUrl, requestBody, {
      auth: { username, password }
    });
    const segurosPlusYearlyFee = segurosPlusResp.data.data.primaAnual
    return new ApiResponse({
      statusCode: 200,
      message: 'Success',
      success: true,
      data: {
        InSure: {
          primaAnual: insureYearlyFee
        },
        SegurosPlus: {
          primaAnual: segurosPlusYearlyFee
        }
      },
      title: 'Success'
    })
  } catch( error ) {
    return new ApiError({ 
      statusCode: 404, 
      message: 'Not Found', 
      title: "Error" 
    })
  }
}