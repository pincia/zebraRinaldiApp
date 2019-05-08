import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from './../../services/authentication.service';
import { Router } from '@angular/router';
import { Navigation } from 'selenium-webdriver';
import { AutoLogoutComponent } from '../../components/auto-logout/auto-logout.component';
import { ModalController } from '@ionic/angular';
import { DeviceFeedback } from '@ionic-native/device-feedback/ngx';
import { DataService } from 'src/app/services/data.service';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit{

  router:Router;
  user:string;
  loginData:string[];
  navigation:Navigation;
  constructor(private deviceFeedback: DeviceFeedback,
     private tts: TextToSpeech,
      private speechRecognition: SpeechRecognition, 
      private dataService: DataService,
      private authService: AuthenticationService,
 
      private modalController:ModalController,  
      router:Router) { 
    this.router=router;
 
    authService.storage.get('auth-token').then( res=>{ this.loginData= res.split(' ')
    this.user = this.loginData[0];
 
  
  });

  }
 
  ngOnInit() {
    console.log("URL    "+this.router.url);
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
}