import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ProcessService } from 'src/app/core/services/process.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
// import { File, FileWriter } from '@awesome-cordova-plugins/file/ngx';

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
  errorMessage = '';

  constructor(
    private readonly storageService: StorageService,
    private alertController: AlertController,
    private readonly processService: ProcessService,
    private toastController: ToastController
  ) // private file: File,
  // private fileOpener: FileOpener
  {
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
      const {
        TCF_EvaluationByManeuverOrIndustrialFrequency,
        TCF_RayTypeImpulse,
        TF_Dry,
        TF_Rain,
        TF_Ray,
        altitude,
        chainHardwareWeight,
        chainLength,
        chainWeight,
        chainWeightWithInsulatorsAndHardware,
        conductorsPerPhaseNumber,
        conmutationBasicLevel,
        contaminationLevel,
        creepageDistance,
        criticalDistance,
        diameter,
        electricCharge,
        insulatorCodeLabel,
        insulatorTypeValue,
        insulatorWeight,
        insulatorsNeededResult,
        intersectionValue,
        isolationBasicLevel,
        maximumHorizontalTension,
        maximumTension,
        precipitationIntensity,
        relativeHumidity,
        safetyCoefficientAgainstInsulatorBreakageForAbnormalLoads,
        safetyCoefficientAgainstInsulatorBreakageForNormal,
        step,
        temperature,
        verticalStressTransmitted,
        windSpeed,
        windStressOnChain,
      } = this.processService.mainFunction();

      
    } catch (error) {
      const toast = await this.toastController.create({
        message: error.message,
        duration: 3000,
        position: 'bottom',
        buttons: [
          {
            text: 'Cerrar',
            role: 'cancel',
          },
        ],
      });

      await toast.present();
    }
  }

  async geneeReport() {
    try {
      // const checking = await this.file.checkFile(this.file.dataDirectory, "my-text.txt")

      // if(!checking){
      // await this.file.createFile(this.file.dataDirectory, "my-text.txt", true)

      // }

      // await this.file.writeExistingFile(
      //   this.file.dataDirectory,
      //   'my-text.txt',
      //   "Addiontaonl"
      // )

      // const response = await this.file.readAsText(
      //   this.file.dataDirectory,
      //   'my-text.txt'
      // );

      // this.errorMessage = response

      // const found = await this.file.checkFile(this.file.dataDirectory, "my-text.txt")

      //* file:///data/user/0/io.ionic.starter/files/

      await Filesystem.writeFile({
        // path: 'file:///data/user/0/io.ionic.starter/files/new-text.txt',
        directory: Directory.Documents,
        path: 'mega-text.txt',
        data: 'Hola mundito',
        encoding: Encoding.UTF8,
      });

      const contents = await Filesystem.readFile({
        path: 'mega-text.txt',
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      const toast2 = await this.toastController.create({
        message: `SE: file:///data/user/0/io.ionic.starter/files/mega-text.txt - ${contents.data}`,
        // message: `SE: ${this.file.dataDirectory} - ${found}`,
        duration: 3000,
        position: 'bottom',
        buttons: [
          {
            text: 'Cerrar',
            role: 'cancel',
          },
        ],
      });

      await toast2.present();

      // await this.fileOpener.open(`file:///data/user/0/io.ionic.starter/files/my-text.txt`, 'text/plain')
      // await this.fileOpener.open(`${this.file.dataDirectory}my-text.txt`, 'text/plain')
    } catch (error) {
      this.errorMessage = error.message;

      const toast2 = await this.toastController.create({
        message: `Error: ${error.message}`,
        duration: 3000,
        position: 'bottom',
        buttons: [
          {
            text: 'Cerrar',
            role: 'cancel',
          },
        ],
      });

      await toast2.present();
    }
  }

  async obs() {
    try {
      this.processService.mainFunction();
    } catch (error) {
      const toast = await this.toastController.create({
        message: error.message,
        duration: 3000,
        position: 'bottom',
        buttons: [
          {
            text: 'Cerrar',
            role: 'cancel',
          },
        ],
      });

      await toast.present();
    }
  }
}
