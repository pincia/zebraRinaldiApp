import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { FormsModule,ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { DeviceFeedback } from '@ionic-native/device-feedback/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationService } from './services/authentication.service';
import { DataService } from './services/data.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import {AngularLaravelEchoModule, ECHO_CONFIG, EchoService, SocketIoEchoConfig} from 'angular-laravel-echo';
import { PushService } from './services/push.service';
import { File }  from '@ionic-native/File/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { environment } from 'src/environments/environment';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { HomeMenuPopoverPagePage } from './popover/home-menu-popover-page/home-menu-popover-page.page';
import { Http ,Response ,Headers, RequestOptions} from '@angular/http';
import { HttpModule } from '@angular/http';
import { Device } from '@ionic-native/device/ngx';
import { AutoLogoutService } from './services/auto-logout.service';

const echoConfig: SocketIoEchoConfig = {
  userModel            : 'App\\User',
  notificationNamespace: 'App\\Notifications',
  
  options              : {
      host       : environment.socketEndpoint,
      broadcaster: 'socket.io',
  },
};

@NgModule({
  declarations: [AppComponent,HomeMenuPopoverPagePage],
  entryComponents: [HomeMenuPopoverPagePage],
  imports: [
    AngularLaravelEchoModule.forRoot(echoConfig),
    BrowserModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['sqlite','localstorage' ]
    }),
    IonicModule.forRoot(),HttpClientModule, 
    AppRoutingModule, CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule],
  providers: [
    StatusBar,
    AutoLogoutService,
    Device,
    DataService,
    SplashScreen,
    Vibration,
    File,
    ScreenOrientation,
    FileOpener,
    TextToSpeech,
    FormBuilder,
    DeviceFeedback,
    WebView,
    FilePath,
    NativeAudio,
    NativePageTransitions,
    SpeechRecognition,
    PushService,
    OneSignal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})

export class AppModule {

  constructor(private authService: AuthenticationService){
  }
  

}
