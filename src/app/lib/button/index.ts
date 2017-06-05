import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
// import {CompatibilityModule, MdRippleModule, StyleModule} from '../core';
import {

  MdButton
} from './button';


export * from './button';


@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    MdButton

  ],
  declarations: [
    MdButton

  ],
})
export class MdButtonModule {
  /** @deprecated */
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MdButtonModule,
      providers: []
    };
  }
}
