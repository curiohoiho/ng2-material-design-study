/**
 * Strategy for setting the position of an overlay.
 */

export interface IPositionStrategy
{
  /** Updates the position of the overlay element. */
  apply(a_element: Element): Promise<void>;

  /** 
   *  Cleans up any DOM modifications made by the 
   *  position strategy, if necessary.
   */
  dispose(): void;
}