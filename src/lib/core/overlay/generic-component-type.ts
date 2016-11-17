
export interface IComponentType<T>
{
  new (...args: any[]): T;
}