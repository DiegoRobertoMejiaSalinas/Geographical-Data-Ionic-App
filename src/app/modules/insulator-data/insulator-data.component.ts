import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/core/services/storage.service';
import { filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { INSULATOR_DATA_BASE } from 'src/app/shared/insulatorData.cst';

@Component({
  selector: 'app-insulator-data',
  templateUrl: './insulator-data.component.html',
  styleUrls: ['./insulator-data.component.scss'],
})
export class InsulatorDataComponent implements OnInit {
  form: FormGroup;

  electricCharge = null;
  creepageDistance = null;
  step = null;
  diameter = null;
  TF_Dry = null;
  TF_Rain = null;
  TF_Ray = null;
  insulatorWeight = null;

  insulatorCodeList = [];

  insulatorList = INSULATOR_DATA_BASE;

  constructor(
    private fb: FormBuilder,
    private readonly storageService: StorageService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      insulatorTypeId: [null, [Validators.required]],
      insulatorCodeId: [null, [Validators.required]],

      electricCharge: [null, [Validators.required]],
      creepageDistance: [null, [Validators.required]],
      step: [null, [Validators.required]],
      diameter: [null, [Validators.required]],
      TF_Dry: [null, [Validators.required]],
      TF_Rain: [null, [Validators.required]],
      TF_Ray: [null, [Validators.required]],
      insulatorWeight: [null, [Validators.required]],
    });

    this.form.get('insulatorTypeId').valueChanges.subscribe((data) => {
      this.insulatorCodeList = this.insulatorList.find(
        (t) => t.id == data
      ).codes;

      this.form.patchValue({
        insulatorCodeId: null,
        electricCharge: null,
        creepageDistance: null,
        step: null,
        diameter: null,
        TF_Dry: null,
        TF_Rain: null,
        TF_Ray: null,
        insulatorWeight: null,
      });
    });

    this.form
      .get('insulatorCodeId')
      .valueChanges.pipe(filter((x) => x))
      .subscribe((data) => {
        /*
         * Ahora encontramos donde se encuentra los valores faltantes
         */
        const foundMatchinCodeWithData = this.insulatorCodeList.find(
          (m) => m.id == data
        );

        this.form.patchValue({
          electricCharge: foundMatchinCodeWithData.electricCharge,
          creepageDistance: foundMatchinCodeWithData.creepageDistance,
          step: foundMatchinCodeWithData.step,
          diameter: foundMatchinCodeWithData.diameter,
          TF_Dry: foundMatchinCodeWithData.TF_Dry,
          TF_Rain: foundMatchinCodeWithData.TF_Rain,
          TF_Ray: foundMatchinCodeWithData.TF_Ray,
          insulatorWeight: foundMatchinCodeWithData.insulatorWeight,
        });
      });

    this.storageService.insulatorData
      .pipe(
        map((data) => {
          if (data) {
            this.form.patchValue(data);
          }
        })
      )
      .subscribe();
  }

  ngOnInit() {}

  saveForm() {
    this.storageService.setInsulatorData(this.form.getRawValue());
    this.storageService.setInsulatorDataIsComplete(true);

    this.router.navigate(['/']);
  }
}
