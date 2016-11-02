import { Component, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { InteractivityChecker } from './interactivity-checker';


/**
 * Directive for trapping focus within a region.
 * 
 * NOTE: This directive currently uses a very simple (naive) approach to focus trapping.
 * It assumes that the tab order is the same as DOM order, which is not necessarily true.
 * Things like tabIndex > 0, flex `order`, and shadow roots can cause the two to misalign.
 * This will be replaced with a more intelligent solution before the library is considered stable.
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

} // class FocusTrap