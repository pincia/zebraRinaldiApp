import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from './../../services/authentication.service';
import { Router } from '@angular/router';
import { Navigation } from 'selenium-webdriver';
import { ModalController, NavController, PopoverController, NavParams } from '@ionic/angular';
import { DeviceFeedback } from '@ionic-native/device-feedback/ngx';
import { DataService } from 'src/app/services/data.service';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { PushService } from 'src/app/services/push.service';
import {Platform} from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ViewController } from '@ionic/core';
import { HomeMenuPopoverPagePageModule } from 'src/app/popover/home-menu-popover-page/home-menu-popover-page.module';
import { HomeMenuPopoverPagePage } from 'src/app/popover/home-menu-popover-page/home-menu-popover-page.page';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { AutoLogoutService } from 'src/app/services/auto-logout.service';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit{
  cssClass: string;
  primaryColor= '#64db00';
  secondryColor ='#6ba000';
  fullWhiteLogo = "assets/images/logo.png";
  options: NativeTransitionOptions = {
    direction: "right",
    duration: 500,
    slowdownfactor: 3,
    slidePixels: 20,
    iosdelay: 100,
    androiddelay: 150,
    fixedPixelsTop: 0
  };

  roleId = 13;
  router:Router;
  user:string;
  loginData:string[];
  navigation:Navigation;
 public comandi_vocali:boolean;
  constructor(public storage:Storage,
    public autoLogoutService:AutoLogoutService,
    private deviceFeedback: DeviceFeedback,
    public popoverController: PopoverController,
     private tts: TextToSpeech,
     private nativePageTransitions: NativePageTransitions,
     public navCtrl: NavController,
      private speechRecognition: SpeechRecognition, 
      private dataService: DataService,
      private platform:Platform,
      private authService: AuthenticationService,
      pusher: PushService,
      private modalController:ModalController, 
      router:Router) { 
    this.router=router;
 

  }

  ionViewWillEnter(){
    console.log("ionViewWillEnter")
    this.storage.get("comandi_vocali").then(res => {
      if (res) {
         this.comandi_vocali=res;      }
      else{
        this.comandi_vocali=false;
      } 
    });
  }

  ngOnInit() {
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {

        if (!hasPermission) {
        this.speechRecognition.requestPermission()
          .then(
            () => console.log('Granted'),
            () => console.log('Denied')
          )
        }

     });
     


  }
  
  openPage(page: any) {

    this.nativePageTransitions.slide(this.options).then(()=>{
      console.log("TRANSITION SUCCESS");
    }
      
    ).catch((err)=>{
      console.log("TRANSITION ERROR");
      console.log(err);
    });
    this.navCtrl.navigateForward(page);
  
  }

  logout() {
    this.authService.logout();
  }

  feedback(n){
   
    this.deviceFeedback.acoustic();

    this.deviceFeedback.haptic(n);
  }
  talk(){

    this.speechRecognition.startListening()
    .subscribe(
      (matches: Array<string>) => {
        var re = /depositi/gi; 
        if (matches[0].search(re) != -1 ) { 
          this.router.navigate(['/storage'])
          return;
        } 
      
        var re = /bottali/gi; 
        if (matches[0].search(re) != -1 ) { 
          this.router.navigate(['/drums'])
          return;
        } 
        var re = /allarmi/gi; 
        if (matches[0].search(re) != -1 ) { 
          this.router.navigate(['/alarms'])
          return;
        } 
        var re = /ricette/gi; 
        if (matches[0].search(re) != -1 ) { 
          this.router.navigate(['/members/recipe'])
          return;
        }
        var re = /carico/gi; 
        if (matches[0].search(re) != -1 ) { 
          this.router.navigate(['/carico'])
          return;
        } 
        
        this.tts.speak({
          text: "COMANDO NON RICONOSCIUTO",
          locale: 'it-IT',
          rate: 1.25
      })
      },
      (onerror) => console.log('error:', onerror)
    )
  }





  getstyle() {
    return {
      background:"linear-gradient(var(--ion-color-primary),var(--ion-color-secondary))"
       // "linear-gradient('var(--ion-color-primary),transparent)','var(--ion-color-secondry),transparent)')"
    };
  }
  getProgresstyle() {
    return {
      background:
        "linear-gradient(to right,var(--ion-color-secondary),var(--ion-color-primary))"
    };
  }
  getHeaderStyle() {
    return { background: "var(--ion-color-primary)" };
  }
  getFontstyle() {
    return { color: "var(--ion-color-secondary)"};
  }

 
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: HomeMenuPopoverPagePage ,
      event: ev,
      translucent: true
    });
    popover.onDidDismiss().then(data => {
      if (data.data == "profile") {
        this.router.navigate(['profile'])
      } else if (data.data == "settings") {
        this.router.navigate(['settings']);
       
      } else if (data.data == "logout") {
        this.authService.logout();
        }
      }
    );
    return await popover.present();
  }



}
