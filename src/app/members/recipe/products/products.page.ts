import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { ModalPage } from '../../../modals/modal/modal.page';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  value = 0;
  products:any;
  router:Router;
  interval:any;
  constructor(private dataService: DataService, private http:HttpClient, router:Router,private modalController:ModalController, private popoverController: PopoverController){
    this.router=router;
    this.getData();
    this.interval = setInterval(()=>{ 
     this.getData();
    }, 5000);
  }

getData(){
  this.products = this.dataService.productsdata;
}
ngOnDestroy(): void {
clearInterval(this.interval);
}

buttonClick(products,index){
  this.openModal();
}

back() {
  this.router.navigate(['menu/dashboard']);
}
goToProduct(event, product) {
  // console.log(tank)
 this.router.navigate(['/members/checkproduct',product['NOME_BOTTALE'], product['PASSO'],product['ID_ODP']])
 }
async openModal(){
  console.log("Opne modal");
  const modal = await this.modalController.create({
    component: ModalPage
 
    
  });
  modal.onDidDismiss().then((data) => {
    if (data !== null) {
      console.log('The result:', data);
    }
 });
  modal.present();
}
ngOnInit() {
  console.log("URL    "+this.router.url);
  }
  trackByProduct(index,product) { 
    return product.ID_ODP_FASI; 
  }
}
 
