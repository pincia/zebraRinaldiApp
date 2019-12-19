import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { AutoLogoutService } from 'src/app/services/auto-logout.service';
import { DashboardPage } from 'src/app/members/dashboard/dashboard.page';
@Component({
  selector: 'app-general',
  templateUrl: './general.page.html',
  styleUrls: ['./general.page.scss'],
})
export class GeneralPage implements OnInit {
  primaryColor='#44bbec';
  secondryColor = '#0163fc';
  auto_logout:string;
  websocket_on:boolean;
  comandi_vocali:boolean;
  impianti = environment.impianti;
  dashboard:DashboardPage;
  autolog:any;
  constructor(autolog:AutoLogoutService, private storage:Storage) {
    this.autolog=autolog;
    this.storage.get("auto_logout").then(res => {
    if (res) {
      this.auto_logout=res;      
    }
   else{
     this.auto_logout="";
   }
 
 });
 this.storage.get("websocket_on").then(res => {
   if (res) {
      this.websocket_on=res;      }
   else{
     this.websocket_on=false;
   } 
 });
 this.storage.get("comandi_vocali").then(res => {
  if (res) {
     this.comandi_vocali=res;   
    
    }
  else{
    this.comandi_vocali=false;
  
  } 
});
   }

  ngOnInit() {
  }

  getHeaderStyle() {
    return { background: this.primaryColor };
  }
  setPropriety(propriety){
    let val=false
    this.storage.get(propriety).then(res => {
    
    val = !res
    this.storage.set(propriety, !res).then(res2 => {

    })
    
  });
  if(propriety="comandi_vocali") 
  {  this.dashboard.comandi_vocali=val;
    console.log("CAMBIO A "+val)
  }
  }

  onChange(value){
    this.auto_logout=value;
    this.autolog.setInterval(value)
    this.storage.set("auto_logout",value);
  }
}
interface Propriety {
  name: string;
  value: boolean;
}
