import { NgZone } from '@angular/core';
import { IPortalHost, Portal } from '../portal/portal';
import { OverlayState } from './overlay-state';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

/**
 * Reference to an overlay that has been created with the overlay service.
 * Used to manipulate or dispose of said overlay.
 */
export class OverlayRef implements IPortalHost
{
  private f_backdropElement: HTMLElement = null;
  private f_backdropClick: Subject<any> = new Subject();

  constructor(
    private f_portalHost: IPortalHost,
    private f_pane: HTMLElement,
    private f_overlayState: OverlayState,
    private _ngZone: NgZone
  ) {}

  /**
   * The overlay's HTML element.
   */
  get overlayElement(): HTMLElement
  {
    return this.f_pane;
  }


  /** */
  attach(a_portal: Portal<any>): any 
  {
    if (this.f_overlayState.hasBackdrop)
    {
      this.f_attachBackdrop();
    }

    let attachResult = this.f_portalHost.attach(a_portal);
    this.updateSize();
    this.updateDirection();
    this.updatePosition();

    return attachResult;

  } // attach()


  detach(): Promise<any>
  {
    this.f_detachBackdrop();
    return this.f_portalHost.detach();
  }

  dispose(): void 
  {
    if (this.f_overlayState.positionStrategy)
    {
      this.f_overlayState.positionStrategy.dispose();
    }
    this.f_detachBackdrop();
    this.f_portalHost.dispose();
  }


  hasAttached(): boolean 
  {
    return this.f_portalHost.hasAttached();
  }

  
  backdropClick(): Observable<void>
  {
    return this.f_backdropClick.asObservable();
  }

  /** Gets the current state config of the overlay. */
  getState(): OverlayState
  {
    return this.f_overlayState;
  }

  /** updates the position of the overlay based on the position strategy. */
  updatePosition()
  {
    if (this.f_overlayState.positionStrategy)
    {
      this.f_overlayState.positionStrategy.apply(this.f_pane);
    }
  } // updatePosition()


  /** updates the text direction of the overlay panel. */
  private updateDirection(): void 
  {
    this.f_pane.setAttribute('dir', this.f_overlayState.direction);
  }

  /** updates the size of the overlay based on the overlay config. */
  updateSize(): void 
  {
    if (this.f_overlayState.width || this.f_overlayState.width === 0)
    {
      this.f_pane.style.width = formatCssUnit(this.f_overlayState.width);
    }

    if (this.f_overlayState.height || this.f_overlayState.height === 0)
    {
      this.f_pane.style.height = formatCssUnit(this.f_overlayState.height);
    }

    if (this.f_overlayState.minWidth || this.f_overlayState.minWidth === 0)
    {
      this.f_pane.style.minWidth = formatCssUnit(this.f_overlayState.minWidth);
    }

    if (this.f_overlayState.minHeight || this.f_overlayState.minHeight === 0)
    {
      this.f_pane.style.minHeight = formatCssUnit(this.f_overlayState.minHeight);
    }

  } // updateSize()


  /** Attaches a backdrop for this overlay. */
  private f_attachBackdrop(): void 
  {
    // create an overlay-backdrop element.  append to the parent of the origin element.
    this.f_backdropElement = document.createElement('div');
    this.f_backdropElement.classList.add('md-overlay-backdrop');
    this.f_backdropElement.classList.add(this.f_overlayState.backdropClass);

    this.f_pane.parentElement.appendChild(this.f_backdropElement);

    /**
     * forward backdrop clicks such that the consumer of the overlay can perform whatever
     * action desired when such a click occurs (usually closing the overlay).
     */
    this.f_backdropElement.addEventListener('click', () => {
      this.f_backdropClick.next(null);
    });

    // add class to fade-in the backdrop after one frame
    requestAnimationFrame( () => { 
      // this.f_backdropElement.classList.add('md-overlay-backdrop-showing');
      if (this.f_backdropElement)
      {
        this.f_backdropElement.classList.add('md-overlay-backdrop-showing');
      }
    });

  } // f_attachBackdrop()


  /** Detaches the backdrop (if any) associated with the overlay. */
  private f_detachBackdrop(): void 
  {
    // remove the css classes 
    let backdropToDetach: HTMLElement = this.f_backdropElement;
    
    if (backdropToDetach)
    {
      let finishDetach = () => {
        // it may not be attaced to anything in certain cases (e.g. unit tests)
        if (backdropToDetach && backdropToDetach.parentNode)
        {
          backdropToDetach.parentNode.removeChild(backdropToDetach);
        }

        // It is possible that a new portal has been attached to this 
        // overlay since we started removing the backdrop. 
        // If that is the case, only clear the backdrop reference if it
        // is still the same instance that we started to remove.
        if (this.f_backdropElement == backdropToDetach)
        {
          this.f_backdropElement = null;
        }
      }; // finishDetach()


      backdropToDetach.classList.remove('md-overlay-backdrop-showing');
      backdropToDetach.classList.remove(this.f_overlayState.backdropClass);
      backdropToDetach.addEventListener('transitioned', finishDetach);

      // If the backdrop doesn't have a transition, the 
      // `transitionend` event won't fire.
      // In this case we make it unclickable and we try to remove it 
      // after a delay.
      backdropToDetach.style.pointerEvents = 'none';

      // Run this outside the Angular zone because there's nothing 
      // that Angular cares about.
      // If it were to run inside the Angular zone, every test 
      // that used Overlay would have to be either async or fakeAsync.
      this._ngZone.runOutsideAngular( () => {
        setTimeout(finishDetach, 500);
      });       
      
    } // if (backdropToDetach) exists 

  } // f_detachBackdrop()

} // class OverlayRef


function formatCssUnit(value: number | string): string 
{
  return typeof value === 'string' ? value as string : `${value}px`;
}