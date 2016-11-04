import { EventEmitter, Output, QueryList } from '@angular/core';
import { UP_ARROW, DOWN_ARROW, TAB } from '../core';

/**
 * This is the interface for focusable items (used by the ListKeyManager).
 * Each item must know how to focus itself and whether or not it is currently disabled.
 */
export interface MdFocusable
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

  /**
   * This event is emitted any time the TAB key is pressed, so components can react
   * when focus is shifted off of the list.
   */
  @Output() tabOut = new EventEmitter<void>();

  constructor(private f_items: QueryList<MdFocusable>) { }


  set focusedItemIndex(value: number)
  {
    this.f_focusedItemIndex = value;
  }


  onKeyDown(a_event: KeyboardEvent): void
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
      this.tabOut.emit();
    }

  } // onKeyDown()


  private f_focusNextItem(): void 
  {
    const ay_items = this.f_items.toArray();
    this.f_updateFocusedItemIndex(1, ay_items);
    ay_items[this.f_focusedItemIndex].focus();

  } // f_focusNextItem()


  private f_focusPreviousItem(): void 
  {
    const ay_items = this.f_items.toArray();
    this.f_updateFocusedItemIndex(-1, ay_items);
    ay_items[this.f_focusedItemIndex].focus();
    
  } // f_focusPreviousItem()


  /**
   * This method sets focus to the correct item, given a list of items and the delta
   * between the currently focused item and the new item to be focused.  It will 
   * continue to move down the list until it finds an item that is not disabled,
   * and it will wrap it it encounters either end of the list.
   * 
   * @param delta the desired change in focus index.
   */
  private f_updateFocusedItemIndex(a_delta: number, a_ay_items: MdFocusable[])
  {
    // when focus would leave menu, wrap to beginning or end
    // for example: 5 + 1 (delta) + 8 (items length) = 14 % 8 = 6
    //              7 + 3 (delta) + 8 (items length) = 18 % 8 = 2 (wrapped around to the start) 
    this.f_focusedItemIndex =
      (this.f_focusedItemIndex + a_delta + a_ay_items.length) % a_ay_items.length;
    
    // skip all disabled menu items recursively until an active one
    // is reached, or the menu closes for over-reaching bounds
    while (a_ay_items[this.f_focusedItemIndex].disabled)
    {
      this.f_updateFocusedItemIndex(a_delta, a_ay_items); 
    }    

  } // f_updateFocusedItemIndex()

} // class ListKeyManager