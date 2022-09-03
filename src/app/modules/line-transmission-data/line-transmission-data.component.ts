import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StorageService } from 'src/app/core/services/storage.service';
import { CONTAMINATION_LEVEL_BASE } from 'src/app/shared/contaminationLevel.cst';
import { FC_RAIN_BASE } from 'src/app/shared/fcRain.cst';
import {  LINE_TRANSMISION_DATA_BASE } from 'src/app/shared/lineTransmissionData.cst';

@Component({
  selector: 'app-line-transmission-data',
  templateUrl: './line-transmission-data.component.html',
  styleUrls: ['./line-transmission-data.component.scss'],
})
export class LineTransmissionDataComponent implements OnInit {
  form: FormGroup;

  maximumTensionList = LINE_TRANSMISION_DATA_BASE;
  conmutationBasicLevelList = [];
  isolationBasicLevelList = [];
  contaminationLevelList = CONTAMINATION_LEVEL_BASE;
  precipitationIntensityList = FC_RAIN_BASE

  constructor(
    private readonly fb: FormBuilder,
    private readonly storageService: StorageService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      maximumTensionId: [null, [Validators.required]],
      conmutationBasicLevelId: [null, [Validators.required]],
      isolationBasicLevelId: [null, [Validators.required]],
      contaminationLevelId: [null, [Validators.required]],
      precipitationIntensityId: [null, [Validators.required]],
    });

    /*
     * Si llenan la TENSION MAXIMA
     */
    this.form
      .get('maximumTensionId')
      .valueChanges.pipe(filter((value) => value))
      .subscribe((value) => {
        this.form.patchValue({
          conmutationBasicLevelId: null,
          isolationBasicLevelId: null,
        });

        this.conmutationBasicLevelList = this.maximumTensionList.find(
          (t) => t.id == value
        ).conmutationBasicLevelList;

        console.log(this.maximumTensionList);

        console.log(this.conmutationBasicLevelList);

        if (this.conmutationBasicLevelList.length == 1) {
          this.form.patchValue({
            conmutationBasicLevelId: this.conmutationBasicLevelList[0].id,
          });
        }
      });

    /*
     * Si llenan el NIVEL BASICO DE CONMUTACION
     */
    this.form
      .get('conmutationBasicLevelId')
      .valueChanges.pipe(filter((value) => value))
      .subscribe((valueCon) => {
        this.form.patchValue({
          isolationBasicLevelId: null,
        });

        console.log({ valueCon });
        console.log(
          this.conmutationBasicLevelList.find((t) => t.id == valueCon)
        );

        this.isolationBasicLevelList = this.conmutationBasicLevelList.find(
          (t) => t.id == valueCon
        ).isolationBasicLevelsList;

        if (this.isolationBasicLevelList.length == 1) {
          this.form.patchValue({
            isolationBasicLevelId: this.isolationBasicLevelList[0].id,
          });
        }
      });

    this.storageService.lineTransmissionData.subscribe((data) => {
      if (data) {
        this.form.patchValue(data);
      }
    });
  }

  ngOnInit() {}

  saveForm() {
    this.storageService.setLineTransmissionData(this.form.getRawValue());
    this.storageService.setLineTransmissionDataIsComplete(true);

    this.router.navigate(['/']);
  }
}
