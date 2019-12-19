
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule ,FormControl} from '@angular/forms';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';


import { Http } from '@angular/http';
import { Route, Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';
@Component({
  selector: 'app-registartion',
  templateUrl: './registartion.page.html',
  styleUrls: ['./registartion.page.scss'],
})
export class RegistartionPage implements OnInit {
  primaryColor='#44bbec';
  secondryColor = '#0163fc';
  impianti = environment.impianti;
  public loginForm:FormGroup;
  host:any;
  user:user;
  public displaySpinner:any;
  constructor(public router:Router , public toastController: ToastController,private storage: Storage,public http:Http , private fb: FormBuilder) { 
   
    this.displaySpinner="none";
    this.user={nome:"",cognome:"",utente:"",email:"",password:"",codice_impianto:"",codice_registrazione:""};
    this.loginForm = fb.group({
      nome: ["", [Validators.required,]],
      cognome: ["", [Validators.required,]],
      utente: ["", [Validators.required,]],
      password: ["", [Validators.required,]],
      confirm: ["", [Validators.required,]],
      email: ["", [Validators.required,]],
      codice_impianto: ["", [Validators.required,]],
      codice_registrazione: ["", [Validators.required,]]
    });
  }

  ngOnInit() {
  }
  register(){
    this.displaySpinner="block";
  
    if (this.verificaCodici(this.user.codice_impianto,this.user.codice_registrazione)) {
      this.http.post("http://"+this.host+"/api/auth/register", this.user)
          .subscribe(data => {
            this.displaySpinner="none";
           if (data.status=201){
            
            this.presentToast("UTENTE CREATO");
            this.storage.set("codice_impianto",this.user.codice_impianto);
            this.impianti.forEach(impianto=>{
              if(impianto.codice_impianto==this.user.codice_impianto){
                this.storage.set("api_host",impianto.api_host);
                this.storage.set("socket_host",impianto.socket_host);
                this.storage.set("codice_registrazione",impianto.codice_registrazione);
              }
            })
            this.loginForm.reset();
             this.router.navigate(['/']);

           }
            
           }, error => {
           this.displaySpinner="none";
           this.presentToast("UTENTE NON CREATO");
           console.log(error);
           
          });
    }
    else{
      this.displaySpinner="none";
    } 
  }


  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


  verificaCodici(ci:string, cr:string){
    let trovato_ci =false;
    let trovato_cr =false;
  this.impianti.forEach(impianto=>{
    if(impianto.codice_impianto==ci){
      trovato_ci=true;
    if (impianto.codice_registrazione==cr){
      trovato_cr=true;
  
      this.host=impianto.api_host;
    }
  }
  })

  if (!trovato_ci){
    this.presentToast("CODICE IMPIANTO ERRATO")
  }
  if (trovato_ci&&!trovato_cr){
    this.presentToast("CODICE REGISTRAZIONE ERRATO")
  }
  if(trovato_ci&&trovato_cr) return true;
  else return false;
}
}

interface user{
  nome:string,
  cognome:string,
  utente: string,
  email: string,
  password: string,
  codice_impianto:string,
  codice_registrazione:string
}
