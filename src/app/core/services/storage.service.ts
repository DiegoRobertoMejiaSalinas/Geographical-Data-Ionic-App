import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  geographicalData: Observable<any>;
  private geographicalData$: BehaviorSubject<any>;

  insulatorData: Observable<any>;
  private insulatorData$: BehaviorSubject<any>;

  mechanicalCalculation: Observable<any>;
  private mechanicalCalculation$: BehaviorSubject<any>;

  lineTransmissionData: Observable<any>;
  private lineTransmissionData$: BehaviorSubject<any>;

  geographicalDataIsComplete: Observable<boolean>;
  private geographicalDataIsComplete$: BehaviorSubject<boolean>;

  insulatorDataIsComplete: Observable<boolean>;
  private insulatorDataIsComplete$: BehaviorSubject<boolean>;

  lineTransmissionDataIsComplete: Observable<boolean>;
  private lineTransmissionDataIsComplete$: BehaviorSubject<boolean>;

  mechanicalCalculationIsComplete: Observable<boolean>;
  private mechanicalCalculationIsComplete$: BehaviorSubject<boolean>;

  constructor() {
    this.geographicalData$ = new BehaviorSubject(null);
    this.geographicalData = this.geographicalData$.asObservable();

    this.insulatorData$ = new BehaviorSubject(null);
    this.insulatorData = this.insulatorData$.asObservable();

    this.lineTransmissionData$ = new BehaviorSubject(null);
    this.lineTransmissionData = this.lineTransmissionData$.asObservable();

    this.mechanicalCalculation$ = new BehaviorSubject(null);
    this.mechanicalCalculation = this.mechanicalCalculation$.asObservable();

    /*
     * Vamos a agregar e inicializar variables booleanas que seran usadas para saber cuales formularios estan completos y cuales aun no
     */
    this.geographicalDataIsComplete$ = new BehaviorSubject(false);
    this.geographicalDataIsComplete =
      this.geographicalDataIsComplete$.asObservable();

    this.insulatorDataIsComplete$ = new BehaviorSubject(false);
    this.insulatorDataIsComplete = this.insulatorDataIsComplete$.asObservable();

    this.lineTransmissionDataIsComplete$ = new BehaviorSubject(false);
    this.lineTransmissionDataIsComplete =
      this.lineTransmissionDataIsComplete$.asObservable();

    this.mechanicalCalculationIsComplete$ = new BehaviorSubject(false);
    this.mechanicalCalculationIsComplete =
      this.mechanicalCalculationIsComplete$.asObservable();

    /*
     * Vamos a corroborar que si existe en LocalStorage, de ser asi lo asignamos en las respectivas BehaviorSubject
     */
    const geographicalDataFromLocalStorage =
      localStorage.getItem('geographicalData');
    if (geographicalDataFromLocalStorage) {
      this.geographicalData$.next(JSON.parse(geographicalDataFromLocalStorage));
    }

    const geographicalDataIsCompleteFromLocalStorage = localStorage.getItem(
      'geographicalDataIsComplete'
    );
    if (geographicalDataIsCompleteFromLocalStorage) {
      this.geographicalDataIsComplete$.next(
        JSON.parse(geographicalDataIsCompleteFromLocalStorage)
      );
    }
  }

  getGeographicalData() {
    return this.geographicalData$.getValue();
  }

  setGeographicalData(data: any) {
    this.geographicalData$.next(data);

    localStorage.setItem('geographicalData', JSON.stringify(data));
  }

  getInsulatorData() {
    return this.insulatorData$.getValue();
  }

  setInsulatorData(data: any) {
    this.insulatorData$.next(data);
  }

  getMechanicalCalculationData() {
    return this.mechanicalCalculation$.getValue();
  }

  setMechanicalCalculationData(data: any) {
    this.mechanicalCalculation$.next(data);
  }

  getLineTransmissionData() {
    return this.lineTransmissionData$.getValue();
  }

  setLineTransmissionData(data: any) {
    this.lineTransmissionData$.next(data);
  }

  setGeographicalDataIsComplete(data: boolean) {
    this.geographicalDataIsComplete$.next(data);

    localStorage.setItem('geographicalDataIsComplete', JSON.stringify(data));
  }

  getGeographicalDataIsComplete() {
    return this.geographicalDataIsComplete$.getValue();
  }

  setLineTransmissionDataIsComplete(data: boolean) {
    this.lineTransmissionDataIsComplete$.next(data);
  }

  getLineTransmissionDataIsComplete() {
    return this.lineTransmissionDataIsComplete$.getValue();
  }

  setInsulatorDataIsComplete(data: boolean) {
    this.insulatorDataIsComplete$.next(data);
  }

  getInsulatorDataIsComplete() {
    return this.insulatorDataIsComplete$.getValue();
  }

  setMechanicalCalculationIsComplete(data: boolean) {
    this.mechanicalCalculationIsComplete$.next(data);
  }

  getMechanicalCalculationIsComplete() {
    return this.mechanicalCalculationIsComplete$.getValue();
  }

  cleanAllForms() {
    this.geographicalData$.next(null);
    this.insulatorData$.next(null);
    this.mechanicalCalculation$.next(null);
    this.lineTransmissionData$.next(null);
    this.geographicalDataIsComplete$.next(false);
    this.mechanicalCalculationIsComplete$.next(false);
    this.insulatorDataIsComplete$.next(false);
    this.lineTransmissionDataIsComplete$.next(false);
  }
}
