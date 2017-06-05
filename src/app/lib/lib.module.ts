import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MdButton } from './button/button';

@NgModule({
  imports: [
    RouterModule,
    CommonModule
  ],
  declarations: [
    MdButton
  ],
  exports: [
    MdButton
  ]
})
export class LibModule
{

}
