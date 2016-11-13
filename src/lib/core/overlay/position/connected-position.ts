/**
 * horizontal dimension of a connection point on the perimeter of the origin
 * or overlay element.
 */
export type HorizontalConnectionPos = 'start' | 'center' | 'end';

/** 
 * vertical dimension of a connection point on the perimeter of the origin 
 * or overlay element.
 */
export type VerticalConnectionPos = 'top' | 'center' | 'bottom';


/**
 * a connection point on the origin element.
 */
export interface IOriginConnectionPosition
{
  originX: HorizontalConnectionPos;
  originY: VerticalConnectionPos;
}


/**
 * a connection point on the overlay element.
 */
export interface IOverlayConnectionPosition
{
  overlayX: HorizontalConnectionPos;
  overlayY: VerticalConnectionPos;
}


/**
 * the points of the origin element and the overlay element to connect.
 */
export class ConnectionPositionPair
{
  originX: HorizontalConnectionPos;
  originY: VerticalConnectionPos;
  overlayX: HorizontalConnectionPos;
  overlayY: VerticalConnectionPos;


  constructor(a_origin: IOriginConnectionPosition, a_overlay: IOverlayConnectionPosition)
  {
    this.originX = a_origin.originX;
    this.originY = a_origin.originY;
    this.overlayX = a_overlay.overlayX;
    this.overlayY = a_overlay.overlayY;
  } // constructor

} // class ConnectionPositionPair
