import { Component, OnInit } from '@angular/core';
import { ProductsPage } from '../products/products.page';
import { ControlsPage } from '../controls/controls.page';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  
  productsPage = ProductsPage;
  controlsPage = ControlsPage;
  constructor() { }

  ngOnInit() {
  }

}
