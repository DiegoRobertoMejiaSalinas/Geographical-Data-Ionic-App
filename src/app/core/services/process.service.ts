import { Injectable } from '@angular/core';
import { CONTAMINATION_LEVEL_BASE } from 'src/app/shared/contaminationLevel.cst';
import { FC_HUMIDITY } from 'src/app/shared/fcHumidity.cs';
import { INSULATOR_DATA_BASE } from 'src/app/shared/insulatorData.cst';
import { LINE_TRANSMISION_DATA_BASE } from 'src/app/shared/lineTransmissionData.cst';
import { StorageService } from './storage.service';
import {FC_RAIN_BASE} from "src/app/shared/fcRain.cst"

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
   /*
   * GEOGRAPHICAL DATA
   */
   altitude: number;                         //* A
   temperature: number;                      //* B
   relativeHumidity: number;                 //* Q
   intersectionValue: number;                //* Z: Producto de interseccion de (B interseccion Q) (Dependiente)
 
   /*
    * LINE TRANSMISSION DATA
    */
   maximumTension: number;                   //* C
   isolationBasicLevel: number;              //* D
   criticalDistance: number;                 //* D_1 (Dependiente)
   conmutationBasicLevel: number;            //* E
   contaminationLevel: number;               //* F
   precipitationIntensity: number;           //* R
 
   /*
    * MECHANICAL CALCULATION
    */
   conductorsPerPhaseNumber: number;         //* N_1
   maximumHorizontalTension: number;         //* T_1
   chainHardwareWeight: number;              //* P_H
   windSpeed: number;                        //* V_1
   verticalStressTransmitted: number;        //* P_1
 
   /*
    * INSULATOR DATA
    */
   insulatorTypeValue: number;               //* G (Dependiente)
   insulatorCodeLabel: string;               //* H (Dependiente)
   electricCharge: number;                   //* I (Dependiente)
   creepageDistance: number;                 //* J (Dependiente)
   step: number;                             //* K (Dependiente)
   diameter: number;                         //* L (Dependiente)
   TF_Dry: number;                           //* M (Dependiente)
   TF_Rain: number;                          //* N (Dependiente)
   TF_Ray: number;                           //* O (Dependiente)
   insulatorWeight: number;                  //* P (Dependiente)

   /*
   * COMPLEMENTARY DATA FOR RESULT
    */
   safetyCoefficientAgainstInsulatorBreakageForNormal: number                  //* C_2 Coeficiente de seguridad a la rotura de los aisladores con cargas normales
   safetyCoefficientAgainstInsulatorBreakageForAbnormalLoads: number            //* C_1 Coeficiente de seguridad a la rotura de los aisladores con cargas anormales
   chainLength: number                                                          //* L_1 Longitud de la cadena
   chainWeightWithInsulatorsAndHardware: number                                 //* P_2 Peso de la cadena de aisladores y herrajes
   chainWeight: number                                                          //* P_3 Peso de la cadena
   windStressOnChain: number                                                    //* E_1 Esfuerzo del viento sobre la cadena
   TCF_EvaluationByManeuverOrIndustrialFrequency: number                         //* W
   TCF_RayTypeImpulse:number                                                     //* X
   insulatorsNeededResult: number                                               //* A_1 Aisladores Necesitarios

   constructor(private readonly storageService:StorageService){
        /*
        * Ahora seteamos los valores que declaramos antes en base a los del Storage
        */
        this.storageService.geographicalData.subscribe(data => {
            this.altitude = data.altitude
            this.temperature = data.temperature
            this.relativeHumidity = data.relativeHumidity
            //* Aqui definimos el valor de una variable que depende de otras dos
            this.intersectionValue = FC_HUMIDITY.find(valueObject => valueObject.relativeHumidityValue == data.relativeHumidity && valueObject.temperatureValue == data.temperature).resultValue
        })

         this.storageService.lineTransmissionData.subscribe(data => {
            this.maximumTension = LINE_TRANSMISION_DATA_BASE.find(t => t.id == data.maximumTensionId).value
            
            const foundConmutationBasicLevel = LINE_TRANSMISION_DATA_BASE.find(t => t.id == data.maximumTensionId)
            .conmutationBasicLevelList.find(m => m.id == data.conmutationBasicLevelId)

            this.conmutationBasicLevel = foundConmutationBasicLevel.value

            const foundIsolationBasicLevel = foundConmutationBasicLevel.isolationBasicLevelsList.find(o=> o.id == data.isolationBasicLevelId)
            this.isolationBasicLevel = foundIsolationBasicLevel.value

            //* Aqui definimos el valor de una variable que depende del resultado de una anterior
            this.criticalDistance= foundIsolationBasicLevel.criticalDistanceValue

            this.contaminationLevel = CONTAMINATION_LEVEL_BASE.find(t => t.id == data.contaminationLevelId).value
            this.precipitationIntensity = FC_RAIN_BASE.find(t => t.id == data.precipitationIntensityId).value
         })

         this.storageService.mechanicalCalculation.subscribe(data => {
            this.windSpeed = data.windSpeed
            this.chainHardwareWeight = data.chainHardwareWeight
            this.conductorsPerPhaseNumber = data.conductorsPerPhaseNumber
            this.verticalStressTransmitted = data.verticalStressTransmitted
            this.maximumHorizontalTension = data.maximumHorizontalTension
         })

         this.storageService.insulatorData.subscribe(data => {
            this.insulatorTypeValue = INSULATOR_DATA_BASE.find(t => t.id == data.insulatorTypeId).value

            const foundInstanceInsulatorCode = INSULATOR_DATA_BASE.find(t => t.id == data.insulatorTypeId).codes.find(m => m.id == data.insulatorCodeId)
            this.insulatorCodeLabel = foundInstanceInsulatorCode.name
            this.electricCharge = foundInstanceInsulatorCode.electricCharge
            this.creepageDistance = foundInstanceInsulatorCode.creepageDistance
            this.step = foundInstanceInsulatorCode.step
            this.diameter = foundInstanceInsulatorCode.diameter
            this.TF_Dry = foundInstanceInsulatorCode.TF_Dry
            this.TF_Rain = foundInstanceInsulatorCode.TF_Rain
            this.TF_Ray = foundInstanceInsulatorCode.TF_Ray
            this.insulatorWeight = foundInstanceInsulatorCode.insulatorWeight
         })
   }

  firstMethod(): number {
    const FIRST_TEMP_CONSTANT = 1000;
    const SECOND_TEMP_CONSTANT = 8150;
    const THIRD_TEMP_CONSTANT = 300;
    const FORTH_TEMP_CONSTANT = 1.15;
    const FIFTH_TEMP_CONSTANT = 0.0005;
    const SIXTH_TEMP_CONSTANT = 0.85;

    let tempVariable;

    if (this.altitude > FIRST_TEMP_CONSTANT) {
      tempVariable = Math.exp(
        this.insulatorTypeValue * (this.altitude / SECOND_TEMP_CONSTANT)
      );
    } else {
      tempVariable = 1;
    }

    //* Creamos la variable N1
    let N1 = 0;

    if (this.diameter >= THIRD_TEMP_CONSTANT) {
      N1 =
        (FORTH_TEMP_CONSTANT *
          this.contaminationLevel *
          tempVariable *
          (FIFTH_TEMP_CONSTANT * this.diameter * SIXTH_TEMP_CONSTANT) *
          this.maximumTension) /
        (this.creepageDistance * Math.sqrt(3));
    } else {
      N1 =
        (FORTH_TEMP_CONSTANT *
          this.contaminationLevel *
          tempVariable *
          this.maximumTension) /
        (this.creepageDistance * Math.sqrt(3));
    }

    //* Creamos la variable S
    let S =
      (N1 * this.creepageDistance * Math.sqrt(3)) /
      (this.maximumTension * FORTH_TEMP_CONSTANT * this.criticalDistance);

    const FIRST_COMPARABLE_VALUE = 22;
    const SECOND_COMPARABLE_VALUE = 4.25;
    const THIRD_COMPARABLE_VALUE = 3.5;
    const FORTH_COMPARABLE_VALUE = 27.8;
    const FIFTH_COMPARABLE_VALUE = 4.4;
    const SIXTH_COMPARABLE_VALUE = 3.625;
    const SEVENTH_COMPARABLE_VALUE = 34.7;
    const EIGHTH_COMPARABLE_VALUE = 4.55;
    const NINETH_COMPARABLE_VALUE = 3.75;
    const TENTH_COMPARABLE_VALUE = 43.3;
    const ELEVENTH_COMPARABLE_VALUE = 4.7;
    const TWELVETH_COMPARABLE_VALUE = 3.875;
    const THIRTEENTH_COMPARABLE_VALUE = 53.7;
    const FORTEENTH_COMPARABLE_VALUE = 4.85;
    const FIFTEENTH_COMPARABLE_VALUE = 4.0;

    if (this.contaminationLevel == FIRST_COMPARABLE_VALUE) {
      if (S >= SECOND_COMPARABLE_VALUE) {
        throw new Error('Cambiar perfil');
      } else if (S >= THIRD_COMPARABLE_VALUE) {
        throw new Error('El perfil presente no es el adecuado');
      }
    }
    if (this.contaminationLevel == FORTH_COMPARABLE_VALUE) {
      if (S >= FIFTH_COMPARABLE_VALUE) {
        throw new Error('Cambiar perfil');
      } else if (S >= SIXTH_COMPARABLE_VALUE) {
        throw new Error('El perfil presente no es el adecuado');
      }
    }
    if (this.contaminationLevel == SEVENTH_COMPARABLE_VALUE) {
      if (S >= EIGHTH_COMPARABLE_VALUE) {
        throw new Error('Cambiar perfil');
      } else if (S >= NINETH_COMPARABLE_VALUE) {
        throw new Error('El perfil presente no es el adecuado');
      }
    }
    if (this.contaminationLevel == TENTH_COMPARABLE_VALUE) {
      if (S >= ELEVENTH_COMPARABLE_VALUE) {
        throw new Error('Cambiar perfil');
      } else if (S >= TWELVETH_COMPARABLE_VALUE) {
        throw new Error('El perfil presente no es el adecuado');
      }
    }
    if (this.contaminationLevel == THIRTEENTH_COMPARABLE_VALUE) {
      if (S >= FORTEENTH_COMPARABLE_VALUE) {
        throw new Error('Cambiar perfil');
      } else if (S >= FIFTEENTH_COMPARABLE_VALUE) {
        throw new Error('El perfil presente no es el adecuado');
      }
    }

    //* Creamos la variable N2
    let N2 = 1 + (this.criticalDistance - 200) / this.step;

    let Y = 0;

    if (N1 - N2 >= 0) {
      Y = N1;
    } else {
      Y = N2;
    }

    return Y;
  }

  secondMethod(): number {
    let supportTempVariableHelp;
    const MAX_TENSION_ALLOWED = 230;
    const TEMP_CONSTANT = 1.15;
    const SECOND_TEMP_CONSTANT = 3;
    const THIRD_TEMP_CONSTANT = 297.92;
    const FORTH_TEMP_CONSTANT = 0.885;
    const FIFTH_TEMP_CONSTANT = 1000;
    const SIXTH_TEMP_CONSTANT = 273.15;
    const SEVENTH_TEMP_CONSTANT = 0.992;
    const EIGHTH_TEMP_CONSTANT = 0.961;

    if (this.maximumTension > MAX_TENSION_ALLOWED) {
      supportTempVariableHelp = 0.9;
    } else {
      supportTempVariableHelp = 1;
    }

    //* Calculo de V - Vamos a crear V
    let NUMERATOR =
      this.maximumTension * TEMP_CONSTANT * this.contaminationLevel;
    let DENOMINATOR =
      Math.sqrt(SECOND_TEMP_CONSTANT) *
      this.creepageDistance *
      Math.pow(
        (THIRD_TEMP_CONSTANT *
          Math.pow(FORTH_TEMP_CONSTANT, this.altitude / FIFTH_TEMP_CONSTANT)) /
          (SIXTH_TEMP_CONSTANT + this.temperature),
        supportTempVariableHelp
      );

    let V = NUMERATOR / DENOMINATOR;

    //* Calculo de X - Vamos a crear X
    let X_Numerator =
      this.isolationBasicLevel *
      this.intersectionValue *
      (1 + ((this.altitude - FIFTH_TEMP_CONSTANT) / Math.pow(10, 6)) * 125);
    let X_Denominator =
      (EIGHTH_TEMP_CONSTANT *
        this.precipitationIntensity *
        THIRD_TEMP_CONSTANT *
        Math.pow(FORTH_TEMP_CONSTANT, this.altitude / FIFTH_TEMP_CONSTANT)) /
      (SIXTH_TEMP_CONSTANT + this.temperature);

    this.TCF_RayTypeImpulse = X_Numerator / X_Denominator;

    //* Calculo de W - Vamos a crear W
    let W_Numerator =
      this.conmutationBasicLevel *
      this.intersectionValue *
      (1 + ((this.altitude - FIFTH_TEMP_CONSTANT) * 125) / Math.pow(10, 6));
    let W_Denominator =
      (SEVENTH_TEMP_CONSTANT *
        this.precipitationIntensity *
        THIRD_TEMP_CONSTANT *
        Math.pow(FORTH_TEMP_CONSTANT, this.altitude / FIFTH_TEMP_CONSTANT)) /
      (SIXTH_TEMP_CONSTANT + this.temperature);

    this.TCF_EvaluationByManeuverOrIndustrialFrequency =
      W_Numerator / W_Denominator;

    if (
      V * 0 > this.TCF_RayTypeImpulse &&
      V * this.TF_Dry > this.TCF_EvaluationByManeuverOrIndustrialFrequency &&
      V * this.TF_Rain > this.TCF_EvaluationByManeuverOrIndustrialFrequency
    ) {
      return V;
    } else {
      throw new Error('Aumentar la cantidad de aisladores');
    }
  }

  mainFunction() {
    //* Creamos las variables V y Y
    let V = this.secondMethod();
    let Y = this.firstMethod();

    // let A_1; //* Número de aisladores necesarios

    if (V >= Y) {
      this.insulatorsNeededResult = Math.ceil(Y);
    } else {
      this.insulatorsNeededResult = Math.ceil(V);
    }

    const FIRST_TEMP_CONSTANT = 9.81;
    const SECOND_TEMP_CONSTANT = 10;
    const THIRD_TEMP_CONSTANT = 70;
    const FORTH_TEMP_CONSTANT = 120;
    const FIFTH_TEMP_CONSTANT = 2;
    const SIXTH_TEMP_CONSTANT = 1000;

    this.chainWeight = this.insulatorsNeededResult * this.insulatorWeight;
    this.chainWeightWithInsulatorsAndHardware =
      (this.chainWeight * FIRST_TEMP_CONSTANT) / SECOND_TEMP_CONSTANT +
      this.chainHardwareWeight;

    this.safetyCoefficientAgainstInsulatorBreakageForAbnormalLoads =
      this.electricCharge /
      (this.maximumHorizontalTension * this.conductorsPerPhaseNumber);

    this.safetyCoefficientAgainstInsulatorBreakageForNormal =
      this.electricCharge /
      (this.verticalStressTransmitted +
        this.chainWeightWithInsulatorsAndHardware);

    const FIRST_COMPARATOR_CONSTANT = 3;

    if (
      this.safetyCoefficientAgainstInsulatorBreakageForAbnormalLoads >
        FIRST_COMPARATOR_CONSTANT &&
      this.safetyCoefficientAgainstInsulatorBreakageForNormal >
        FIRST_COMPARATOR_CONSTANT
    ) {
      this.chainLength = this.insulatorsNeededResult * this.step;

      this.windStressOnChain =
        THIRD_TEMP_CONSTANT *
        Math.pow(this.windSpeed / FORTH_TEMP_CONSTANT, FIFTH_TEMP_CONSTANT) *
        (this.diameter / SIXTH_TEMP_CONSTANT) *
        this.chainLength;
    } else {
      throw new Error(
        'Aumentar el valor de la Carga Electrica (I) y cambiar el modelo de mayor carga'
      );
    }
  }
}
