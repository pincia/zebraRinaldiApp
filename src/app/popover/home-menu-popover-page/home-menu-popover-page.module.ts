import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomeMenuPopoverPagePage } from './home-menu-popover-page.page';

const routes: Routes = [
  {
    path: '',
    component: HomeMenuPopoverPagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeMenuPopoverPagePage]
})
export class HomeMenuPopoverPagePageModule {}
