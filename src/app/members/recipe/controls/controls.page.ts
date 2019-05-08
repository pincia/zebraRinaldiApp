import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.page.html',
  styleUrls: ['./controls.page.scss'],
})
export class ControlsPage implements OnInit {

  controls:any;
  router:Router;
  constructor(private dataService: DataService ,private http:HttpClient,router:Router){
    this.getData();
    this.router = router;
    var interval = setInterval(()=>{ 
      this.getData();
     
     }, 5000);
  }

  getData(){
this.controls=this.dataService.controlsdata;
  
  }
  goToControlList(event, control) {
    // console.log(tank)
   this.router.navigate(['/members/controlslist', control['id_odp_fasi'], control['ID_AZIONE_GROUP']])
   }

  ngOnInit() {
  }
  back() {
   this.router.navigate(['menu/dashboard']);
  }
  trackByControl(index,control) { 
    return control.id_odp_fasi; 
  }
}
