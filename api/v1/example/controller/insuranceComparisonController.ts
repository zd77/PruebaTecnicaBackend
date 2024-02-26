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

interface InsuranceRateStrategy {
  calculateRate(filteredByAge: InsureData, smoker: boolean): number;
}

class MaleInsuranceRateStrategy implements InsuranceRateStrategy {
  calculateRate(filteredByAge: InsureData, smoker: boolean): number {
    return smoker ? filteredByAge.hombreFumador : filteredByAge.hombreNoFumador
  }
}
class FemaleInsuranceRateStrategy implements InsuranceRateStrategy {
  calculateRate(filteredByAge: InsureData, smoker: boolean): number {
    return smoker ? filteredByAge.mujerFumadora : filteredByAge.mujerNoFumadora
  }
}

class InsuranceCalculator {
  private readonly strategies: Record<string, InsuranceRateStrategy>;
  constructor(){
    this.strategies = {
      M: new MaleInsuranceRateStrategy,
      F: new FemaleInsuranceRateStrategy
    }
  }

  calculateRate(filteredByAge: InsureData, gender: string, smoker: boolean, sumaAsegurada: number): number {
    const strategy = this.strategies[gender.toUpperCase()]
    if(!strategy) {
      throw new Error('Invalid gender provider')
    }
    const rate = strategy.calculateRate(filteredByAge, smoker)
    return (rate/1000)*sumaAsegurada
  }
}

const getSegurosPlusYearlyFee = async (edad: number, sumaAsegurada: number, sexo: string): Promise<number> => {
  const apiUrl = 'https://api-dev.medicatel.red/cotizar/vida/seguros_plus'
  const username = 'ingenieriaDigital'
  const password = '9YEL$m3Kcs?5'
  const requestBody = { edad, sumaAsegurada, sexo };
  const segurosPlusResp = await axios.post(apiUrl, requestBody, {
    auth: { username, password }
  });
  return segurosPlusResp.data.data.primaAnual
}

export const insuranceComparisonController = async (body: z.infer<typeof validateInsuranceCriteriaSchema>) => {
  const { edad, sumaAsegurada, sexo, fumador } = body
  try {
    const rawData = fs.readFileSync(filepath, 'utf-8');
    const jsonData: InsureData[] = JSON.parse(rawData);
    const [filterdInsureDataByAge] = jsonData.filter(( data: InsureData ) => data.Edad === edad )

    if(!filterdInsureDataByAge) throw new Error('No data available for the provided age')

    const insuranceCalculator = new InsuranceCalculator()
    const insureYearlyFee = insuranceCalculator.calculateRate(
      filterdInsureDataByAge,
      sexo,
      fumador,
      sumaAsegurada
    )

    const segurosPlusYearlyFee = await getSegurosPlusYearlyFee(edad, sumaAsegurada, sexo)
    
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