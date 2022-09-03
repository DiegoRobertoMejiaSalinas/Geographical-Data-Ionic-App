import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router, RouterModule, Routes } from '@angular/router';
import { GeographicalDataComponent } from './geographical-data/geographical-data.component';
import { InsulatorDataComponent } from './insulator-data/insulator-data.component';
import { LineTransmissionDataComponent } from './line-transmission-data/line-transmission-data.component';
import { MainPageComponent } from './main/main.page';
import { MechanicalCalculationComponent } from './mechanical-calculation/mechanical-calculation.component';

const routes: Routes = [
  {
    path: 'process',
    children: [
      {
        path: 'geographical-data',
        component: GeographicalDataComponent,
      },
      {
        path: 'line-transmission-data',
        component: LineTransmissionDataComponent,
      },
      {
        path: 'mechanical-calculation',
        component: MechanicalCalculationComponent,
      },
      {
        path: 'insulator-data',
        component: InsulatorDataComponent,
      },
    ],
  },
  { path: 'main', pathMatch: 'full', component: MainPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModulePageRoutingModule {}
