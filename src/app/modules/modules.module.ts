import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgModel, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GeographicalDataComponent } from './geographical-data/geographical-data.component';
import { InsulatorDataComponent } from './insulator-data/insulator-data.component';
import { LineTransmissionDataComponent } from './line-transmission-data/line-transmission-data.component';
import { MainPageComponent } from './main/main.page';
import { MechanicalCalculationComponent } from './mechanical-calculation/mechanical-calculation.component';
import { ModulePageRoutingModule } from './modules-routing.module';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { PreviewPageComponent } from './preview/preview.page';
// import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
// import { File, FileWriter } from '@awesome-cordova-plugins/file/ngx';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ModulePageRoutingModule,
  ],
  declarations: [
    MainPageComponent,
    GeographicalDataComponent,
    MechanicalCalculationComponent,
    InsulatorDataComponent,
    LineTransmissionDataComponent,
    PreviewPageComponent
  ],
  providers: [
    PDFGenerator,
    // FileOpener,
    // File
  ]
})
export class ModulesModule {}
