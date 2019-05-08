import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AlarmsPage } from './alarms.page';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';




const routes: Routes = [
  {
    path: '',
    component: AlarmsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ AlarmsPage],
  providers: [
    TextToSpeech
  ]
})
export class AlarmsPageModule {}
