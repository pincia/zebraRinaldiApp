import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from './../../services/authentication.service'
import { Device } from '@ionic-native/device/ngx';
import { Storage } from '@ionic/storage';
import { Events, AlertController, Platform, ToastController, NavController } from '@ionic/angular';
import { BarcodeService } from 'src/app/barcode.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [BarcodeService, Device],
})
export class LoginPage implements OnInit {

  private showPasswordText;
  private loginForm: FormGroup;
  private code: string;
  public impianti:any;
  public displaySpinner:string;
  public codice_impianto:string;
  public device_type:number;
  public constructor(public events:Events,public router:Router, private authService: AuthenticationService, private formBuilder: FormBuilder, public navCtrl: NavController, private barcodeProvider: BarcodeService,
    private changeDetectorRef: ChangeDetectorRef, private device: Device,
    public storage:Storage,
  
    private alertController: AlertController, private platform: Platform, private toastController: ToastController) {
    this.code = "";
   
    storage.get("DEVICE_TYPE").then((val)=>{
      this.device_type=val
    })
    this.impianti=environment.impianti;
    this.showPasswordText=false;
    this.displaySpinner="none";
    this.loginForm = this.formBuilder.group({
      id: ['', Validators.required],
      password: [''],
      codice_impianto:['']
    });
    this.platform.ready().then((readySource) => {
      this.barcodeProvider.sendCommand("com.symbol.datawedge.api.CREATE_PROFILE", "Italprogetti");

      let profileConfig = {
        "PROFILE_NAME": "Italprogetti",
        "PROFILE_ENABLED": "true",
        "CONFIG_MODE": "UPDATE",
        "PLUGIN_CONFIG": {
          "PLUGIN_NAME": "BARCODE",
          "RESET_CONFIG": "true",
          "PARAM_LIST": {}
        },
        "APP_LIST": [{
          "PACKAGE_NAME": "it.italprogetti.zebraapp",
          "ACTIVITY_LIST": ["*"]
        }]
      };
      console.log("PROFILE CONFIG 1");
      this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig);

      //  Configure the created profile (intent plugin)
      let profileConfig2 = {
        "PROFILE_NAME": "Italprogetti",
        "PROFILE_ENABLED": "true",
        "CONFIG_MODE": "UPDATE",
        "PLUGIN_CONFIG": {
          "PLUGIN_NAME": "INTENT",
          "RESET_CONFIG": "true",
          "PARAM_LIST": {
            "intent_output_enabled": "true",
            "intent_action": "it.italprogetti.zebraapp.ACTION",
            "intent_delivery": "2"
          }
        }
      };
      console.log("PROFILE CONFIG 2");
      this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig2);

     
    });

  }
  ionViewWillEnter(){
   //  A scan has been received
   this.events.subscribe('data:scan', (scanData, time) => {
    //  Update the list of scanned barcodes
    console.log("RICEVUTOO evento "+scanData)
    if ( this.device_type==1){
    let scannedData = scanData.extras["com.symbol.datawedge.data_string"];
    let scannedType = scanData.extras["com.symbol.datawedge.label_type"];
    this.logincode(scannedData);
    this.changeDetectorRef.detectChanges();}
    if ( this.device_type==2){
      
      let scannedData = scanData.extras["SCAN_BARCODE1"];
      console.log("SCANNED DATA "+scannedData);
      this.logincode(scannedData);
    }

    if ( this.device_type==3){
   
      this.logincode(scanData.barcodeData.substring(0,scanData.barcodeData.length-1));
    }
    
  });

  }
  ionViewWillLeave(){
    this.events.unsubscribe('data:scan');
    this.displaySpinner="none";
  }
  //  Function to handle the floating action button onDown.  Start a soft scan.
  public fabDown() {
    console.log("ZEBRA FABDOWN");
    //this.logincode('ItalProgetti');
    if ( this.device_type==1){
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "START_SCANNING");
      console.log("TASTO SCAN PREMUTO")
  }
    if ( this.device_type==2){
    this.barcodeProvider.sendCommandNewland();}
  }

  //  Function to handle the floating action button onUp.  Cancel any soft scan in progress.
  public fabUp() {
    console.log("ZEBRA FABDOWN");
    if ( this.device_type==1){
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "STOP_SCANNING");}
  }

  ngOnInit() {
    this.events.subscribe('login: done', (res) => {
      this.displaySpinner="none";
    });
  }
  user = {}

  login() {
    console.log(this.user);
    this.displaySpinner="block";

  this.authService.login(this.user['id'], this.user['password']).subscribe(
    res => {
     
      this.displaySpinner="none";
      console.log("PRESENT TOAST")
      this.presentToast("UTENTE "+this.user['id']+" LOGGATO")
    },          
    err => {
    this.presentToast("UTENTE SCONOSCIUTO")
      this.displaySpinner="none";
    },     
    () => {console.log('all done!');
  }
  );
    this.loginForm.reset();
  }


  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  
  logincode(code: string) {
    console.log("LOGIN WITH CODE");
    this.displaySpinner="block";
    let param = code.split("_")
    this.authService.login(param[0],param[1]).subscribe(
      res => {
        this.presentToast("UTENTE "+param[0]+" LOGGATO")
        this.displaySpinner="none";
      },          
      err => {
        this.presentToast("UTENTE SCONOSCIUTO")
        this.displaySpinner="none";
      },     
      () => {console.log('all done!');
    }
    );
      this.loginForm.reset();
    }

  scanLogin() {
  }
  

  onChange(value){
    this.codice_impianto=value;
    this.storage.set("codice_impianto",value)
    this.impianti.forEach(impianto=>{
      if(impianto.codice_impianto==this.codice_impianto){
        this.storage.set("api_host",impianto.api_host);
        this.storage.set("socket_host",impianto.socket_host);
        this.storage.set("codice_registrazione",impianto.codice_registrazione);
        this.authService.host=impianto.api_host;
        console.log("DATI IMPIANTO SETTATI");
            }
    })
  }
}
interface Propriety {
  name: string;
  value: boolean;
}
