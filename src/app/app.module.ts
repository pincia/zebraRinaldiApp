import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { DeviceFeedback } from '@ionic-native/device-feedback/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationService } from './services/authentication.service';
import { DataService } from './services/data.service';
//import {AngularLaravelEchoModule, ECHO_CONFIG, EchoService, SocketIoEchoConfig} from 'angular-laravel-echo';
//import { PushService } from './services/push.service';

/*
const echoConfig: SocketIoEchoConfig = {
  userModel            : 'App\\User',
  notificationNamespace: 'App\\Notifications',
  options              : {
      host       : 'http://localhost:6001',
      broadcaster: 'socket.io',
  },
};
*/
@NgModule({
  declarations: [AppComponent ],
  entryComponents: [],
  imports: [/*AngularLaravelEchoModule.forRoot(echoConfig),*/BrowserModule,IonicStorageModule.forRoot(), IonicModule.forRoot(),HttpClientModule, AppRoutingModule, CommonModule,
    FormsModule],
  providers: [
    StatusBar,
    DataService,
    SplashScreen,
    Vibration,
    TextToSpeech,
    DeviceFeedback,
    SpeechRecognition,
    //PushService,
  
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private authService: AuthenticationService){

  }
  

}
