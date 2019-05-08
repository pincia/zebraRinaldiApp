import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Vibration } from '@ionic-native/vibration/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';



@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.page.html',
  styleUrls: ['./alarms.page.scss'],
})
export class AlarmsPage implements OnInit {
  public alarms:any;
  public text:string;
  constructor(private tts: TextToSpeech, private vibration:Vibration, private dataService: DataService) {
    this.alarms = dataService.alarms;
    console.log(this.alarms);
    this.text = 'Allarme '+this.alarms[0]['NOME_MACCHINA']+' '+this.alarms[0]['NOME_ALLARME'].toLowerCase( );
    //this.text ="PAOLO GAY!";
  }

  ngOnInit() {
    if(this.dataService.vibration ){
      this.vibration.vibrate([200,100,200,100,200,100,200,100,]);
      this.dataService.vibration = false;

    }
    this.tts.speak({
      text: this.text,
      locale: 'it-IT',
      rate: 1.25
  })
  .then(() => console.log('Success'))
  .catch((reason: any) => console.log(reason));
  }


  buttonClick(alarms,index){
    console.log("PIPPO ALARM!");
  }

}
