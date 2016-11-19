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

  


} // class OverlayRef