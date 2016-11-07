/**
 * Coerces a data-bound value (typically a string) to a boolean.
 */
export function coerceBooleanProperty(a_value: any): boolean 
{
  return a_value != null && `${a_value}` !== 'false';
}