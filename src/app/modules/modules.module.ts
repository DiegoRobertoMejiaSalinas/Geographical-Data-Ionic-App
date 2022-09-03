import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgModel, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MainPageComponent } from './main/main.page';
import { ModulePageRoutingModule } from './modules-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ModulePageRoutingModule,
  ],
  declarations: [MainPageComponent],
})
export class ModulesModule {}
