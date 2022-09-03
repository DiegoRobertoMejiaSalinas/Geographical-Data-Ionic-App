import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { debounce, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { StorageService } from 'src/app/core/services/storage.service';
import { HUMIDITY_RELATIVE_BASE } from 'src/app/shared/humidityRelative.cst';

@Component({
  selector: 'app-geographical-data',
  templateUrl: './geographical-data.component.html',
  styleUrls: ['./geographical-data.component.scss'],
})
export class GeographicalDataComponent implements OnInit {
  form: FormGroup;
  humidityRelativeList = HUMIDITY_RELATIVE_BASE

  constructor(
    private readonly fb: FormBuilder,
    private readonly storageService: StorageService,
    private readonly router: Router,
    private toastController: ToastController
  ) {
    this.form = this.fb.group({
      department: ['', [Validators.required]],
      province: ['', [Validators.required]],
      district: ['', [Validators.required]],
      altitude: [null, [Validators.required]],
      temperature: [null, [Validators.required]],
      relativeHumidity: [null, [Validators.required]],
    });

    this.form
      .get('temperature')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(async (value) => {
        /*
         * El tope de la temperatura es 35°C
         */
        if (Number(value) > 35) {
          await this.overTemperatureLimit()

          this.form.get('temperature').patchValue(35)
        }
      });

    /*
     * Vamos a corroborar en el StorageService que si existe ya un valor existente lo vamos a asignar en el form
     */
    this.storageService.geographicalData
      .pipe(
        map((data) => {
          console.log({ data });
          if (data) {
            this.form.patchValue(data);
          }
        })
      )
      .subscribe();
    // if(this.storageService.getGeographicalData()){
    //   this.form.patchValue(this.storageService.getGeographicalData())
    // }
  }

  saveForm() {
    this.storageService.setGeographicalData(this.form.getRawValue());
    this.storageService.setGeographicalDataIsComplete(true);

    this.router.navigate(['/']);
  }

  ngOnInit() {}

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  async overTemperatureLimit() {
    const toast = await this.toastController.create({
      message: 'La temperatura máxima que puede ingresar es 35°C',
      duration: 2500,
      position: 'bottom',
    });

    await toast.present();
  }
}
