import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { PushService } from 'src/app/services/push.service';

@Component({
  selector: 'app-drums',
  templateUrl: './drums.page.html',
  styleUrls: ['./drums.page.scss'],
})
export class DrumsPage implements OnInit {
  value = 0;
  drumdata:any;
  router:Router;
  public primaryColor: any;
  scene:any;
  constructor(private pushservice: PushService, private dataService: DataService, private http:HttpClient, router:Router,private modalController:ModalController, private popoverController: PopoverController){
    this.router=router;
    this.getData();
    this.primaryColor = localStorage.getItem('primary_color');
    var interval = setInterval(()=>{ 
     this.getData();
    
    }, 500);

  }

getData(){
     this.drumdata = this.pushservice.drumsdata;
     //console.log(this.drumdata);
}
getHeaderStyle() {
  return { 'background': this.primaryColor }
};
goToODP(event, drum) {
  console.log("GOTO ODP "+drum['ID_ODP']);
 this.router.navigate(['/odp', drum['ID_ODP']]);
 }


back() {
  //this.router.navigate(['menu/dashboard']);
}

trackByDrum(index,drum) { 
  return drum.ID; 
}
ngOnInit() {
  }


}
