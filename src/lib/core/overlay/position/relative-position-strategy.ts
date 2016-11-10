import { IPositionStrategy } from './position-strategy';
import { ElementRef } from '@angular/core';

export class RelativePositionStrategy implements IPositionStrategy
{
  constructor( private f_relativeTo: ElementRef) { }

  apply(a_element: Element): Promise<void>
  {
    // not yet implemented
    return null;
  }


} // class RelativePositionStrategy