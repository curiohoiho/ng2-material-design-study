import { Injectable } from '@angular/core';

/**
 * Utility for checking the interactivity of an element, such as whether is is focusable or
 * tabbable.
 *
 * NOTE: Currently does not capture any special element behaviors, browser quirks, or edge cases.
 * This is a basic/naive starting point onto which further behavior will be added.
 *
 * This class uses instance methods instead of static functions so that alternate implementations
 * can be injected.
 *
 * TODO(jelbourn): explore using ally.js directly for its significantly more robust
 * checks (need to evaluate payload size, performance, and compatibility with tree-shaking).
 */
@Injectable()
export class InteractivityChecker 
{
  /**
   * Gets whether an element is disabled.
   * a_element.hasAttribute('disabled')
   */
  isDisabled(a_element: HTMLElement): boolean
  {
    // This does not capture some cases, such as a non-form control with
    // a disabled attribute, or a form control inside a disabled form, 
    // but should capture the most common cases.
    return a_element.hasAttribute('disabled');
  }


  /**
   * Gets whether an element is visible for the purpose of interactivity.
   * 
   * This will capture states like `display: none` and `visibility: hidden`, 
   * but not things like being clipped by an `overflow: hidden` parent or 
   * being outside the viewport.
   * 
   * Check offsetHeight, offsetWidth, .getClientRects().length, 
   * getComputedStyle(a_element).getPropertyValue('visibility')
   */
  isVisible(a_element: HTMLElement): boolean
  {
    // there are additional special cases that this does not capture,
    // but this will work for the most common cases.

    // use logic from jQuery to check for `display: none`.
    // See https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js#L12
    // this also checks for a child of an element that has `display: none`.  See the test.
    // if any of these 3 are false, return false:
    if (!(a_element.offsetWidth || a_element.offsetHeight || a_element.getClientRects().length))
    {
      return false;
    }

    // check for css `visibility` property.
    return getComputedStyle(a_element).getPropertyValue('visibility') == 'visible';

  } // isVisible()


  /**
   * Gets whether an element can be reached via Tab key.
   * Assumes that the element has already been checked with isFocusable.
   * Simple logic: is the element's tabIndex zero or more.
   */
  isTabbable(a_element: HTMLElement)
  {
    // Again, naive approach that does not capture many special cases and browser quirks.
    return a_element.tabIndex >= 0;

  } // isTabbable()


  /**
   * Gets whether an element can be focused by the user:
   * Not disabled, potentially focusable, is visible.
   */
  isFocusable(a_element: HTMLElement): boolean
  {
    // performs checks in order of left to most expensive.
    // again, a naive approach that does not capture many edge cases and browser quirks.
    return isPotentiallyFocusable(a_element) &&
           !this.isDisabled(a_element) &&
           this.isVisible(a_element); 

  } // isFocusable()

} // class InteractivityChecker


/**
 * Gets whether an element is a native form element.
 * This includes: input, select, button, textarea 
 */
function isNativeFormElement(a_element: Node)
{
  let nodeName = a_element.nodeName.toLowerCase();
  return nodeName === 'input' ||
         nodeName === 'select' ||
         nodeName === 'button' ||
         nodeName === 'textarea'; 

} // isNativeFormElement()


/**
 * Gets whether a_element.type = "hidden" - is an <input type="hidden">.
 */
function isHiddenInput(a_element: HTMLElement): boolean
{
  return isInputElement(a_element) && a_element.type == 'hidden'; // HtmlInputElement

} // isHiddenInput()


/**
 * Gets whether an element is an anchor that has an href attribute.
 * USes a_element.hasAttribute()
 */
function isAnchorWithHref(a_element: HTMLElement): boolean
{
  return isAnchorElement(a_element) && a_element.hasAttribute('href');
}


/**
 * Gets whether an element is an input element.
 * Checks a_element.nodeName == "input"
 */
function isInputElement(a_element: HTMLElement): a_element is HTMLInputElement
{
  return a_element.nodeName == 'input';
}


/**
 * Gets whether an element is an anchor element.
 * Checks a_element.nodeName.toLowerCase('a')
 */
function isAnchorElement(a_element: HTMLElement): boolean 
{
  return a_element.nodeName.toLowerCase() == 'a';
}


/**
 * Gets whether an element has a valid tabIndex.
 * a_element.getAttribute('tabindex')
 */
function hasValidTabIndex(a_element: HTMLElement): boolean
{
  if (!a_element.hasAttribute('tabindex') || a_element.tabIndex === undefined)
  {
    return false;
  }

  let tabIndex: string = a_element.getAttribute('tabindex');

  // IE11 parses tabindex="" as the value "-32768"
  if (tabIndex == '-32768') {
    return false;
  }

  return !!(tabIndex && !isNaN(parseInt(tabIndex, 10)));

} // hasValidTabIndex()


/**
 * Gets whether an element is potentially focusable without taking current visible/disabled state
 * into account.
 */
function isPotentiallyFocusable(a_element: HTMLElement): boolean
{
  // inputs are potentially focusable *unless* they're type="hidden".
  if (isHiddenInput(a_element))
  {
    return false;
  }

  return isNativeFormElement(a_element) ||
         isAnchorWithHref(a_element) ||
         a_element.hasAttribute('contenteditable') ||
         hasValidTabIndex(a_element);

} // isPotentiallyFocusable()