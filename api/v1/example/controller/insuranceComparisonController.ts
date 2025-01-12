import * as fs from 'fs'
import * as path from 'path'
import { z } from 'zod';
import axios from 'axios'
import { ApiError, ApiResponse } from "../../../../helpers"
import { validateInsuranceCriteriaSchema } from '../helpers/schemas';
import { InsureData } from "../interfaces/insureData"
import { BinaryTreeFromJSON } from '../../../../structs/BinaryTreeFromJSON';

const segurosPlusURI = 'https://api-dev.medicatel.red/cotizar/vida/seguros_plus'

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

const getSegurosPlusYearlyFee = async (edad: number, sumaAsegurada: number, sexo: string, credentials: string[]): Promise<number> => {
  const [user, pass] = credentials
  const apiUrl = segurosPlusURI
  const username = user
  const password = pass
  const requestBody = { edad, sumaAsegurada, sexo };
  const segurosPlusResp = await axios.post(apiUrl, requestBody, {
    auth: { username, password }
  });
  return segurosPlusResp.data.data.primaAnual
}

export const insuranceComparisonController = async (
  body: z.infer<typeof validateInsuranceCriteriaSchema>,
  credentials: string[],
  binaryTreeFromJson: BinaryTreeFromJSON
) => {
  const { edad, sumaAsegurada, sexo, fumador } = body
  try {
    const filterdInsureDataByAge = binaryTreeFromJson.buscarPorEdad(edad);

    if(!filterdInsureDataByAge) throw new Error('No data available for the provided age')

    const insuranceCalculator = new InsuranceCalculator()
    const insureYearlyFee = insuranceCalculator.calculateRate(
      filterdInsureDataByAge,
      sexo,
      fumador,
      sumaAsegurada
    )

    const segurosPlusYearlyFee = await getSegurosPlusYearlyFee(edad, sumaAsegurada, sexo, credentials)

    return new ApiResponse({
      statusCode: 200,
      title: 'Insurance Yearly Fee Comparison',
      message: 'The comparasion of yearly fee between insurances was successfull',
      success: true,
      data: {
        InSure: {
          primaAnual: insureYearlyFee
        },
        SegurosPlus: {
          primaAnual: segurosPlusYearlyFee
        }
      },
    })
  } catch( error ) {
    return new ApiError({ 
      statusCode: 404, 
      message: 'Not Found', 
      title: "Error" 
    })
  }
}