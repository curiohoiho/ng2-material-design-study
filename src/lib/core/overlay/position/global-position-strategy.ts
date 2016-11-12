import { applyCssTransform } from '../../style/apply-transform';
import { IPositionStrategy } from './position-strategy';


/**
 * a strategy for positioning overlays.  using this strategy, an overlay is given an
 * explicit position relative to the browser's viewport.
 */
export class GlobalPositionStrategy implements IPositionStrategy
{
  private _s_cssPosition: string = 'absolute';
  private _s_top: string = '';
  private _s_bottom: string = '';
  private _s_left: string = '';
  private _s_right: string = '';

  /**
   * array of individual applications of translateX().
   * Currently only for centering.
   */
  private _ay_s_translateX: string[] = [];

  /**
   * array of individual applications of translateY().
   * Currently only for centering.
   */
  private _ay_s_translateY: string[] = [];

  /**
   * sets the element to use CSS position: fixed
   */
  fixed()
  {
    this._s_cssPosition = 'fixed';
    return this;
  }


  /**
   * sets the element to use css position: absolute.  this is the default.
   */
  absolute()
  {
    this._s_cssPosition = 'absolute';
    return this;
  }


  /**
   * sets the top positions of the overlay. 
   * clears any previously set vertical position.
   */
  top(a_s_value: string)
  {
    this._s_bottom = '';
    this._ay_s_translateY = [];
    this._s_top = a_s_value;
    return this;
  } // top()


  /**
   * set the left position of the overlay.
   * clears any previously set horizontal position.
   */
  left(a_s_value: string): GlobalPositionStrategy
  {
    this._s_right = '';
    this._ay_s_translateX = [];
    this._s_left = a_s_value;
    return this;
  } // left()


  /**
   * sets the bottom position of the overlay.
   * clears any previously set vertical position.
   */
  bottom(a_s_value: string): GlobalPositionStrategy
  {
    this._s_top = '';
    this._ay_s_translateY = [];
    this._s_bottom = a_s_value;
    return this;
  } // bottom()


  /**
   * set the right position of the overlay.
   * clears any previously set horizontal position.
   */
  right(a_s_value: string): GlobalPositionStrategy
  {
    this._s_left = '';
    this._ay_s_translateX = [];
    this._s_right = a_s_value;
    return this;
  } // right()


  /** 
   * centers the overlay horizontally with an optional offset.
   * clears any previously set horizontal position.
   */
  centerHorizontally(a_s_offset: string = '0px'): GlobalPositionStrategy 
  {
    this._s_left = '50%';
    this._s_right = '';
    this._ay_s_translateX = ['-50%', a_s_offset];
    return this;
  } // centerHorizontally()


  /**
   * centers the overlay vertically with an optional offset.
   * clears any previously set vertical position.
   */
  centerVertically(a_s_offset: string = '0px'): GlobalPositionStrategy
  {
    this._s_top = '50%';
    this._s_bottom = '';
    this._ay_s_translateY = ['-50%', a_s_offset];
    return this;
  } // centerVertically()


  /** 
   * apply the position to the element.
   * @todo: internal 
   */
  apply(a_element: HTMLElement): Promise<void> 
  {
    a_element.style.position = this._s_cssPosition; // fixed or absolute
    a_element.style.top = this._s_top;
    a_element.style.left = this._s_left;
    a_element.style.bottom = this._s_bottom;
    a_element.style.right = this._s_right;

    // @todo: we don't want to always overwrite the transform property here,
    // because it will need to be used for animation
    let translateX: string = this._reduceTranslateValues('translateX', this._ay_s_translateX);
    let translateY: string = this._reduceTranslateValues('translateY', this._ay_s_translateY);

    applyCssTransform(a_element, `${translateX} ${translateY}`);

    return Promise.resolve(null);



  } // apply()


  /**
   * reduce a list of translate values to a string the can be used
   * in the transform property.
   */
  private _reduceTranslateValues(a_s_translateFn: string, a_ay_s_values: string[]): string 
  {
    return a_ay_s_values.map( t => `${a_s_translateFn}(${t})`).join(' ');

  } // _reduceTranslateValues()





} // class GlobalPositionStrategy
