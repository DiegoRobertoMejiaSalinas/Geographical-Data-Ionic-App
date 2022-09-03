import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-geographical-data',
  templateUrl: './geographical-data.component.html',
  styleUrls: ['./geographical-data.component.scss'],
})
export class GeographicalDataComponent implements OnInit {
  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly storageService: StorageService
  ) {
    this.form = this.fb.group({
      department: ['', [Validators.required]],
      province: ['', [Validators.required]],
      district: ['', [Validators.required]],
      altitude: [null, [Validators.required]],
      temperature: [null, [Validators.required]],
    });
  }

  saveForm() {
    this.storageService.setGeographicalData(this.form.getRawValue());

    this.storageService.geographicalData.subscribe((data) => {
      console.log({ data });
      console.log(this.storageService.geographicalData);
    });
  }

  ngOnInit() {}
}
