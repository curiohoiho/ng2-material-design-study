import { Injectable } from '@angular/core';


/**
 * Simple utility for getting the bounds of the browser viewport.
 * @todo: internal.
 */
@Injectable()
export class ViewportRuler
{
  // @todo: cache the document's bounding rect and only update it when the window
  // is resixed (debounced).

  /** Gets a ClientRect for the viewport's bounds. */
  getViewportRect(): ClientRect
  {
    /**
     * Use the document element's bounding rect rather than the window scroll properties
     * (e.g. pageYOffset, scrollY) due to an issue in Chrome and IE where window scroll
     * properties and client coordinates (boundingClientRect, clientX/Y, etc.) are in different
     * comceptual viewports. Under most circumstances these viewports are equivalent, but they
     * can disagree when the page is pinch-zoomed (on devices that support touch).
     * See https://bugs.chromium.org/p/chromium/issues/detail?id=489206#c4
     * We use the documentElement instead of the body because, by defalt (without a css reset)
     * browsers typically give the document body an 8px margin, which is not included in
     * getBoundingClientRec(). 
     */
    // gets a reference to the root node of the document.
    const documentRect = document.documentElement.getBoundingClientRect();
    
    // the scrollPosition gives us the top and left values.
    const scrollPosition = this.getViewportScrollPosition(documentRect);
    const height = window.innerHeight;
    const width = window.innerWidth;

    // this is a ClientRect object being returned.
    return {
      top: scrollPosition.top,
      left: scrollPosition.left,
      bottom: scrollPosition.top + height,
      right: scrollPosition.left + width,
      height,
      width
    };

  } // getViewPortRect()


  /**
   * Gets the (top, left) scroll position of the viewport.
   * @param documentRect 
   */
  getViewportScrollPosition(
    a_documentRect = document.documentElement.getBoundingClientRect())
    : { top: number, left: number }
  {
    /**
     * the top-left-corner of the viewport is determined by the scroll position of the document
     * body, normally just (scrollLeft, scrollTop).  However, Chrome and Firefox disagree about
     * whether `document.body` or `document.documentElement` is the scrolled element, so
     * reading `scrollTop` and `scrollLeft` is inconsistent.  However, using the bounding rect
     * of `document.documentElement' works consistently, where the `top` and `left` values 
     * will equal negative the scroll position.  
     */
    const top = a_documentRect.top < 0 &&
                document.body.scrollTop == 0
                ? -a_documentRect.top
                : document.body.scrollTop;

    const left = a_documentRect.left < 0 &&
                 document.body.scrollLeft == 0
                 ? -a_documentRect.left
                 : document.body.scrollLeft;
    
    return { top, left};

  } // getViewportScrollPosition()

} // class ViewportRuler