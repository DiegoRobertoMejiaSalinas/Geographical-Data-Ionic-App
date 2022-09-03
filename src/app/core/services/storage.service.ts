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
     * Vamos a corroborar que si existe en LocalStorage, de ser asi lo asignamos en las respectivas BehaviorSubject
     */
    const geographicalDataFromLocalStorage =
      localStorage.getItem('geographicalData');
    if (geographicalDataFromLocalStorage) {
      this.geographicalData$.next(JSON.parse(geographicalDataFromLocalStorage));
    }
  }

  getGeographicalData() {
    return this.geographicalData$.getValue();
  }

  setGeographicalData(data: any) {
    this.geographicalData$.next(data);

    localStorage.setItem('geographicalData', JSON.stringify(data));
  }

  setInsulatorData(data: any) {
    this.insulatorData$.next(data);
  }

  setMechanicalCalculationData(data: any) {
    this.mechanicalCalculation$.next(data);
  }

  setLineTransmissionData(data: any) {
    this.lineTransmissionData$.next(data);
  }
}
