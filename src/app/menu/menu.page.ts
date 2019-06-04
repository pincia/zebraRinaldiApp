import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  bgColor = '3A57C4';
  selectedPage;
  selectedPath = '';
  primaryColor: any;
  secondryColor: any;
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

  getstyle() {
    this.primaryColor = localStorage.getItem("primary_color");
    this.secondryColor = localStorage.getItem("secondry_color");
    return {
      background:
        "linear-gradient(" + this.primaryColor + "," + this.secondryColor + ")"
    };
  };
  openPage(page) {
    this.selectedPage = "";
    this.pages.forEach(element => {
      if (element.title == page) {
        if (page != "Home") {
         // this.nav.push(element.component);
        } else {
         // this.nav.setRoot(element.component);
        }
      }
    });
  };
  ngOnInit() {
 
  }

}
