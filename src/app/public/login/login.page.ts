import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from './../../services/authentication.service'
import { Device } from '@ionic-native/device/ngx';

import { Events, AlertController, Platform, ToastController, NavController } from '@ionic/angular';
import { BarcodeService } from 'src/app/barcode.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [BarcodeService, Device],
})
export class LoginPage implements OnInit {


  private loginForm: FormGroup;
  private code: string;
  public displaySpinner:string;
  public constructor(public events:Events,public router:Router, private authService: AuthenticationService, private formBuilder: FormBuilder, public navCtrl: NavController, private barcodeProvider: BarcodeService,
    private changeDetectorRef: ChangeDetectorRef, private device: Device,
    private alertController: AlertController, private platform: Platform, private toastController: ToastController) {
    this.code = "";
    this.displaySpinner="none";
    this.loginForm = this.formBuilder.group({
      id: ['', Validators.required],
      password: [''],
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
    let scannedData = scanData.extras["com.symbol.datawedge.data_string"];
    let scannedType = scanData.extras["com.symbol.datawedge.label_type"];
    this.logincode(scannedData);
    this.changeDetectorRef.detectChanges();
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
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "START_SCANNING");
  }

  //  Function to handle the floating action button onUp.  Cancel any soft scan in progress.
  public fabUp() {
    console.log("ZEBRA FABDOWN");
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "STOP_SCANNING");
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
    this.authService.login(this.user['id'], this.user['password']);
    this.loginForm.reset();
  }
  logincode(code: string) {
    this.displaySpinner="block";
    this.authService.loginWithCode(code);
  
  }

  scanLogin() {
  }
  

}
