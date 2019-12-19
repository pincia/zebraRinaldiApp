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
      title: 'Dashboard',
      url: '/members/dashboard',
      icon: 'home'
    },
    {
      title: 'Prodotti',
      url: '/members/recipe',
      icon: 'flask'
    },
    {
      title: 'Depositi',
      url: '/storage',
      icon: 'logo-buffer'
    }
  ];
 
 
  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });
    this.primaryColor='#0163fc';
    this.secondryColor = '#44bbec';


    
  }

  getstyle() {
    
    return {
      background:"linear-gradient(var(--ion-color-primary),var(--ion-color-secondary))"
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
