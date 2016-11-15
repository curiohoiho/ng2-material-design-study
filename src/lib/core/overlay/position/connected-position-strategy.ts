/**
 * 1.  given an origin element and an overlay.
 * 2.  apply() updates the position of the overlay element.
 * 2a. get the ClientRects for the origin and overlay (sizes)
 * 2b. find the preferred position for the overlay.
 * 2ba. get the (x, y) point of connection at the origin,
 *      f_getOriginConnectionPoint().
 * 2bb. use this originPoint to get the overlayPoint,
 *      f_getOverlayPoint().
 * 2bc. if it fits in the viewport, f_willOverlayFitWininViewport(),
 *      put it there using the css transform.      
 */

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
    
    // each `yyyPos` is made up of a HorizontalConnectionPos 
    // and a VerticalConnectionPos,
    // each of those being strings.
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

      // if the overlay in the calculated position fits on-screen, put it there and we're done 
      if (this.f_willOverlayFitWininViewport(overlayPoint, overlayRect, viewportRect))
      {
        this.f_setElementPosition(a_element_overlay, overlayPoint);
        return Promise.resolve(null);
      }

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
   * gets the (x, y) coordinate of the top-left corner of the overlay given a given position and 
   * origin point to which the overlay should be connected.
   */
  private f_getOverlayPoint(
    a_originPoint: Point,
    a_overlayRect: ClientRect,
    a_pos: ConnectionPositionPair): Point 
  {
    // calculate the (overlayStartX, overlayStartY), the start of the potential
    // overlay position relative to the origin point.
    let overlayStartX: number;
    if (a_pos.overlayX == 'center')
    {
      overlayStartX = -a_overlayRect.width / 2;
    }
    else if (a_pos.overlayX === 'start')
    {
      overlayStartX = this.f_isRtl ? -a_overlayRect.width : 0;
    }
    else // end 
    {
      overlayStartX = this.f_isRtl ? 0 : -a_overlayRect.width;
    }

    let overlayStartY: number;
    if (a_pos.overlayY == 'center')
    {
      overlayStartY = -a_overlayRect.height / 2;
    }
    else
    {
      overlayStartY = a_pos.overlayY == 'top' ? 0 : -a_overlayRect.height;
    }

    return {
      x: a_originPoint.x + overlayStartX + this.f_n_offsetX,
      y: a_originPoint.y + overlayStartY + this.f_n_offsetY
    };

  } // f_getOverlayPoint()


  /**
   * sets the layout direction so the overlay's position can be adjusted to match
   */
  withDirection(a_dir: 'lrt' | 'rtl'): this 
  {
    this.f_s_dir = a_dir;
    return this;
  }


  /**
   * sets an offset for the overlay's connection point on the x-axis.
   */
  withOffsetX(a_n_offset: number): this
  {
    this.f_n_offsetX = a_n_offset;
    return this;
  }


  /**
   * sets an offset for the overlay's connection point on the y-axis 
   */
  withOffsetY(a_n_offset: number): this 
  {
    this.f_n_offsetY = a_n_offset;
    return this;
  }


  /**
   * gets the horizontal (x) "start" dimension based on whether
   * the overlay is in an RTL context.
   */
  private f_getStartX(a_rect: ClientRect): number 
  {
    return this.f_isRtl ? a_rect.right : a_rect.left;
  }

  /**
   * Gets the horizontal (x) "end" dimension based on whether 
   * the overlay is in an RTL context.
   * @param rect
   */
  private f_getEndX(a_rect: ClientRect): number
  {
    return this.f_isRtl ? a_rect.left : a_rect.right;
  }


  private f_willOverlayFitWininViewport(
    a_overlayPoint: Point,
    a_overlayRect: ClientRect,
    a_viewportRect: ClientRect): boolean 
  {
    // @todo: probably also want some space between overlay edge and viewport edge.
    return (
      a_overlayPoint.x                        >= a_viewportRect.left &&
      a_overlayPoint.x + a_overlayRect.width  <= a_viewportRect.right &&
      a_overlayPoint.y                        >= a_viewportRect.top &&
      a_overlayPoint.y + a_overlayRect.height <= a_viewportRect.bottom
    );

  } // f_willOverlayFitWininViewport()


  /**
   * physically positions the overlay element to the given coordinate.
   */
  private f_setElementPosition(
    a_element_overlay: HTMLElement,
    a_overlayPoint: Point): void 
  {
    let scrollPos = this.f_viewportRuler.getViewportScrollPosition();

    let x = a_overlayPoint.x + scrollPos.left;
    let y = a_overlayPoint.y + scrollPos.top;

    // @todo: we don't want to always overwrite the transform property here,
    // because it will need to be used for animations.
    applyCssTransform(a_element_overlay, `translate(${x}px) translateY(${y}px)`);

  } // f_setElementPosition()

} // class ConnectedPositionStrategy


/**
 * A simple (x, y) coordinate.
 */
type Point = { x: number, y: number};