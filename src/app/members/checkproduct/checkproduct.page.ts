import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { BarcodeService } from 'src/app/barcode.service';
import { DataService } from 'src/app/services/data.service';
import { Events } from '@ionic/angular';
@Component({
  selector: 'app-checkproduct',
  templateUrl: './checkproduct.page.html',
  styleUrls: ['./checkproduct.page.scss'],
  providers: [BarcodeService],
})
export class CheckproductPage implements OnInit {
  public drum:string;
  public step:string;
  public odp:string;
  public drumid:number;
  public product:string;
  public productsdata:any;
  public displayDrum:string;
  public stato:number;
  public displayProdotto:string;
  public displaySpinner:string;
  constructor(private route: ActivatedRoute,public router:Router,private dataService: DataService,private events:Events, private tts: TextToSpeech, private barcodeProvider: BarcodeService) {
    this.displayDrum = "none";
    this.displayProdotto = "none";
    this.displaySpinner = "none";
    this.stato = 0;
    this.productsdata = dataService.productsdata;
    this.route.paramMap.subscribe((queryParams: ParamMap) => {
      this.drum = queryParams.get('drum');
      this.step = queryParams.get('step');
      this.odp = queryParams.get('odp');
   });
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
    this.tts.speak({
      text: "Scansiona codice bottale",
      locale: 'it-IT',
      rate: 1.25
  })
  .then(() => console.log('Success'))
  .catch((reason: any) => console.log(reason));
  }

  public fabDown() {
    
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
        this.findDrum(data);
        break;
      }
      case 1:{
        this.findProduct(data);
        break;
      }
    }
    console.log("CODE READ:"+data);
  }

  findDrum(data){
    console.log("FIND TANK");
    for (let t in this.productsdata){
      if (this.productsdata[t].NOME_BOTTALE==data && this.productsdata[t].ID_ODP== this.odp ){
        this.stato=1;
        this.drum=data;
        this.drumid = this.productsdata[t].ID_BOTTALE;
        this.displayDrum = "block";
       this.speak("Bottale "+this.drum+" selezionato correttamente. Scansiona codice contenitore.");
      return;
      }
    }

    this.speak("Codice bottale non corretto"); }

    findProduct(data){
      this.displayProdotto = "block";
      this.tts.speak({
        text: "Contenitore  selezionato.",
        locale: 'it-IT',
        rate: 1.25
    })
    .then(() => 
      this.verifyContanier()
     )
    .catch((reason: any) => console.log(reason));  
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
    verifyContanier(){
      this.displaySpinner = "block";
      if (true){
        this.tts.speak({
          text: "Inserimento completato.",
          locale: 'it-IT',
          rate: 1.25
      })
      .then(() => 
/*      this.router.navigate(['menu/dashboard'])*/ 
console.log("test"))
      .catch((reason: any) => console.log(reason));  
        
      }
    }
}
