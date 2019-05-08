import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  public host:string;
  public tanksdata:any;
  public alarms:any;
  public drumsdata:any;
  public productsdata:any;
  public productscodesdata:any;
  public controlsdata:any;
  public vibration:boolean;
  constructor(
    private http:HttpClient, private router: Router,private tts: TextToSpeech) { 
    this.host = "c7183545.ngrok.io"
    this.getMessage();
    this.getAlarms();
    this.getTanksData();
    this.getDrumsData();
    this.getProductsCodes();
    this.getProductsData();
    this.getControlsData();
    this.getNewAlarms();
 
    var interval = setInterval(()=>{ 
    this.getMessage();
      this.getAlarms();
     this.getTanksData();
     this.getDrumsData();
    this.getProductsCodes();
     this.getProductsData();
     this.getControlsData();
    this.getNewAlarms();
    
    }, 5000);

    
  }

  getTanksData(){

    this.http.get('http://'+this.host+'/gettanksdata')
    .subscribe(data => {
      this.tanksdata=data;
    })
  }
  
  getDrumsData(){
  
    this.http.get('http://'+this.host+'/getdrumsdata')
    .subscribe(data => {
      this.drumsdata=data;
    })
  }
  getProductsCodes(){
  
    this.http.get('http://'+this.host+'/getproductscodes')
    .subscribe(data => {
      this.productscodesdata=data;
    })
  }
  getNewAlarms(){  
    this.http.get('http://'+this.host+'/getnewalarms')
    .subscribe(data => {
      if (data ==1){
        this.vibration = true;
        this.router.navigate(['alarms']);
      }
      
    })
  }
  getMessage(){  
    this.http.get('http://'+this.host+'/getmessage')
    .subscribe(data => {
     
      if (data[0]['MESSAGGIO']!=""){
      console.log("PARLO: "+data[0]['MESSAGGIO'])
      this.tts.speak({
        text: data[0]['MESSAGGIO'],
        locale: 'it-IT',
        rate: 1.25
    })
    .then(() => console.log('Success'))
    .catch((reason: any) => console.log(reason)); 
  }
    })
  }
  getAlarms(){  
    this.http.get('http://'+this.host+'/getalarms')
    .subscribe(data => {
     this.alarms = data;
    })
  }
  getProductsData(){
    this.http.get('http://'+this.host+'/products/1')
    .subscribe(data => {
      this.productsdata=data;
      
    })
  }
  getControlsData(){
    this.http.get('http://'+this.host+'/controls/1')
    .subscribe(data => {
      this.controlsdata=data;
    })
  }
}
