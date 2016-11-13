import { IPositionStrategy } from './position-strategy';
import { ElementRef } from '@angular/core';
import { ViewportRuler } from './viewport-ruler';
import { applyCssTransform } from '../../style/apply-transform';
import {
  ConnectionPositionPair,
  IOriginConnectionPosition,
  IOverlayConnectionPosition
} from './connected-position';


/**
 * A strategy for positioning overlays.
 * Using this strategy, an overlay is given an
 * implicit position relative to some origin element.  
 * The relative position is defined in terms of 
 * a point on the origin element that is connected to a point
 * on the overlay element.  For example,
 * a basic dropdown is connecting the bottom-left corner of the origin 
 * to the top-left corner of the overlay. 
 */
export class ConnectedPositionStrategy implements IPositionStrategy
{
  private f_s_dir: string = 'ltr';

  /**
   * the offset in pixels for the overlay connection point on the x-axis.
   */
  private f_n_offsetX: number = 0;

  /**
   * the offset in pixels for the overlay connection point on the y-axis 
   */
  private f_n_offsetY: number = 0;


  /**
   * whether we're dealing with a RTL context
   */
  get f_isRtl() : boolean 
  {
    return this.f_s_dir === 'rtl';
  }

  /**
   * ordered list of preferred positions, from most to least desirable.
   * basically, an array of "a pair of points".
   */
  f_ay_preferredPositons: ConnectionPositionPair[] = [];

  /**
   * the origin element against which the overlay will be positioned.
   */
  private f_origin: HTMLElement;

  constructor(
    private f_connectedTo: ElementRef,
    private f_originPos: IOriginConnectionPosition,
    private f_overlayPos: IOverlayConnectionPosition,
    private f_viewportRuler: ViewportRuler)
  {
    this.f_origin = this.f_connectedTo.nativeElement;
    this.withFallbackPosition(f_originPos, f_overlayPos);

  } // constructor()


  withFallbackPosition(
    a_originPos: IOriginConnectionPosition,
    a_overlayPos: IOverlayConnectionPosition
  ): this 
  {
    this.f_ay_preferredPositons.push(new ConnectionPositionPair(a_originPos, a_overlayPos));
    return this;
  } // withFallbackPosition()


  get positions(): ConnectionPositionPair[]
  {
    return this.f_ay_preferredPositons;
  }


  /**
   * updates the position of the overlay element, using whichever 
   * preferred position relative to the origin fits on-screen.
   * @todo: internal
   * Need 3 ClientRects: origin, overlay, viewport.
   * Take first preferred position that fits on screen.
   * If none fit, default to the first preferred position.
   */
  apply(a_element_overlay: HTMLElement): Promise<void>
  {
    /**
     * we need the bounding rects for the origin and the overlay 
     * to determine how to positon the overlay relative to the origin 
     */
    const originRect = this.f_origin.getBoundingClientRect();
    const overlayRect = a_element_overlay.getBoundingClientRect()

    const viewportRect = this.f_viewportRuler.getViewportRect();
    let firstOverlayPoint: Point = null;

    // we want to place the overlay in the first of the preferred positions such that the 
    // overlay fits on screen.
    for (let pos of this.f_ay_preferredPositons)
    {
      // get the (x, y) point of connection on the origin, and then use that to get the 
      // (top, left) coordinate for the overlay at `pos`.
      let originPoint = this.f_getOriginConnectionPoint(originRect, pos);
      let overlayPoint = this.f_getOverlayPoint(originPoint, overlayRect, pos);
      firstOverlayPoint = firstOverlayPoint || overlayPoint;

    } // for


  } // apply() - updates the position of the overlay


  /**
   * gets the (x, y) coordinate of a connection point on the origin 
   * based on a relative positon.
   */
  private f_getOriginConnectionPoint(
    a_originRect: ClientRect,
    a_pos: ConnectionPositionPair): Point 
  {
    // get the origin's width start and end points, to see how it fits into the viewport 
    const originStartX = this.f_getStartX(a_originRect);
    const originEndX = this.f_getEndX(a_originRect);

    let x: number;
    if (a_pos.originX == 'center')
    {
      x = originStartX + (a_originRect.width / 2);
    }
    else 
    {
      x = a_pos.originX == 'start' ? originStartX : originEndX;
    }

    let y: number;
    if (a_pos.originY == 'center')
    {
      y = a_originRect.top + (a_originRect.height / 2);
    }
    else
    {
      y = a_pos.originY == 'top' ? a_originRect.top : a_originRect.bottom;
    }

    return { x, y};

  } // f_getOriginConnectionPoint()


  /**
   * gets the horizontal (x) "start" dimension based on whether
   * the overlay is in an RTL context.
   */
  private f_getStartX(a_rect: ClientRect): number 
  {
    return this.f_isRtl ? a_rect.right : a_rect.left;
  }

  /**
   * Gets the horizontal (x) "end" dimension based on whether the overlay is in an RTL context.
   * @param rect
   */
  private f_getEndX(a_rect: ClientRect): number
  {
    return this.f_isRtl ? a_rect.left : a_rect.right;
  }


} // class ConnectedPositionStrategy


/**
 * A simple (x, y) coordinate.
 */
type Point = { x: number, y: number};