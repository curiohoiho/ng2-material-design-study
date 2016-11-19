import {
  TemplateRef,
  ViewContainerRef,
  ElementRef,
  ComponentRef,
  Injector
} from '@angular/core';
import {
  MdNullPortalHostError,
  MdPortalAlreadyAttachedError,
  MdNoPortalAttachedError,
  MdNullPortalError,
  MdPortalHostAlreadyDisposedError,
  MdUnknownPortalTypeError
} from './portal-errors';
import { IComponentType } from '../overlay/generic-component-type';


/**
 * A Portal is something that you want to render somewhere else.
 * It can be attached to / detached from a `PortalHost`.
 */
export abstract class Portal<T>
{
  private f_attachedHost: IPortalHost;

  /** Attach this portal to a host. */
  attach(a_host: IPortalHost): T
  {
    if (a_host == null)
    {
      throw new MdNullPortalHostError();
    }

    if (a_host.hasAttached())
    {
      throw new MdPortalAlreadyAttachedError();
    }

    this.f_attachedHost = a_host;
    return <T> a_host.attach(this); // a bi-directional attachment

  } // attach() this portal to a host 


  /** Detach this portal from its host. */
  detach(): void 
  {
    let host = this.f_attachedHost;
    if (host == null)
    {
      throw new MdNoPortalAttachedError();
    }

    this.f_attachedHost = null;
    return host.detach();

  } // detach()

  /** Whether this portal is attached to a host. */
  get isAttached(): boolean 
  {
    return this.f_attachedHost != null; 
  } // isAttached()

  /**
   * Sets the PortalHost reference without performing `attach()`.  This is used directly by
   * the PortalHost when it is performing an `attach()` or `detach()`.
   */
  setAttachedHost(a_host: IPortalHost)
  {
    this.f_attachedHost = a_host;
  }

} // abstract class Portal<T>


/**
 * A `ComponentPortal` is a portal that instantiates some Component upon attachment.
 */
export class ComponentPortal<T> extends Portal<ComponentRef<T>>
{

  /** the type of the component that will be instantiated for attachment. */
  component: IComponentType<T>;

  /** 
   * [Optional] Where the attached component should live in Angular's *logical* component tree.
   * This is different from where the component *renders*, which is determined by the PortalHost.
   * The origin necessary when the host is outside of the Angular application context.
   */
  viewContainerRef: ViewContainerRef;

  /**
   * [Optional] Injector used for the instantiation of the component.
   */
  injector: Injector;

  constructor(
    component: IComponentType<T>,
    viewContainerRef: ViewContainerRef = null,
    injector: Injector = null)
  {
    super();
    this.component = component;
    this.viewContainerRef = viewContainerRef;
    this.injector = injector;

  } // constructor()

} // class ComponentPortal<T>

/**
 * A `TemplatePortal` is a portal that represents some embedded template (TemplateRef).
 */
export class TemplatePortal extends Portal<Map<string, any>>
{



}  // class TemplatePortal




/**
 * A `PortalHost` is a space that can contain a single `Portal`.
 */
export interface IPortalHost
{
  attach(portal: Portal<any>): any;

  detach(): any;

  dispose(): void;

  hasAttached(): boolean;

} // interface IPortalHost