import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Platform, Events } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { environment } from 'src/environments/environment';
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {
  authenticationState = new BehaviorSubject(false);
  host:any;
 
  public storage: Storage;
  constructor(public events: Events, storage: Storage, private plt: Platform,private http:HttpClient) { 
    this.storage = storage;
    this.plt.ready().then(() => {
      this.checkToken();
    });
    this.host = environment.serverEndpoint;
  }
 
  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    })
  }
 
  login(id:string,password:string) {
    let route:string = this.host+'/login/'+id+'@'+password;
    this.storage.set(TOKEN_KEY, id+' '+password).then(() => {
      this.authenticationState.next(true);});
    
    console.log(route);
    this.http.get(route)
    .subscribe(data => {

     if (data!='0'){
      console.log("OK LOGGED");
       this.storage.set(TOKEN_KEY, id+' '+password).then(() => {
        this.authenticationState.next(true);});
        var res= true;

        this.events.publish('login: done', res);
      }
      else{
        console.log("KO NOT LOGGED WRONG DATA");
        var res= false;
        this.events.publish('login: done', res);}
     
    })
  }

    loginWithCode(code:string) {
      let route:string =this.host+'/logincode/'+code;
      console.log(route); 

      this.http.get(route).subscribe(data => {
    
       if (data!='0'){
          console.log("OK LOGGED");
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
