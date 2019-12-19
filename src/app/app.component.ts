import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { AlertController, LoadingController, NavController } from 
'@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Storage } from '@ionic/storage';

ss

//import { AnyTxtRecord } from 'dns';
//import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
//import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})


export class AppComponent {
  private vibe:boolean;
  private vibration_active:any;
  private interval:any;
  pages: Array<{ title: string, component: any, active: boolean, icon: string }>;
  constructor(
    private screenOrientation: ScreenOrientation,
    private oneSignal: OneSignal,
    private device:Device,
    private vibration:Vibration,
    private nativeAudio: NativeAudio,
    private storage:Storage,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthenticationService,
    private router: Router,
    private http:HttpClient,
   // public endpoint= environment.serverEndpoint,
 
    private alertCtrl: AlertController
  ) {
    this.vibration_active=false;
    this.oneSignal.startInit('f5cf95c2-43d3-4e31-b83d-75a2a5df62d4', '294203629540');
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
    
    this.oneSignal.handleNotificationReceived().subscribe((data) => {
     // do something when notification is 
      console.log(data.payload);
     let type = data.payload['additionalData']['type'] ;
     let machine = data.payload['additionalData']['machine'] ;
     let message = data.payload['additionalData']['message'] ;
    if(type=="ALARM") this.nativeAudio.play('test');
    if(type=="INFO") this.nativeAudio.play('test2');
    
      console.log(data);
     this.presentAlert(type,machine+"\n"+message,);
     this.vibrate();
      
    });
    platform.ready().then(()=>{
      console.log("DEVICE INFO")
     console.log(device.manufacturer)
    if (device.manufacturer.includes('Zebra')){
        storage.set("DEVICE_TYPE",1)
        
    }
    if (device.manufacturer.includes('Newl')){
      storage.set("DEVICE_TYPE",2)
    
    }
    })
   
    this.oneSignal.handleNotificationOpened().subscribe((data) => {
      /*
      let type = data.payload['additionalData']['type'] ;
      let machine = data.payload['additionalData']['machine'] ;
      let message = data.payload['additionalData']['message'] ;*/
      // do something when a notification is opened
  
//console.log(data.payload);
      this.presentAlert("ACTION","Alarm Recived");
     
    });
    
    this.oneSignal.endInit();
    
    this.initializeApp();
  }
   
vibrate(){
  console.log("vibrate");
  this.vibration.vibrate([200,100,200,100,200,100,200,100,]);
}
  initializeApp() {
    this.platform.ready().then(() => {
       
    
      this.authenticationService.authenticationState.subscribe(state => {
     
        if (state) {
          this.router.navigate(['members/dashboard']);
        } else {
          this.router.navigate(['login']);
        }

      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.nativeAudio.preloadSimple('test', 'assets/sounds/woop.mp3');
      this.nativeAudio.preloadSimple('test2', 'assets/sounds/info.wav');
      
    });
    
  }
  async presentAlert(type,message){
    this.vibe=true;
    let cssclass = "";
    let header = "";
    if (type=="ALARM") {
      cssclass="alarm";
      header="ALARM";
    }
    if(type=="INFO") {
      cssclass="info";
    header="INFO";
  }
    const  alert = await this.alertCtrl.create({
     header: header,
     message: message,
     buttons: [ {
      text: 'Ok',
      cssClass: cssclass,
      handler: () => {
        this.router.navigate(['alarms']);
        console.log("HANDLED");
      }
    }],
     cssClass: cssclass,  
    
   });
   alert.onDidDismiss().then(
    (data)=>{
console.log("DISMISSED");
this.oneSignal
//clearInterval(this.interval);
    }

   );
  await alert.present();

  
    
  }
}
