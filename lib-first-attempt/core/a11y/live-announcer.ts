import {
  Injectable,
  OpaqueToken,
  Optional,
  Inject
} from '@angular/core';

export const LIVE_ANNOUNCER_ELEMENT_TOKEN = new OpaqueToken('mdLiveAnnounerElement');


export type AriaLivePoliteness = 'off' | 'polite' | 'assertive';


@Injectable()
export class MdLiveAnnouncer
{
  private f_liveElement: Element;

  
  constructor(@Optional() @Inject(LIVE_ANNOUNCER_ELEMENT_TOKEN) a_elementToken: any)
  {
    // we inject the live element as `any` because the constructor signature cannot reference
    // browser globals (HTMLElement) on non-browser environments, since have a class decorator
    // causes typescript to preserve the contructor signature types.
    this.f_liveElement = a_elementToken || this.f_createLiveElement();

  } // constructor()


  /**
   * @param message  Message to be announced to the screenreader
   * @param politeness  The politeness of the announcer element
   */
  announce(a_s_message: string, a_politeness: AriaLivePoliteness = 'polite'): void 
  {
    this.f_liveElement.textContent = '';

    // @todo: ensure changing the politeness works on all environments we support
    this.f_liveElement.setAttribute('aria-live', a_politeness);

    /**
     * This 100ms timeout is necessary for some browser + screen-reader combinations:
     * - Both JAWS and NVDA over IE11 will not announce anything without a non-zero timeout
     * - With Chrome and IE11 with NVDA or JAWS, a repeated(identical) message won't be read a
     *   second time without clearing and then using a non-zero delay.
     *   (using JAWS 17 at time of this writing) 
     */
    setTimeout( () => {
      this.f_liveElement.textContent = a_s_message;
    }, 100);

  } // announce()

  /**
   * Removes the aria-live element from the DOM.
   * `this.f_liveElement.parentNode.removeChild(this.f_liveElement);`
   */
  public f_removeLiveElement(): void
  {
    if (this.f_liveElement && this.f_liveElement.parentNode)
    {
      this.f_liveElement.parentNode.removeChild(this.f_liveElement);
    }
  } // f_removeLiveElement()


  private f_createLiveElement() : Element
  {
    let liveEl: HTMLDivElement = document.createElement('div');
    liveEl.classList.add('md-visually-hidden');
    liveEl.setAttribute('aria-atomic', 'true');
    liveEl.setAttribute('aria-live', 'polite');

    document.body.appendChild(liveEl);

    return liveEl;

  } // f_createLiveElement()



} // class MdLiveAnnouncer