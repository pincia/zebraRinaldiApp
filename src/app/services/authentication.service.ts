import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Platform, Events } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {
  authenticationState = new BehaviorSubject(false);
  
  public storage: Storage;
  constructor(public events: Events, storage: Storage, private plt: Platform,private http:HttpClient) { 
    this.storage = storage;
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }
 
  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    })
  }
 
  login(id:string,password:string) {
    let route:string = 'http://c7183545.ngrok.io/login/'+id+'@'+password;+
    console.log(route);
    this.http.get(route)
    .subscribe(data => {

     if (data!='0'){
       this.storage.set(TOKEN_KEY, id+' '+password).then(() => {
        this.authenticationState.next(true);});
        var res= true;
        this.events.publish('login: done', res);
      }
      else{
        var res= false;
        this.events.publish('login: done', res);}
     
    })
  }

    loginWithCode(code:string) {
      let route:string = 'http://c7183545.ngrok.io/logincode/'+code;
      console.log('MSG: LOGINWITHCODE FUNCTION '+route); 

      this.http.get(route).subscribe(data => {
    
       if (data!='0'){
           this.storage.set(TOKEN_KEY, code).then(() => {
          this.authenticationState.next(true);});
          var res= true;
          this.events.publish('login: done', res);
       }
       else{
        var res= false;
        this.events.publish('login: done', res);
       }
      })
    /*
    return this.storage.set(TOKEN_KEY, 'Bearer 1234567').then(() => {
      this.authenticationState.next(true); return this.storage.set(TOKEN_KEY, 'Bearer 1234567').then(() => {
      this.authenticationState.next(true);
    });*/
  }
 
  logout() {
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }
 
  isAuthenticated() {
    return this.authenticationState.value;
  }
}
