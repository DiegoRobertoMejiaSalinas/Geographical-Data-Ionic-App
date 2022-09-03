import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router, RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main/main.page';

const routes: Routes = [
  {
    path: 'process',
    children: [
      // {
      //     path: ''
      // }
    ],
  },
  { path: 'main', pathMatch: 'full', component: MainPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModulePageRoutingModule {}
