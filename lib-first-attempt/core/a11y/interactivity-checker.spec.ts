import { InteractivityChecker } from './interactivity-checker';

describe('InteractivityChecker', () => {

  let testContainerElement: HTMLElement;
  let checker: InteractivityChecker;

  beforeEach( () => {
    testContainerElement = document.createElement('div');
    document.body.appendChild(testContainerElement);

    checker = new InteractivityChecker();
  }); // beforeEach()


  afterEach( () => {
    document.body.removeChild(testContainerElement);
    testContainerElement.innerHTML = '';
  }); // afterEach()


  describe('isDisabled', () => {

    it('should return true for disabled elements', () => {
      let elements = createElements('input', 'textarea', 'select', 'button', 'md-checkbox');
      elements.forEach(el => el.setAttribute('disabled', ''));

      appendElements(elements);

      elements.forEach(el => {
        expect(checker.isDisabled(el))
          .toBe(true, `Expected <${el.nodeName} disabled> to be disabled`);
      });

    }); // it('should return true for disabled elements')

    it('should return false for elements without disabled', () => {
      let elements = createElements('input', 'textarea', 'select', 'button', 'md-checkbox');
      appendElements(elements);

      elements.forEach(el => {
        expect(checker.isDisabled(el))
          .toBe(false, `Expected <${el.nodeName}> not to be disabled`);
      });
    }); // it('should return false for elements without disabled')

  }); // describe('isDisabled')


  describe ('isVisible', () => {

    it('should return false for a `display: none` element', () => {
      testContainerElement.innerHTML = `<input style="display: none">`;
      let input = testContainerElement.querySelector('input') as HTMLElement;

      expect(checker.isVisible(input))
        .toBe(false, 'Expected element with `display: none` to not be visible');
    }); // it('should return false for a `display: none` element')


    it('should return false for the child of a `display: none` element', () => {
      testContainerElement.innerHTML =
        `<div style="display: none;">
            <input>
         </div>
        `;
      let input = testContainerElement.querySelector('input') as HTMLElement;

      expect(checker.isVisible(input))
        .toBe(false, 'Expected element with `display: none` parent to not be visible');

    }); // it('should return false for the child of a `display: none` element)


    it('should return false for a `visibility: hidden` element', () => {

      testContainerElement.innerHTML =
        `<input style="visibility: hidden;"`;
      
      let input = testContainerElement.querySelector('input') as HTMLElement;

      expect(checker.isVisible(input))
        .toBe(false, 'Expected element with `visibility: hidden` to not be visible');

    }); // it('should return false for a `visibility: hidden` element')


    it('should return false for the child of a `visibility: hidden` element', () => {
      
      testContainerElement.innerHTML =
        `<div style="visibility: hidden;">
          <input>
         </div>
        `;
      let input = testContainerElement.querySelector('input') as HTMLElement;

      expect(checker.isVisible(input))
        .toBe(false, 'Expected element with `visibility: hidden` parent to not be visible');

    }); // it('should return false for the child of a `visibility: hidden` element')


    it('should return true for an element with `visibility: hidden` ancestor and *closer* ' +
        '`visibility: visible` ancestor', () => {

      testContainerElement.innerHTML =
        `<div style="visibility: hidden;">
           <div style="visibility: visible;">
             <input> 
           </div>
         </div>`;
      let input = testContainerElement.querySelector('input') as HTMLElement;

      expect(checker.isVisible(input))
        .toBe(true, 'Expected element with `visibility: hidden` ancestor and closer ' +
              '`visibility: visible` ancestor to be visible');

    }); // it()


    it('should return true for an element without visibility modifiers', () => {

      let input = document.createElement('input');
      testContainerElement.appendChild(input);

      expect(checker.isVisible(input))
        .toBe(true, 'Expected element without visibility modifiers to be visible');

    }); // it('should return true for an element without visibility modifiers')

  }); // describe('isVisible')


  describe('isFocusable', () => {

    


  }); // describe('isFocusable')



  describe('isTabbable', () => {

    

  }); // describe('isTabbable')



  /**
   * Creates an array of `HTMLElements` with the given node names.
   * Loop through each nodeName using `.map`, and 
   * call `document.createElement()`.
   * Returns an `HTMLElement[]`.
   * You aren't adding them to the page with this function.
   */
  function createElements(...a_nodeNames: string[]): HTMLElement[]
  {
    return a_nodeNames.map(name => document.createElement(name));

  } // createElements()


  /**
   * Appends elements to the testContainerElement.
   * Loop through the elements and call `testContainerElement.appendChild()` for each
   */
  function appendElements(a_elements: Element[])
  {
    for (let e of a_elements)
    {
      testContainerElement.appendChild(e);
    }

  } // appendElements()

}); // describe('InteractivityChecker')