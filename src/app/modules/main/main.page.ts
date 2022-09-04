import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ProcessService } from 'src/app/core/services/process.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPageComponent implements OnInit {
  isFirstComplete = false;
  isSecondComplete = false;
  isThirdComplete = false;
  isForthComplete = false;

  constructor(
    private readonly storageService: StorageService,
    private alertController: AlertController,
    private readonly processService: ProcessService,
    private toastController: ToastController
  ) {
    this.storageService.geographicalDataIsComplete.subscribe((data) => {
      this.isFirstComplete = data;
    });

    this.storageService.lineTransmissionDataIsComplete.subscribe((data) => {
      this.isSecondComplete = data;
    });

    this.storageService.insulatorDataIsComplete.subscribe((data) => {
      this.isThirdComplete = data;
    });

    this.storageService.mechanicalCalculationIsComplete.subscribe((data) => {
      this.isForthComplete = data;
    });
  }

  ngOnInit() {}

  async cleanForms() {
    const alert = await this.alertController.create({
      header: 'Se eliminará todos los formularios que esten guardados.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: () => {},
        },
        {
          text: 'Eliminar',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.storageService.cleanAllForms();
          },
        },
      ],
    });

    await alert.present();
  }

  async generateReport() {
    try {
      this.processService.mainFunction()
    } catch (error) {
  
      const toast = await this.toastController.create({
        message: error.message,
        duration: 3000,
        position: 'bottom',
        buttons: [
          {
            text: 'Cerrar',
            role: 'cancel'
          }
        ],
      });

      await toast.present();
    }
  }
}
