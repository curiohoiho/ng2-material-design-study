import { QueryList } from '@angular/core';
import { ListKeyManager, IMdFocusable } from './list-key-manager';
import { DOWN_ARROW, UP_ARROW, TAB } from '../keyboard/keycodes';


class FakeFocusable
{
  disabled: false; 
  focus() {};
}


// set up events to be used
const DOWN_ARROW_EVENT = { keyCode: DOWN_ARROW } as KeyboardEvent;
const UP_ARROW_EVENT = { keyCode: UP_ARROW } as KeyboardEvent;
const TAB_EVENT = { keyCode: TAB } as KeyboardEvent;


/** 
 * Be able to move within a QueryList.
 * Simulate moving up and down the list with arrow keys.
 * */
describe('ListKeyManager', () => {

  let keyManager: ListKeyManager;
  let qylst_itemList: QueryList<IMdFocusable>;
  let ay_focusable_items: IMdFocusable[];

  /** 
   * set up the QueryList, 
   * add Focusable items to it,
   * and pass that QueryList to the ListKeyManager. 
   * */
  beforeEach( () => {
     
    qylst_itemList = new QueryList<IMdFocusable>();
    ay_focusable_items = [
      new FakeFocusable(),
      new FakeFocusable(),
      new FakeFocusable()
    ];

    // override .toArray()
    qylst_itemList.toArray = () => ay_focusable_items;

    // the keyManager for this QueryList passed in
    keyManager = new ListKeyManager(qylst_itemList);

    // first item is already focused, no spy yet on it.
    keyManager.focusedItemIndex = 0;

    /** jasmine spy on these objects and their `focus` method */
    spyOn(ay_focusable_items[0], 'focus');
    spyOn(ay_focusable_items[1], 'focus');
    spyOn(ay_focusable_items[2], 'focus');

  }); // beforeEach()


  it('should focus subsequent items when down arrow is pressed', () => {

    keyManager.onKeydown(DOWN_ARROW_EVENT);

    expect(ay_focusable_items[0].focus).not.toHaveBeenCalled(); // this was focused in beforeEach()
    expect(ay_focusable_items[1].focus).toHaveBeenCalledTimes(1);
    expect(ay_focusable_items[2].focus).not.toHaveBeenCalled();

    keyManager.onKeydown(DOWN_ARROW_EVENT);

    expect(ay_focusable_items[0].focus).not.toHaveBeenCalled(); // this was focused in beforeEach()
    expect(ay_focusable_items[1].focus).toHaveBeenCalledTimes(1);
    expect(ay_focusable_items[2].focus).toHaveBeenCalledTimes(1);

  }); // it('should focus subsequent items when down arrow is pressed')


  it('should focus previous items when up arrow is pressed', () => {
    keyManager.onKeydown(DOWN_ARROW_EVENT);

    expect(ay_focusable_items[0].focus).not.toHaveBeenCalled();
    expect(ay_focusable_items[1].focus).toHaveBeenCalledTimes(1);

    keyManager.onKeydown(UP_ARROW_EVENT);

    expect(ay_focusable_items[0].focus).toHaveBeenCalledTimes(1);
    expect(ay_focusable_items[1].focus).toHaveBeenCalledTimes(1);

  }); // it('should focus previous items when up arrow is pressed')


  it('should skip disabled items when using arrow keys', () => {
    ay_focusable_items[1].disabled = true;

    // down arrow should skip past disabled item from 0 to 2
    keyManager.onKeydown(DOWN_ARROW_EVENT);
    expect(ay_focusable_items[0].focus).not.toHaveBeenCalled();
    expect(ay_focusable_items[1].focus).not.toHaveBeenCalled();
    expect(ay_focusable_items[2].focus).toHaveBeenCalledTimes(1);

    // up arrow should skip past disabled item from 2 to 0
    keyManager.onKeydown(UP_ARROW_EVENT);
    expect(ay_focusable_items[0].focus).toHaveBeenCalledTimes(1);
    expect(ay_focusable_items[1].focus).not.toHaveBeenCalled();
    expect(ay_focusable_items[2].focus).toHaveBeenCalledTimes(1);

  }); // it('should skip disabled items when using arrow keys')


  it('should work normally when disabled property does not exist', () => {
    ay_focusable_items[0].disabled = undefined;
    ay_focusable_items[1].disabled = undefined;
    ay_focusable_items[2].disabled = undefined;

    keyManager.onKeydown(DOWN_ARROW_EVENT);
    expect(ay_focusable_items[0].focus).not.toHaveBeenCalled();
    expect(ay_focusable_items[1].focus).toHaveBeenCalledTimes(1);
    expect(ay_focusable_items[2].focus).not.toHaveBeenCalled();

    keyManager.onKeydown(DOWN_ARROW_EVENT);
    expect(ay_focusable_items[0].focus).not.toHaveBeenCalled();
    expect(ay_focusable_items[1].focus).toHaveBeenCalledTimes(1);
    expect(ay_focusable_items[2].focus).toHaveBeenCalledTimes(1);

  }); // it('should work normally when disabled property does not exist')


  it('should wrap back to menu when arrow keying past items', () => {

    keyManager.onKeydown(DOWN_ARROW_EVENT);
    keyManager.onKeydown(DOWN_ARROW_EVENT);

    expect(ay_focusable_items[0].focus).not.toHaveBeenCalled();
    expect(ay_focusable_items[1].focus).toHaveBeenCalledTimes(1);
    expect(ay_focusable_items[2].focus).toHaveBeenCalledTimes(1);

    // this down arrow moves down passt the end of the list 
    keyManager.onKeydown(DOWN_ARROW_EVENT);
    expect(ay_focusable_items[0].focus).toHaveBeenCalledTimes(1);
    expect(ay_focusable_items[1].focus).toHaveBeenCalledTimes(1);
    expect(ay_focusable_items[2].focus).toHaveBeenCalledTimes(1);

    // this up arrow moves up past the beginning of the list
    keyManager.onKeydown(UP_ARROW_EVENT);
    expect(ay_focusable_items[0].focus).toHaveBeenCalledTimes(1);
    expect(ay_focusable_items[1].focus).toHaveBeenCalledTimes(1);
    expect(ay_focusable_items[2].focus).toHaveBeenCalledTimes(2);

  }); // it('should wrap back to menu when arrow keying past items')


  it('should emit tabOut when the tab key is pressed', () => {

    let tabOutEmitted = false;
    keyManager.tabOut.first().subscribe( () => tabOutEmitted = true);
    keyManager.onKeydown(TAB_EVENT);

    expect(tabOutEmitted).toBe(true);

  }); // it('should emit tabOut when the tab key is pressed')


}); // describe('ListKeyManager')