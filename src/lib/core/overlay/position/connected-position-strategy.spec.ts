import { ElementRef } from '@angular/core';
import { ConnectedPositionStrategy } from './connected-position-strategy';
import { ViewportRuler } from './viewport-ruler';
import { OverlayPositionBuilder } from './overlay-position-builder';


// default width and height of the overlay and origin panels throughout these tests.
const DEFAULT_HEIGHT = 30;
const DEFAULT_WIDTH = 60;

/**
 * for all tests we assume the browser window is 1024x786 (outerWidth x outerHeight).
 * the karma config has been set to this for local tests, and it is the default size
 * for tests on CI (both saucelabs and browserstack).
 */

describe('ConnectedPositionStrategy', () => {

  const ORIGIN_HEIGHT = DEFAULT_HEIGHT;
  const ORIGIN_WIDTH = DEFAULT_WIDTH;
  const OVERLAY_HEIGHT = DEFAULT_HEIGHT;
  const OVERLAY_WIDTH = DEFAULT_WIDTH;

  let originElement: HTMLElement;
  let overlayElement: HTMLElement;
  let strategy: ConnectedPositionStrategy;
  let fakeElementRef: ElementRef;
  let fakeViewportRuler: FakeViewportRuler;
  let positionBuilder: OverlayPositionBuilder;

  let originRect: ClientRect;
  let originCenterX: number;
  let originCenterY: number;

  beforeEach( () => {
    fakeViewportRuler = new FakeViewportRuler();

    // the origin and overlay elements need to be in the document body in order to have geometry.
    originElement = createPositionedBlockElement();
    overlayElement = createPositionedBlockElement();
    document.body.appendChild(originElement);
    document.body.appendChild(overlayElement);

    fakeElementRef = new FakeElementRef(originElement);
    positionBuilder = new OverlayPositionBuilder(new ViewportRuler());

  }); // beforeEach()




}); // describe('ConnectedPositionStrategy')



/**
 * Creates an absolutely positioned, display: block element with a default size.
 */
function createPositionedBlockElement()
{
  let element = document.createElement('div');
  element.style.position = 'absolute';
  element.style.top = '0';
  element.style.left = '0';
  element.style.width = `${DEFAULT_WIDTH}px`;
  element.style.height = `${DEFAULT_HEIGHT}px`;
  element.style.backgroundColor = 'rebeccapurple';
  element.style.zIndex = '100';
  return element;

} // createPositionedBlockElement()



/**
 * Fake implementation of ViewportRuler that just returns the previously given ClientRect.
 */
class FakeViewportRuler implements ViewportRuler
{
  fakeRect: ClientRect = {
    left: 0,
    top: 0,
    width: 1014,
    height: 686,
    bottom: 686,
    right: 1014
  };

  fakeScrollPos: { top: number, left: number } = {
    top: 0,
    left: 0
  }

  getViewportRect()
  {
    return this.fakeRect;
  }

  getViewportScrollPosition(documentRect?: ClientRect): { top: number; left: number }
  {
    return this.fakeScrollPos;
  }

} // class FakeViewportRuler


/** Fake implementation of ElementRef that is just a simple container for nativeElement. */
class FakeElementRef implements ElementRef
{
  constructor(public nativeElement: HTMLElement) { }
}