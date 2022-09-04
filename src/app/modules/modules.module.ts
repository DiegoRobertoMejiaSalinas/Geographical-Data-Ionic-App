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
import { File } from '@ionic-native/file/ngx';
// import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';



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
  ],
  providers: [
    File,
    // FileOpener,
  ]
})
export class ModulesModule {}
