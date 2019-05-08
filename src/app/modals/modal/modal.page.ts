import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  code : string;
  constructor(public modalController: ModalController, private barcodeScanner: BarcodeScanner) { 

    this.code ="---";
  }
  async dismiss(){
    const result: Date = new Date();
      
    await this.modalController.dismiss(result);
    
  }
  ngOnInit() {
  }
  scan(){
    this.barcodeScanner.scan().then(barcodeData => {
    this.code = barcodeData.text;
      
     }).catch(err => {
         console.log('Errorr', err);
     });
  }

}
