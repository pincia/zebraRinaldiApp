import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  selectedPath = '';
 
  pages = [
    {
      title: 'Home',
      url: '/menu/dashboard'
    },
    {
      title: 'Profilo',
      url: '/menu/profile'
    }
 
  ];
 
  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });
  }
 
  ngOnInit() {
 
  }

}
