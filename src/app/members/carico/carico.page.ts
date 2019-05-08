import { Component, OnInit } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { BarcodeService } from 'src/app/barcode.service';
import { Events } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-carico',
  templateUrl: './carico.page.html',
  styleUrls: ['./carico.page.scss'],
  providers: [BarcodeService]
})
export class CaricoPage implements OnInit {
  public text:string;
  public tanksdata:any;
  public productscodesdata:any;
  public stato:number;
  public tank:string;
  public product:string;
  public displayDeposito:string;
  public displayProdotto:string;
  public press:number;
  public tankId:number;
  public productId:number;
  public displaySpinner:string;
  constructor(private http:HttpClient, private router:Router, private dataService: DataService,private events:Events, private tts: TextToSpeech, private barcodeProvider: BarcodeService) {
    this.stato = 0;
    
    this.text = 'Scansiona codice deposito da caricare';
    this.tanksdata = dataService.tanksdata;
    this.productscodesdata = dataService.productscodesdata;
    this.displayDeposito = "none";
    this.displayProdotto = "none";
    this.displaySpinner = "none";
    this.press=0;
    

   }
   ionViewWillEnter(){
    this.events.subscribe('data:scan', (scanData, time) => {
      //  Update the list of scanned barcodes
      let scannedData = scanData.extras["com.symbol.datawedge.data_string"];
      let scannedType = scanData.extras["com.symbol.datawedge.label_type"];
      //this.scans.unshift({ "data": scannedData, "type": scannedType, "timeAtDecode": time });
      console.log("ZEBRA RECIVED CODE CARICO PAGE HANDLER" + scannedData);
      this.codeRead(scannedData);
    });
     }
     ionViewWillLeave(){
       this.events.unsubscribe('data:scan');
     }
  ngOnInit() {
    console.log("URL    "+this.router.url);
    this.tts.speak({
      text: this.text,
      locale: 'it-IT',
      rate: 1.25
  })
  .then(() => console.log('Success'))
  .catch((reason: any) => console.log(reason));
  }

  public fabDown() {
    /*
    console.log("ZEBRA FABDOWN");
    switch(this.press){
      case 0:{

        this.codeRead("P-8");
        this.press = 1;
        break;
      }
      case 1:{
        this.codeRead("CA50037");
        this.press = 2;
        break;
      }
    }*/

    //this.logincode('ItalProgetti');
 this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "START_SCANNING");
  }

  //  Function to handle the floating action button onUp.  Cancel any soft scan in progress.
  public fabUp() {
    console.log("ZEBRA FABDOWN");

  this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "STOP_SCANNING");
  }

  codeRead(data){
    switch(this.stato){
      case 0:{
        this.findTank(data);
        break;
      }
      case 1:{
        this.findProduct(data);
        break;
      }
    }
    console.log("CODE READ:"+data);
  }

  findTank(data){
    console.log("FIND TANK");
    for (let t in this.tanksdata){
      if (this.tanksdata[t].SIGLA==data){
        this.stato=1;
        this.tank=data;
        this.tankId = this.tanksdata[t].ID;
        this.displayDeposito = "block";
       this.speak("Deposito "+this.tank+" selezionato. Scansiona codice prodotto.");
      return;
      }
    }

    this.speak("Codice deposito sconosciuto"); }

    findProduct(data){
      
      for (let p in this.productscodesdata){
        if(this.productscodesdata[p].CODICE==data){
          this.stato=2;
          this.product = this.productscodesdata[p].PRODOTTO;
          this.productId = this.productscodesdata[p].ID_PRODOTTO;
          this.displayProdotto = "block";
          this.displaySpinner = "block";
          this.tts.speak({
            text: "Prodotto  "+this.product+ "selezionato.",
            locale: 'it-IT',
            rate: 1.25
        })
        .then(() => 
       this.verify()
        )
        .catch((reason: any) => console.log(reason));

          
          return;
        }
      }
      this.speak("Codice prodotto sconosciuto");
    }


    verify(){
    
      this.http.get('http://c7183545.ngrok.io/verifyproductintank/'+this.productId+'/'+this.tankId)
      .subscribe(data => {
        if (data ==1){
          
          this.tts.speak({
            text: "Corrispondenza Trovata",
            locale: 'it-IT',
            rate: 1.25
        })
        .then(() => 
        this.router.navigate(['/members/tank', this.tankId])
        )
        .catch((reason: any) => console.log(reason));
        }
        else{
          this.tts.speak({
            text: "Corrispondenza Non Trovata",
            locale: 'it-IT',
            rate: 1.25
        })
        .then(() => 
            this.azzera()
        )
        .catch((reason: any) => console.log(reason));
         
        }
      })
      
    }
    azzera(){
      this.displayDeposito = "none";
      this.displayProdotto = "none";
      
      this.stato=0;
      this.speak("Scansiona codice deposito da caricare");
    }
  speak(text){
    this.tts.speak({
      text: text,
      locale: 'it-IT',
      rate: 1.25
  })
  .then(() => console.log('Success'))
  .catch((reason: any) => console.log(reason));
  }
}
