import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-mechanical-calculation',
  templateUrl: './mechanical-calculation.component.html',
  styleUrls: ['./mechanical-calculation.component.scss'],
})
export class MechanicalCalculationComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly storageService: StorageService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      windSpeed: [null, [Validators.required]],
      chainHardwareWeight: [null, [Validators.required]],
      conductorsPerPhaseNumber: [null, [Validators.required]],
      verticalStressTransmitted: [null, [Validators.required]],
      maximumHorizontalTension: [null, [Validators.required]],
    });

    this.storageService.mechanicalCalculation
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
    this.storageService.setMechanicalCalculationData(this.form.getRawValue());
    this.storageService.setMechanicalCalculationIsComplete(true);

    this.router.navigate(['/']);
  }
}
