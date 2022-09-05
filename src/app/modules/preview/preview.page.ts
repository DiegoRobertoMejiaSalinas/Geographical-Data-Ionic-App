import { Component, OnInit } from '@angular/core';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { ModalController, ToastController } from '@ionic/angular';
import { ProcessService } from 'src/app/core/services/process.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss'],
})
export class PreviewPageComponent implements OnInit {
  content: string;

  data: any = null;

  constructor(
    private pdfGenerator: PDFGenerator,
    private modalController: ModalController,
    private processService: ProcessService,
    private toastController: ToastController
  ) {
    this.data = this.processService.getAllBaseData();
  }

  ngOnInit(): void {}

  closeModal() {
    this.modalController.dismiss();
  }

  async downloadInvoice() {
    this.content = document.getElementById('PrintInvoice').innerHTML;
    let options = {
      documentSize: 'A4',
      type: 'share',
      //   landscape: 'portrait',
      fileName: 'Untels-Insulators-Reporte.pdf',
    };

    try {
      const base64 = this.pdfGenerator.fromData(this.content, options);
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
