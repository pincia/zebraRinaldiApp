import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs', 
        component: TabsPage,
        children: [
            {
                path: 'products',
                //outlet: 'products',
                loadChildren: '../products/products.module#ProductsPageModule'
            },
            {
                path: 'controls',
               // outlet: 'controls',
                loadChildren: '../controls/controls.module#ControlsPageModule'
            },
           
        ]
    },
  
    {
        path: '',
        redirectTo: 'tabs/products'        
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
