import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  geographicalData: Observable<any>;
  private geographicalData$: BehaviorSubject<any>;

  constructor() {
    this.geographicalData$ = new BehaviorSubject(null);
    this.geographicalData = this.geographicalData$.asObservable();
  }

  getGeographicalData() {
    return this.geographicalData$.asObservable();
  }

  setGeographicalData(data: any) {
    this.geographicalData$.next(data);
  }
}
