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