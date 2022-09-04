import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ProcessService } from 'src/app/core/services/process.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import JSPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { File, Entry } from '@ionic-native/file/ngx';

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
    private toastController: ToastController,
    private fileOpener: FileOpener,
    private file: File
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

  async testPdf() {
    try {
      const toast = await this.toastController.create({
        message: this.file.dataDirectory,
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
      this.file.writeExistingFile(
        this.file.dataDirectory,
        'access.log',
        'Hola mundo'
      );
    } catch (e) {
      console.log(e);
    }

    return;
    const pdfBlock = document.getElementById('print-wrapper');

    const options = {
      background: 'white',
      height: pdfBlock.clientWidth,
      width: pdfBlock.clientHeight,
    };

    const fileUrl = await domtoimage.toPng(pdfBlock, options);

    console.log({ fileUrl });
    var doc = new JSPDF('p', 'mm', 'a4');
    doc.addImage(fileUrl, 'PNG', 10, 10, 240, 180);

    let docRes = doc.output();
    let buffer = new ArrayBuffer(docRes.length);
    let array = new Uint8Array(buffer);
    for (var i = 0; i < docRes.length; i++) {
      array[i] = docRes.charCodeAt(i);
    }

    console.log({ array });

    const directory = this.file.dataDirectory;
    const fileName = 'user-data.pdf';

    let optionsTwo = {
      replace: true,
    };

    console.log(this.file);

    console.log(directory);

    const booleanResult = await this.file.checkFile(directory, fileName);

    console.log({ booleanResult });

    const result = await this.file.writeFile(
      directory,
      fileName,
      buffer,
      optionsTwo
    );

    console.log('File generated' + JSON.stringify(result));
    this.fileOpener
      .open(this.file.dataDirectory + fileName, 'application/pdf')
      .then(() => console.log('File is exported'))
      .catch((e) => console.log(e));
  }

  async generateReport() {
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
