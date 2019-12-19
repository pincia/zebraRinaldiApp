/*
 * Developed by Mannini Andrea (https://github.com/manniniandrea). :bowtie:
 * Last modified 5/2/19 4:09 PM.
 * Copyright 2019-2019 Mannini Andrea (https://github.com/manniniandrea)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

import { Injectable } from '@angular/core';
import { EchoService, AngularLaravelEchoModule } from 'angular-laravel-echo';
import { ChannelType } from 'angular-laravel-echo/src/services/lib.service';
import { Observable, Subscription } from 'rxjs';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';


@Injectable({
    providedIn: 'root',
})


export class PushService {
    
    private _notifications: Subscription = null;
    private _privateChannels: string[] = [];
    public host: string;
    public tanksdata: any;
    public alarms: any;
    public alarm: any;
    public _drumsdata: any;
    public drumsdata: any;
    public productsdata: any;
    public productscodesdata: any;
    public controlsdata: any;
    public controlslist: any;
    public lastRND:number;
    public lastRNDTime: number;
    public actualRND:number;
    public interval:any;
    public vibration: boolean;
    public actualRNDTime:number;
    public endpoint:any;
    public token:any;
    public vpn_on:boolean;
    public websocket_on:boolean;
    constructor(private _echo: EchoService,
        private alertCtrl: AlertController,
        private oneSignal: OneSignal,
        private http:HttpClient,
        private storage: Storage,
    ) {

        this.storage.get('api_host').then(res => {
            if (res) {
               console.log("ENDPOINT SETTED TO "+res)
            this.endpoint=res;
            }
          })
          this.storage.get('authtoken').then(res => {
            if (res) {
                console.log("TOKEN TROVATO "+res);
            this.token=res;
            }
          })
         
          this.storage.get('vpn_on').then(res => {
            if (res) {
            this.vpn_on=res;
            }
            else
            {
                this.vpn_on=false;
            }
            
          })
          this.storage.get('websocket_on').then(res => {
            if (res) {
            this.websocket_on=res;
            }
            else
            {
                this.websocket_on=false;
                
            }
            if(environment.socketAlarm&&this.websocket_on){
                console.log("CHECK WEBSOCKET")
              this.interval = setInterval(()=>{ 
                     this.checkCOM();
                    }, 1500);
            }
            console.log("websocket_on "+this.vpn_on)
    
      

        if(this.websocket_on){
     //if(environment.dataSocket){
        console.log("PUSHSERVICE-> LISTEN TO CHANNEL");
        _echo.echo.channel('public').listen('.drumdata', (e) => {
            this._drumsdata = e['eventData']['drums'];
            this.tanksdata = e['eventData']['tanks'];
            this.alarms = e['eventData']['alarms'];
            this.productsdata = e['eventData']['products'];
            this.controlsdata = e['eventData']['controls'];
            this.productscodesdata = e['eventData']['productscodes'];
            this.alarm = e['eventData']['alarm'];
            this.controlslist = e['eventData']['controlslist'];
            this.actualRND = e['eventData']['rnd'];
            let newdrumsdata=[];
            this._drumsdata.forEach(function(_drum){
                let stato = _drum['INFOSTATO1'];
                let output = _drum['OUTPUT1'];
                _drum['AUTOMATICO']=stato.charAt(1);
                _drum['RUNNING']=stato.charAt(2);
                _drum['DIREZIONE']=stato.charAt(3);
                _drum['FILTRO']=stato.charAt(4);
                _drum['INVERSIONE']=stato.charAt(5);
                _drum['RISCALDAMENTO']=stato.charAt(6);
                _drum['RICETTAON_OFF']=stato.charAt(7);
                _drum['LUCE_VERDE']=stato.charAt(11);
                _drum['LUCE_GIALLA']=stato.charAt(12);
                _drum['LUCE_ROSSA']=stato.charAt(13);
                _drum['ALARM']=output.charAt(14);
                newdrumsdata.push(_drum);
           
            })
            this.drumsdata=newdrumsdata;

        });
    }else{
  //  this.getData();
    var interval = setInterval(()=>{ 
     this.getData();   
    }, 5000);
    }
    })
        this.actualRND = 0;
        this.lastRND=0;
        this.lastRNDTime=Date.now();


     

        console.log("PUSH SERVICE STARTED  VPN_ON IS "+this.vpn_on+" URL is "+this.endpoint);
    }

    public listen(type: ChannelType, name: string, eventName: string): Observable<any> {

        this._echo.join(name, type);
        if (type === 'public') {
            this._privateChannels.push(name);
        }
        return this._echo.listen(name, eventName);
        // .pipe(share());
    }

    public leave(name: string) {
        this._echo.leave(name);
        let index;
        if ((index = this._privateChannels.indexOf(name)) >= 0) {
            this._privateChannels.splice(index, 1);
        }
    }

    private _leaveAll() {
        let channel;
        while ((channel = this._privateChannels.pop()) != null) {
            this.leave(channel);
        }
    }

    private checkCOM(){
            if (this.lastRND!=this.actualRND){
                this.lastRNDTime= Date.now();
              
                this.lastRND=this.actualRND;
            }
            else{
                let diff = Date.now()-this.lastRNDTime;
                if (diff>1000*10) {
                    clearInterval(this.interval);
                    this.presentAlert("NO DATA","WEBSOCKET DATA NO COMMUNICATION");
                }
            }
    }

    async presentAlert(header,message){ 
        const  alert = await this.alertCtrl.create({
         header: header,
         message: message,
         buttons: [ {
          text: 'Ok',
          handler: () => {
            console.log("HANDLED");
            this.lastRNDTime=Date.now();
          }
        }],
         cssClass: 'alarm',  
        
       });
       alert.onDidDismiss().then(
        (data)=>{
    console.log("DISMISSED");
    
    this.interval = setInterval(()=>{ 
        this.checkCOM();
       
       }, 1500);
       
       // clearInterval(this.interval);
        }
    
       );
      await alert.present();     
      }

      
      getData(){
        this.http.get('http://'+this.endpoint+'/api/auth/getdata/')
        .subscribe(data => {
           // console.log(data);
            let newdrumsdata=[];
            data['drums'].forEach(function(_drum){
                let stato = _drum['INFOSTATO1'];
                let output = _drum['OUTPUT1'];
                _drum['AUTOMATICO']=stato.charAt(1);
                _drum['RUNNING']=stato.charAt(2);
                _drum['DIREZIONE']=stato.charAt(3);
                _drum['FILTRO']=stato.charAt(4);
                _drum['INVERSIONE']=stato.charAt(5);
                _drum['RISCALDAMENTO']=stato.charAt(6);
                _drum['RICETTAON_OFF']=stato.charAt(7);
                _drum['LUCE_VERDE']=stato.charAt(11);
                _drum['LUCE_GIALLA']=stato.charAt(12);
                _drum['LUCE_ROSSA']=stato.charAt(13);
                _drum['ALARM']=output.charAt(14);
                newdrumsdata.push(_drum);
           
            })
            this.drumsdata=newdrumsdata;
            this.tanksdata = data['tanks'];
           
            this.alarms =data['alarms'];
            this.productsdata = data['products'];
            this.controlsdata = data['controls'];
            this.productscodesdata = data['productscodes'];
            this.alarm = data['alarm'];
            this.controlslist = data['controlslist'];
            this.actualRND = data['rnd'];
        })
        const headers = new HttpHeaders({
            'Authorization': "Bearer "+this.token
          });

      }
     
}
