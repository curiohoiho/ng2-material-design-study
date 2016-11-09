import { Injectable } from '@angular/core';


/**
 * Users of the Dispatcher never need to see thi stype, but Typescript requires it to be exported.
 */
export type MdUniqueSelctionDispatcherListener = (id: string, name: string) => void;


/**
 * Class to coordinate unique selection based on name.
 * Intended to be consumed as an Angular service.
 * This service is needed because native radio change events are only fired on the item currently
 * being selected, and we still need to uncheck the previous selection.
 * 
 * This service does not *store* any IDs and names because they may change at any time, so it is 
 * less error-prone if they are simply passed through when the events occur.
 */
@Injectable()
export class MdUniqueSelectionDispatcher
{
  private f_listeners: MdUniqueSelctionDispatcherListener[] = [];

  /** Notify other items that selection for the given name has been set. */
  notify(id: string, name: string)
  {
    for (let listener of this.f_listeners)
    {
      listener(id, name);
    }
  } // notify()


  /** Listen for future changes to item selection. */
  listen(a_listener: MdUniqueSelctionDispatcherListener)
  {
    this.f_listeners.push(a_listener);
  }

} // class MdUniqueSelectionDispatcher