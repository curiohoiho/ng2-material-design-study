import { Component, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { InteractivityChecker } from './interactivity-checker';


/**
 * Directive for trapping focus within a region.
 * 
 * NOTE: This directive currently uses a very simple (naive) approach to focus trapping.
 * It assumes that the tab order is the same as DOM order, which is not necessarily true.
 * Things like tabIndex > 0, flex `order`, and shadow roots can cause the two to misalign.
 * This will be replaced with a more intelligent solution before the library is considered stable.
 * 
 * The HTMLElement.tabIndex property represents the tab order of the current element.
 * If both set to "0", they will be traversed in the order they appear.
 * 
 * If hit "tab" and reach the last div below, move back up to the first tabbable element.
 * If hit "shift-tag" and reach the first div below, move down to the last tabbable element.
 */
@Component({
  moduleId: module.id,
  selector: 'focus-trap',
  template: `
  <div tabindex="0" (focus)="focusLastTabbableElement()"></div>
  <div #trappedContent><ng-content></ng-content></div>
  <div tabindex="0" (focus)="focusFirstTabbableElement()"></div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class FocusTrap
{
  @ViewChild('trappedContent') trappedContent: ElementRef;

  constructor(private _checker: InteractivityChecker)
  { } // constructor()


  /**
   * Focuses the first tabbable element within the focus trap region 
   */
  focusFirstTabbableElement() 
  {
    let redirectToElement = this._getFirstTabbableElement(this.trappedContent.nativeElement);
    if (redirectToElement) // if not null 
    {
      redirectToElement.focus();
    }
  } // focusFirstTabbableElement()


  /**
   * Get the first tabbable element from a DOM subtree (inclusive)
   */
  private _getFirstTabbableElement(a_root: HTMLElement): HTMLElement
  {
    if (this._checker.isFocusable(a_root) && this._checker.isTabbable(a_root))
    {
      return a_root;
    }

    // iterate in DOM order.
    // go through each of the a_root's children and return the first one
    // that is tabbable.
    let n_childCount = a_root.children.length;
    for (let i = 0; i < n_childCount; i++)
    {
      let tabbableChild = this._getFirstTabbableElement(a_root.children[i] as HTMLElement);
      if (tabbableChild)
      {
        return tabbableChild;
      }
    } // for

    return null;

  } // _getFirstTabbableElement()


  /**
   * Focuses the last tabbable element within the focus trap region 
   */
  focusLastTabbableElement()
  {
    let redirectToElement = this._getLastTabbableElement(this.trappedContent.nativeElement);
    if (redirectToElement)
    {
      redirectToElement.focus();
    }

  } // focusLastTabbableElement()


  /**
   * Get the last tabbable element from a DOM subtree (inclusive).
   * First check if a_root isTabbable.
   * If not, move on to his children.
   */
  private _getLastTabbableElement(a_root: HTMLElement): HTMLElement
  {
    if (this._checker.isFocusable(a_root) && this._checker.isTabbable(a_root))
    {
      return a_root;
    }

    // iterate in reverse DOM order
    for (let i = a_root.children.length - 1; i >= 0; i--)
    {
      let tabbableChild = this._getLastTabbableElement(a_root.children[i] as HTMLElement);
      if (tabbableChild)
      {
        return tabbableChild;
      }
    } // for 

    return null;

  } // _getLastTabbableElement()


} // class FocusTrap