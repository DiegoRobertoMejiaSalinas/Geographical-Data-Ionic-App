import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/core/services/storage.service';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

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

  insulatorList = [
    {
      name: 'Esférico',
      id: 1,
      codes: [
        {
          id: 1,
          name: 'E-40R-120',
          electricCharge: 40,
          creepageDistance: 215,
          step: 120,
          diameter: 175,
          TF_Dry: 40,
          TF_Rain: 32,
          TF_Ray: 70,
          insulatorWeight: 2.3,
        },
        {
          id: 2,
          name: 'E-70R-146',
          electricCharge: 70,
          creepageDistance: 300,
          step: 146,
          diameter: 255,
          TF_Dry: 60,
          TF_Rain: 45,
          TF_Ray: 95,
          insulatorWeight: 4.1,
        },
        {
          id: 3,
          name: 'E-100R-146',
          electricCharge: 100,
          creepageDistance: 300,
          step: 146,
          diameter: 255,
          TF_Dry: 60,
          TF_Rain: 45,
          TF_Ray: 95,
          insulatorWeight: 4.5,
        },
        {
          id: 4,
          name: 'E-120R-146',
          electricCharge: 120,
          creepageDistance: 300,
          step: 146,
          diameter: 255,
          TF_Dry: 60,
          TF_Rain: 45,
          TF_Ray: 95,
          insulatorWeight: 4.5,
        },
      ],
    },
    {
      name: 'Estándar',
      id: 2,
      codes: [],
    },
  ];

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
        const foundMatchinCodeWithData = this.insulatorList
          .find((t) => t.id == this.form.get('insulatorTypeId').value)
          .codes.find((m) => m.id == data);

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
  }

  ngOnInit() {}

  saveForm() {
    this.storageService.setInsulatorData(this.form.getRawValue());

    this.router.navigate(['/']);
  }
}
