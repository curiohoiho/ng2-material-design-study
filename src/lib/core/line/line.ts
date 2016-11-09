import {
  NgModule,
  Directive,
  Renderer,
  ElementRef,
  QueryList
} from '@angular/core';


/**
 * Shared Directive to count lines inside a text area, such as a list item.
 * Line elements can be extracted with a @ContentChildren(MdLine) query, then
 * counted by checking the query list's length
 */
@Directive({ selector: '[md-line]'})
export class MdLine { }

/**
 * Helper that takes a query list of lines and sets the correct class on the host.
 */
export class MdLineSetter
{
  constructor(
    private _lines: QueryList<MdLine>,
    private _renderer: Renderer,
    private _element: ElementRef)
  {
    this._setLineClass(this._lines.length);

    this._lines.changes.subscribe( () => {
      this._setLineClass(this._lines.length);
    });
  } // constructor()


  private _setLineClass(a_n_count: number): void 
  {
    this._resetClasses();
    if (a_n_count === 2 || a_n_count === 3)
    {
      this._setClass(`md-${a_n_count}-line`, true);
    }
    else if (a_n_count > 3)
    {
      this._setClass(`md-multi-line`, true);
    }

  } // _setLineClass()


  private _resetClasses(): void 
  {
    this._setClass('md-2-line', false);
    this._setClass('md-3-line', false);
    this._setClass('md-multi-line', false);
  } // _resetClasses()


  private _setClass(a_s_className: string, a_bool: boolean): void 
  {
    this._renderer.setElementClass(this._element.nativeElement, a_s_className, a_bool);
  }

} // class MdLineSetter