/**
 * Applies a CSS transform to an element, including browser-prefixed properties.
 * @param element
 * @param transformValue
 */
export function applyCssTransform(
  a_element: HTMLElement,
  a_s_transformValue: string) : void 
{
  // it's important to trim the result, because the browser will ignore the set operation
  // if the string contains only whitespace
  let s_value: string = a_s_transformValue.trim();

  a_element.style.transform = s_value;
  a_element.style.webkitTransform = s_value;

} // applyCssTransform()