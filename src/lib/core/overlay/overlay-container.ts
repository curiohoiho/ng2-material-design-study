/**
 * the OverlayContainer is the container in which all overlays will load.
 * it should be provided in the root component to ensure it is properly shared.
 */
export class OverlayContainer
{
  /** Container in which all overlays will load. */
  private f_containerElement: HTMLElement;

  /**
   * This method returns the overlay container element. It will lazily
   * create the element the first time it is called to facilitate using
   * the container in non-browser environments.
   */
  getContainerElement(): HTMLElement
  {
    if (!this.f_containerElement) 
    {
      this.f_createContainer()
    }

    return this.f_containerElement;

  } // getContainerElement()


  /**
   * Create the overlay container element, which is simply a div
   * with the 'md-overlay-container' class on the document body.
   */
  private f_createContainer(): void 
  {
    let container: HTMLDivElement = document.createElement('div');
    container.classList.add('md-overlay-container');
    document.body.appendChild(container);
    this.f_containerElement = container;

  } // f_createContainer()


} // class OverlayContainer