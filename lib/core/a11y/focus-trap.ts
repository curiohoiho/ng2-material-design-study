import { 
  Component, 
  ViewEncapsulation, 
  ViewChild, 
  ElementRef,
  Input,
  NgZone } from '@angular/core';
import { InteractivityChecker } from './interactivity-checker';
import { coerceBooleanProperty } from '../coercion/boolean-property';


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
  templateUrl: 'focus-trap.html',
  encapsulation: ViewEncapsulation.None
})
export class FocusTrap
{
  @ViewChild('trappedContent') trappedContent: ElementRef;

  /** Whether the focus trap is active. */
  @Input()
  get disabled(): boolean { return this.f_b_disabled; }
  set disabled(val: boolean) { this.f_b_disabled  = coerceBooleanProperty(val); }
  private f_b_disabled: boolean = false;
  
  constructor(
    private f_checker: InteractivityChecker,
    private f_ngZone: NgZone
  ) { } // constructor()


  /** 
   * Waits for the microtask queue to empty, then focuses the first 
   * tabbable element within the focus trap region.
   */
  focusFirstTabbableElementWhenReady()
  {
    this.f_ngZone.onMicrotaskEmpty.first().subscribe( () => {
      this.focusFirstTabbableElement();
    });

  } // focusFirstTabbableElementWhenReady()


  /** 
   * Waits for the microtask queue to empty, then focuses the last 
   * tabbable element within the focus trap region.
   */
  focusLastTabbableElementWhenReady()
  {
    this.f_ngZone.onMicrotaskEmpty.first().subscribe( () => {
      this.focusLastTabbableElement();
    });

  } // focusLastTabbableElementWhenReady()


  /**
   * Focuses the first tabbable element within the focus trap region 
   */
  focusFirstTabbableElement() 
  {
    // let redirectToElement = this._getFirstTabbableElement(this.trappedContent.nativeElement);
    let rootElement: HTMLElement = this.trappedContent.nativeElement;
    let redirectToElement = 
      rootElement.querySelector('[md-focus-start]') as HTMLElement ||
      this._getFirstTabbableElement(rootElement);

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
    if (this.f_checker.isFocusable(a_root) && this.f_checker.isTabbable(a_root))
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
    // let redirectToElement = this._getLastTabbableElement(this.trappedContent.nativeElement);
    let rootElement: HTMLElement = this.trappedContent.nativeElement;
    let focusTargets = rootElement.querySelectorAll('[md-focus-end]');
    let redirectToElement: HTMLElement = null; 

    if (focusTargets.length)
    {
      redirectToElement = focusTargets[focusTargets.length - 1] as HTMLElement;
    }
    else 
    {
      redirectToElement = this._getLastTabbableElement(rootElement);
    }

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
    if (this.f_checker.isFocusable(a_root) && this.f_checker.isTabbable(a_root))
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