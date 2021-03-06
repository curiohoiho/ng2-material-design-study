import { QueryList } from '@angular/core';
import { UP_ARROW, DOWN_ARROW, TAB } from '../core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


/**
 * This is the interface for focusable items (used by the ListKeyManager).
 * Each item must know how to focus itself and whether or not it is currently disabled.
 */
export interface IMdFocusable
{
  focus() : void;
  disabled?: boolean;
}

/**
 * This class manages keyboard events for selectable lists.  If you pass it a query list 
 * of focusable items, it will focus the correct item when arrow events occur.
 */
export class ListKeyManager
{
  private f_focusedItemIndex: number;
  private f_tabOut$: Subject<any> = new Subject();

  constructor(private f_qylst_items: QueryList<IMdFocusable>) { }

  get tabOut(): Observable<void>
  {
    return this.f_tabOut$.asObservable();
  } // get tabOut()


  set focusedItemIndex(value: number)
  {
    this.f_focusedItemIndex = value;
  }


  onKeydown(a_event: KeyboardEvent): void
  {
    if (a_event.keyCode === DOWN_ARROW)
    {
      this.f_focusNextItem();
    }
    else if (a_event.keyCode === UP_ARROW)
    {
      this.f_focusPreviousItem();
    }
    else if (a_event.keyCode === TAB)
    {
      this.f_tabOut$.next(null); // using the observable
    }

  } // onKeyDown()


  private f_focusNextItem(): void 
  {
    const ay_focusable_items = this.f_qylst_items.toArray();
    this.f_updateFocusedItemIndex(1, ay_focusable_items);
    ay_focusable_items[this.f_focusedItemIndex].focus();

  } // f_focusNextItem()


  private f_focusPreviousItem(): void 
  {
    const ay_focusable_items = this.f_qylst_items.toArray();
    this.f_updateFocusedItemIndex(-1, ay_focusable_items);
    ay_focusable_items[this.f_focusedItemIndex].focus();
    
  } // f_focusPreviousItem()


  /**
   * This method sets focus to the correct item, given a list of items and the delta
   * between the currently focused item and the new item to be focused.  It will 
   * continue to move down the list until it finds an item that is not disabled,
   * and it will wrap it it encounters either end of the list.
   * 
   * The whole point is to set this.f_focusedItemIndex to the next focusable number.
   * So there is no return value.
   * @param delta the desired change in focus index.
   */
  private f_updateFocusedItemIndex(a_delta: number, a_ay_focusable_items: IMdFocusable[]): void 
  {
    // when focus would leave menu, wrap to beginning or end
    // for example: 5 + 1 (delta) + 8 (items length) = 14 % 8 = 6
    //              7 + 3 (delta) + 8 (items length) = 18 % 8 = 2 (wrapped around to the start) 
    this.f_focusedItemIndex =
      (this.f_focusedItemIndex + a_delta + a_ay_focusable_items.length) % a_ay_focusable_items.length;
    
    // skip all disabled menu items recursively until an active one
    // is reached, or the menu closes for over-reaching bounds
    while (a_ay_focusable_items[this.f_focusedItemIndex].disabled)
    {
      this.f_updateFocusedItemIndex(a_delta, a_ay_focusable_items); 
    }    

  } // f_updateFocusedItemIndex()

} // class ListKeyManager