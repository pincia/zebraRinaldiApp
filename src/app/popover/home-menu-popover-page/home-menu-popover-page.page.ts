import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

import { NavParams, PopoverController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home-menu-popover-page',
  templateUrl: './home-menu-popover-page.page.html',
  styleUrls: ['./home-menu-popover-page.page.scss'],
})
export class HomeMenuPopoverPagePage implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private popoverController: PopoverController,
    public navParams: NavParams,
    public navCtrl:NavController,
  ) { }
  logout() {
    this.authService.logout();
    var action = "logout";
    this.popoverController.dismiss(action);
  }

openSettings(){
  var action = "settings";
  this.popoverController.dismiss(action);
  this.navCtrl.navigateForward('\settings');
}
openMyProfile(){
  var action = "profile";
  this.popoverController.dismiss(action);
  this.navCtrl.navigateForward('\profile');
}
  ngOnInit() {
  }

}
