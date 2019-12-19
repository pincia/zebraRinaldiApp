import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs';
import {Platform, Events, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { tap } from  'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
const TOKEN_KEY = 'authtoken';
const USER_KEY = 'userdata';

@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {
  authenticationState = new BehaviorSubject(false);
  public host:any;
  isLoggedIn:boolean;
  token:any;
  router:Router;
  navCtrl:NavController;
  impianti:any;
  codice_impianto:string;
appdata:any;
  constructor(navCtrl:NavController, router:Router, public events: Events, private storage: Storage, private plt: Platform,private http:HttpClient) { 
  this.router=router;
 this.impianti = environment.impianti;
  this.navCtrl=navCtrl;
    console.log("AUTSERVICE STARTED");
    this.plt.ready().then(() => {
      this.checkToken();
    });
    this.storage.get("codice_impianto").then(val=>{
      if(!val){
        this.codice_impianto="qwertyu"
        console.log("CODICE IMPIANTO SETTATO A qwertyu")
      }
      else{
        this.codice_impianto=val;
      }
    }
      );

    this.storage.get("api_host").then(val=>{
      if(!val){
      console.log("API HOST NON TROVATA RICERCA IN CORSO...");
      this.impianti.forEach(impianto=>{
        if(impianto.codice_impianto==this.codice_impianto){
          this.storage.set("api_host",impianto.api_host);
          console.log("API HOST SETTATA A "+this.host);
          this.host = impianto.api_host;
          this.storage.set("socket_host",impianto.socket_host);
          this.storage.set("codice_registrazione",impianto.codice_registrazione);
        }
      })
    }else{
      this.host=val;
    }
    })
   

    this.appdata = new Storage({
      name: '__my_custom_db',
      storeName: '_appdata',
      driverOrder: ['sqlite', 'localstorage' ]
    });
   
  }
 
  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    })
  }

  login(id:string,password:string):Observable<AuthResponse> {
    let url:string = "http://"+this.host+'/api/auth/login';
    console.log(url)
    let user = {utente: id, password: password};
    return  this.http.post(url,user).pipe(
      tap((res:  AuthResponse) => {
        console.log(res);
        this.token = res.access_token;
         this.storage.set(TOKEN_KEY, this.token).then(
          () => {
            console.log(' TOKEN_KEY Token Stored');
          },
          error => console.error('Error storing TOKEN_KEY item', error)
        );
         this.storage.set(USER_KEY, res.user).then(
          () => {
            console.log(' USER_KEY Token Stored');
          },
          error => console.error('Error storing USER_KEY item', error)
        );
        this.isLoggedIn = true;
        this.authenticationState.next(true);
        this.navCtrl.navigateRoot('/members/dashboard');
      },
          err => {err=err
            this.isLoggedIn = false;
           console.log(err);
           this.authenticationState.next(false);}
 
      ));
  }
 
    loginWithCode(code:string) {
      let route:string ="http://"+this.host+'/logincode/'+code;
 
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
 
  logout(){ 
    this.storage.remove(USER_KEY);
    this.navCtrl.navigateRoot('/login');
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
    
  }
 
  isAuthenticated() {
    return this.authenticationState.value;
  }
}
export interface AuthResponse {
  user: {
    id_utente: number,
    utente: string,
    nome: string,
    cognome: string,
    livello: number,
    id_gruppo: number,
      email: string,
      access_token: string,
      expires_in: number,
      email_verified_at: string,
      code: string,
      telefono: string,
      mansione: string,
      created_at: string,
      updated_at: string,
  }
  access_token:string,
  token_type:string,
  expires_at:string
}