import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { CONTAMINATION_LEVEL_BASE } from 'src/app/shared/contaminationLevel.cst';
import { FC_HUMIDITY } from 'src/app/shared/fcHumidity.cs';
import { INSULATOR_DATA_BASE } from 'src/app/shared/insulatorData.cst';
import { LINE_TRANSMISION_DATA_BASE } from 'src/app/shared/lineTransmissionData.cst';
import { StorageService } from './storage.service';
import {FC_RAIN_BASE} from "src/app/shared/fcRain.cst"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

   @ViewChild('invoice') invoiceElement!: ElementRef;

   constructor(private readonly storageService:StorageService){
        /*
        * Ahora seteamos los valores que declaramos antes en base a los del Storage
        */
        this.storageService.geographicalData.subscribe(data => {
            this.altitude = data?.altitude
            this.temperature = data?.temperature
            this.relativeHumidity = data?.relativeHumidity
            //* Aqui definimos el valor de una variable que depende de otras dos
            this.intersectionValue = data && data.relativeHumidity && data.temperature ? FC_HUMIDITY.find(valueObject => valueObject.relativeHumidityValue == data?.relativeHumidity && valueObject.temperatureValue == data?.temperature).resultValue : null
        })

         this.storageService.lineTransmissionData.subscribe(data => {
            this.maximumTension = data?.maximumTensionId ? LINE_TRANSMISION_DATA_BASE.find(t => t.id == data?.maximumTensionId).value : null
            
            const foundConmutationBasicLevel = data?.maximumTensionId ? LINE_TRANSMISION_DATA_BASE.find(t => t.id == data?.maximumTensionId) 
            .conmutationBasicLevelList.find(m => m.id == data?.conmutationBasicLevelId) : null

            this.conmutationBasicLevel = foundConmutationBasicLevel?.value

            const foundIsolationBasicLevel = foundConmutationBasicLevel?.isolationBasicLevelsList.find(o=> o.id == data?.isolationBasicLevelId)
            this.isolationBasicLevel = foundIsolationBasicLevel?.value

            //* Aqui definimos el valor de una variable que depende del resultado de una anterior
            this.criticalDistance= foundIsolationBasicLevel?.criticalDistanceValue

            this.contaminationLevel =  data?.contaminationLevelId ? CONTAMINATION_LEVEL_BASE.find(t => t.id == data?.contaminationLevelId).value : null
            this.precipitationIntensity = data?.precipitationIntensityId ? FC_RAIN_BASE.find(t => t.id == data?.precipitationIntensityId).value : null
         })

         this.storageService.mechanicalCalculation.subscribe(data => {
            this.windSpeed = data?.windSpeed
            this.chainHardwareWeight = data?.chainHardwareWeight
            this.conductorsPerPhaseNumber = data?.conductorsPerPhaseNumber
            this.verticalStressTransmitted = data?.verticalStressTransmitted
            this.maximumHorizontalTension = data?.maximumHorizontalTension
         })

         this.storageService.insulatorData.subscribe(data => {
            this.insulatorTypeValue = data?.insulatorTypeId ? INSULATOR_DATA_BASE.find(t => t.id == data?.insulatorTypeId).value : null

            const foundInstanceInsulatorCode = data?.insulatorTypeId && data?.insulatorCodeId ? INSULATOR_DATA_BASE.find(t => t.id == data?.insulatorTypeId).codes.find(m => m.id == data?.insulatorCodeId) : null
            this.insulatorCodeLabel = foundInstanceInsulatorCode?.name
            this.electricCharge = foundInstanceInsulatorCode?.electricCharge
            this.creepageDistance = foundInstanceInsulatorCode?.creepageDistance
            this.step = foundInstanceInsulatorCode?.step
            this.diameter = foundInstanceInsulatorCode?.diameter
            this.TF_Dry = foundInstanceInsulatorCode?.TF_Dry
            this.TF_Rain = foundInstanceInsulatorCode?.TF_Rain
            this.TF_Ray = foundInstanceInsulatorCode?.TF_Ray
            this.insulatorWeight = foundInstanceInsulatorCode?.insulatorWeight

            console.log(this)
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
      V * this.TF_Ray > this.TCF_RayTypeImpulse &&
      V * this.TF_Dry > this.TCF_EvaluationByManeuverOrIndustrialFrequency &&
      V * this.TF_Rain > this.TCF_EvaluationByManeuverOrIndustrialFrequency
    ) {
      return V;
    } else {
      console.log(this)
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

        return {
          altitude: this.altitude,
          temperature: this.temperature,
          relativeHumidity: this.relativeHumidity,
          intersectionValue: this.intersectionValue,

          maximumTension: this.maximumTension,
          isolationBasicLevel: this.isolationBasicLevel,
          criticalDistance: this.criticalDistance,
          conmutationBasicLevel: this.conmutationBasicLevel,
          contaminationLevel: this.contaminationLevel,
          precipitationIntensity: this.precipitationIntensity,

          conductorsPerPhaseNumber: this.conductorsPerPhaseNumber,
          maximumHorizontalTension: this.maximumHorizontalTension,
          chainHardwareWeight: this.chainHardwareWeight,
          windSpeed: this.windSpeed,
          verticalStressTransmitted: this.verticalStressTransmitted,

          insulatorTypeValue: this.insulatorTypeValue,
          insulatorCodeLabel: this.insulatorCodeLabel,
          electricCharge: this.electricCharge,
          creepageDistance: this.creepageDistance,
          step: this.step,
          diameter: this.diameter,
          TF_Dry: this.TF_Dry,
          TF_Rain: this.TF_Rain,
          TF_Ray: this.TF_Ray,
          insulatorWeight: this.insulatorWeight,

          safetyCoefficientAgainstInsulatorBreakageForNormal: this.safetyCoefficientAgainstInsulatorBreakageForNormal,
          safetyCoefficientAgainstInsulatorBreakageForAbnormalLoads: this.safetyCoefficientAgainstInsulatorBreakageForAbnormalLoads,
          chainLength: this.chainLength,
          chainWeightWithInsulatorsAndHardware: this.chainWeightWithInsulatorsAndHardware,
          chainWeight: this.chainWeight,
          windStressOnChain: this.windStressOnChain,
          TCF_EvaluationByManeuverOrIndustrialFrequency: this.TCF_EvaluationByManeuverOrIndustrialFrequency,
          TCF_RayTypeImpulse: this.TCF_RayTypeImpulse,
          insulatorsNeededResult: this.insulatorsNeededResult
        }


        // console.log(this)


        // const doc = new jsPDF('p', 'mm', 'a3');

        // doc.text(`A - Altitud: ${this.altitude}`, 10, 10);
        // doc.text(`B - Temperatura: ${this.temperature}`, 10, 20);
        // doc.text(`Q - Humedad Relativa (%): ${this.relativeHumidity}`, 10, 30);
        // doc.text(`Z - Valor en la tabla Temperatura/Humedad: ${this.intersectionValue}`, 10, 40);

        // doc.text(`C - Tensión Máxima: ${this.maximumTension}`, 10, 60);
        // doc.text(`D - Nivel de Aislamiento Basico: ${this.isolationBasicLevel}`, 10, 70);
        // doc.text(`D_1 - Distancia Critica: ${this.criticalDistance}`, 10, 80);
        // doc.text(`E - Nivel de Conmutacion Basica: ${this.conmutationBasicLevel}`, 10, 90);
        // doc.text(`F - Nivel de Contaminacion: ${this.contaminationLevel}`, 10, 100);
        // doc.text(`R - Intensidad de Precipitacion - Factor de correccion por lluvia: ${this.precipitationIntensity}`, 10, 110);

        // doc.text(`N_1 - Numero de Conductor por Fase: ${this.conductorsPerPhaseNumber}`, 10, 130);
        // doc.text(`T_1 - Tensión Máxima Horizontal: ${this.maximumHorizontalTension}`, 10, 140);
        // doc.text(`P_H - Peso del herraje de la cadena: ${this.chainHardwareWeight}`, 10, 150);
        // doc.text(`V_1 - Velocidad del viento: ${this.windSpeed}`, 10, 160);
        // doc.text(`P_1 - Esfuerzo vertical transmitido por los conductores al aislador: ${this.verticalStressTransmitted}`, 10, 170);

        // doc.text(`G - Valor del Tipo de Aislador: ${this.insulatorTypeValue}`, 10, 190);
        // doc.text(`H - Código del Aislador: ${this.insulatorCodeLabel}`, 10, 200);
        // doc.text(`I - Carga Electrica: ${this.electricCharge}`, 10, 210);
        // doc.text(`J - Distancia de Fuga: ${this.creepageDistance}`, 10, 220);
        // doc.text(`K - Paso: ${this.step}`, 10, 230);
        // doc.text(`L - Diametro: ${this.diameter}`, 10, 240);
        // doc.text(`M - TF Seco: ${this.TF_Dry}`, 10, 250);
        // doc.text(`N - TF Lluvia: ${this.TF_Rain}`, 10, 260);
        // doc.text(`O - TF Rayo: ${this.TF_Ray}`, 10, 270);
        // doc.text(`P - Peso del aislador: ${this.insulatorWeight}`, 10, 280);

        // doc.text(`C_2 - Coeficiente de seguridad a la rotura de los aisladores con cargas normales: ${this.safetyCoefficientAgainstInsulatorBreakageForNormal}`, 10, 300);
        // doc.text(`C_1 - Coeficiente de seguridad a la rotura de los aisladores con cargas anormales: ${this.safetyCoefficientAgainstInsulatorBreakageForAbnormalLoads}`, 10, 310);
        // doc.text(`L_1 - Longitud de la cadena: ${this.chainLength}`, 10, 320);
        // doc.text(`P_2 - Peso de la cadena de aisladores y herrajes: ${this.chainWeightWithInsulatorsAndHardware}`, 10, 330);
        // doc.text(`P_3 - Peso de la cadena: ${this.chainWeight}`, 10, 340);
        // doc.text(`E_1 - Esfuerzo del viento sobre la cadena: ${this.windStressOnChain}`, 10, 350);
        // doc.text(`W - TCF Evaluacion por Maniobra o Frecuencia Industrial: ${this.TCF_EvaluationByManeuverOrIndustrialFrequency}`, 10, 360);
        // doc.text(`X - TCF Tipo de Impulso por Rayo: ${this.TCF_RayTypeImpulse}`, 10, 370);
        // doc.text(`A_1 - Aisladores Necesarios: ${this.insulatorsNeededResult}`, 10, 380);

        // doc.save('results.pdf');

    } else {
      throw new Error(
        'Aumentar el valor de la Carga Electrica (I) y cambiar el modelo de mayor carga'
      );
    }
  }
}
