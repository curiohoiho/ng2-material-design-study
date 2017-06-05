import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ButtonPage } from './button-page/button.page';


/**
 *  this module holds all the Pages created under this directory,
 *  and exports them out.
 */

@NgModule({
  imports: [
    RouterModule,
    CommonModule
  ],
  declarations: [
    ButtonPage
  ],
  exports: [
    ButtonPage
  ]
})
export class PagesModule
{

}