import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { debug } from 'util';
import { Storage } from '@ionic/storage';


const CHECK_INTERVAL = 1000 // in ms
const STORE_KEY = 'lastAction';

@Injectable()
export class AutoLogoutService {
     public interval: number; //MINUTES OF AUTOLOGOUT
     public getLastAction() {
     return parseInt(localStorage.getItem(STORE_KEY));
  }

  public setLastAction(lastAction: number) {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }

  constructor(storage: Storage, private router: Router) {
    localStorage.setItem(STORE_KEY, Date.now().toString());
    storage.get("auto_logout").then(val => {
      this.interval = parseInt(val);
      this.check();
      this.initListener();
      this.initInterval();

    })
  }

  initListener() {
    document.body.addEventListener('click', (event) => this.reset(event));
    document.body.addEventListener('mouseover', (event) => this.reset(event));
    document.body.addEventListener('mouseout', (event) => this.reset(event));
    document.body.addEventListener('keydown', (event) => this.reset(event));
    document.body.addEventListener('keyup', (event) => this.reset(event));
    document.body.addEventListener('keypress', (event) => this.reset(event));
  }

  reset(event) {
 
    this.setLastAction(Date.now());
  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }
  public setInterval(val) {
    this.interval = val;
  }

  check() {

    const now = Date.now();
    const timeleft = this.getLastAction() + this.interval * 60 * 1000;
    const diff = timeleft - now;
   // console.log("LOGOUT TRA " + diff/1000 +" sec")
    const isTimeout = diff < 0;

    if (isTimeout) {
      localStorage.clear();
      this.router.navigate(['/']);
    }
  }
}