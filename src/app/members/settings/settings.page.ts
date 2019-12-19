import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NavParams } from '@ionic/angular';

//declare var KioskPlugin: any;
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public primaryColor:any;
  constructor( public router: Router) {
    this.primaryColor =  '#44bbec';
  
  }

   ngOnInit() {
  }
  public exitKiosk(){
    console.log("EXIT KISOKKKK")
    //KioskPlugin.exitKiosk();
  }
 
  getHeaderStyle(){
    return { 'background':this.primaryColor}
  };

  
}

 