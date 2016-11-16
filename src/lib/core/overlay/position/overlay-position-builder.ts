import { ViewportRuler } from './viewport-ruler';
import { ConnectedPositionStrategy } from './connected-position-strategy';
import { ElementRef, Injectable } from '@angular/core';
import { GlobalPositionStrategy } from './global-position-strategy';
import { IOverlayConnectionPosition, IOriginConnectionPosition } from './connected-position';

/**
 * builder for overlay position strategy.
 */
@Injectable()
export class OverlayPositionBuilder
{
  constructor(private f_viewportRuler: ViewportRuler) { }

  /** Creates a global position strategy. */
  global()
  {
    return new GlobalPositionStrategy();
  }

  /**
   * creates a relative position strategy.
   */
  connectedTo(
    a_elementRef: ElementRef,
    a_originPos: IOriginConnectionPosition,
    a_overlayPos: IOverlayConnectionPosition)
  {
    return new ConnectedPositionStrategy(a_elementRef, a_originPos, a_overlayPos, this.f_viewportRuler);
  } // connectedTo()

} // class OverlayPositionBuilder
