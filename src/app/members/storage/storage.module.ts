import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StoragePage } from './storage.page';
import { CaricoModalPage } from 'src/app/modals/carico-modal/carico-modal.page';

const routes: Routes = [
  {
    path: '',
    component: StoragePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StoragePage, CaricoModalPage],

  entryComponents:[CaricoModalPage]
})
export class StoragePageModule {
  
}
