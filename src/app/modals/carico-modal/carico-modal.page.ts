import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-carico-modal',
  templateUrl: './carico-modal.page.html',
  styleUrls: ['./carico-modal.page.scss'],
})
export class CaricoModalPage implements OnInit {

  constructor(public modalController: ModalController, private barcodeScanner: BarcodeScanner) { }

  ngOnInit() {
  }
  async dismiss(){
    const result: Date = new Date();
      
    await this.modalController.dismiss(result);
    
  }
}
