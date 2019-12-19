import { Component, OnInit } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { BarcodeService } from 'src/app/barcode.service';
import { Events } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { PushService } from 'src/app/services/push.service';

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
  public message:string;
  public productId:number;
  public device_type:number;
  public displaySpinner:string;
  public feed_vocal:boolean;
  public host:any;
  constructor(private pushservice:PushService, private storage:Storage, private http:HttpClient, private router:Router, private dataService: DataService,private events:Events, private tts: TextToSpeech, private barcodeProvider: BarcodeService) {
    this.stato = 0;
    this.message="SCANSIONA CODICE DEPOSITO DA CARICARE";
    this.text = 'Scansiona codice depòsito da caricare';
    this.tanksdata = pushservice.tanksdata;
    this.productscodesdata = pushservice.productscodesdata;
    this.storage.get('api_host').then(res => {
      if (res) {
         console.log("ENDPOINT SETTED TO "+res)
      this.host=res;
      }
    })
    console.log("TANKS DATA"+this.tanksdata)
    this.displayDeposito = "none";
    this.displayProdotto = "none";
    this.displaySpinner = "none";
    this.press=0;
    storage.get("DEVICE_TYPE").then((val)=>{
      this.device_type=val
    })
    this.storage.get("feed_vocal").then(res => {
      if (res) {
         this.feed_vocal=res;      }
      else{
        this.feed_vocal=false;
      }
    });

   }
   ionViewWillEnter(){

      this.events.subscribe('data:scan', (scanData, time) => {
        //  Update the list of scanned barcodes
        console.log("EVENTO DATASCAN "+scanData.extras)
        if ( this.device_type==1){
        let scannedData = scanData.extras["com.symbol.datawedge.data_string"];
        let scannedType = scanData.extras["com.symbol.datawedge.label_type"];
        this.codeRead(scannedData);
        }
        if ( this.device_type==2){
          let scannedData = scanData.extras["SCAN_BARCODE1"];
          console.log("SCANNED DATA "+scannedData);
          this.codeRead(scannedData);
        }

        if ( this.device_type==3){
          this.codeRead(scanData.barcodeData.substring(0,scanData.barcodeData.length-1));
         
        }
      });
     }
     ionViewWillLeave(){
       this.events.unsubscribe('data:scan');
     }
  ngOnInit() {
    console.log("URL    "+this.router.url);
    if (this.feed_vocal){
    this.tts.speak({
      text: this.text,
      locale: 'it-IT',
      rate: 1
  })
  .then(() => console.log('Success'))
  .catch((reason: any) => console.log(reason));
}
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
      console.log(t);
      if (this.tanksdata[t].SIGLA==data){
        this.stato=1;
        this.tank=data;
        this.tankId = this.tanksdata[t].ID;
        this.displayDeposito = "block";
      if(this.feed_vocal) this.speak("Deposito "+this.tank+" selezionato. Scansiona codice prodotto.");
       this.message="DEPOSITO "+this.tank+" SELEZIONATO. SCANSIONA CODICE PRODOTTO.";
      return;
      }
    }
    if (this.feed_vocal){  
    this.speak("Codice depòsito sconosciuto"); }
    this.message=data+" - CODICE DEPOSITO SCONOSCIUTO";
    }

    findProduct(data){
      console.log("PROCEDURA FIND PRODUCT AVVIATA")
      let trovato=false;
      for (let p in this.productscodesdata){
        
        if(this.productscodesdata[p].CODICE==data){
          trovato=true;
          this.stato=2;
          console.log("TORVATO!")
          console.log("++++++++++++++++++++++++++++++++++++")
        console.log(this.productscodesdata[p].CODICE +" = "+data)
        console.log(this.productscodesdata[p].PRODOTTO)
        console.log(this.productscodesdata[p].ID_PRODOTTO)
          this.product = this.productscodesdata[p].PRODOTTO;
          this.productId = this.productscodesdata[p].ID_PRODOTTO;
          this.displayProdotto = "block";
          this.displaySpinner = "block";
          this.message="PRODOTTO  "+this.product+ " SELEZIONATO.";
          if (this.feed_vocal){  
          this.tts.speak({
            text: "Prodotto  "+this.product+ "selezionato.",
            locale: 'it-IT',
            rate: 1
        })
        .then(() => 
       this.verify()
        )
        .catch((reason: any) => console.log(reason));
          return;
        }
        else
        {
          this.verify()
        }
      }
      
      }
      if (!trovato){
        if (this.feed_vocal) this.speak("Codice prodotto sconosciuto");
      console.log("CODICE PRODOTTO SCONOSCIUTO")
      this.message="CODICE PRODOTTO SCONOSCIUTO";
      }
    }


    verify(){
      console.log(this.host+'/verifyproductintank/'+this.productId+'/'+this.tankId);
      this.http.get("http://"+this.host+'/verifyproductintank/'+this.productId+'/'+this.tankId)
      .subscribe(data => {
        console.log("RESPONSE "+data)
        if (data ==1){
          if(this.feed_vocal){
          this.tts.speak({
            text: "Corrispondenza Trovata. Carico Abilitato.",
            locale: 'it-IT',
            rate: 1
        })
        .then(() => 
        this.router.navigate(['/members/tank', this.tankId])
        )
        .catch((reason: any) => console.log(reason));
        }
        this.message="CORRISPONDENZA TROVATA. CARICO ABILITATO";
        this.router.navigate(['/members/tank', this.tankId])
      }

        else{
          this.message="CORRISPONDENZA NON TROVATA. CARICO NON ABILITATO.";
          if(this.feed_vocal){
          this.tts.speak({
            text: "Corrispondenza Non Trovata",
            locale: 'it-IT',
            rate: 1
        })
        .then(() => 
            this.azzera()
        )
        .catch((reason: any) => console.log(reason));
         
        }
        this.message="CORRISPONDENZA NON TROVATA";
        this.azzera()
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
