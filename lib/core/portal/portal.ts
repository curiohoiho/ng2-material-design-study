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
  /**
   * The embedded template that will be used to instantiate an embedded View in the host.
   */
  templateRef: TemplateRef<any>;

  /**
   * Reference to the ViewContainer into which the template will be stamped out.
   */
  viewContainerRef: ViewContainerRef;

  /**
   * Additional locals for the instantiated embedded view.
   * These locals can be seens as "exports" for the template, such as how
   * ngFor has index / event / odd.
   */
  locals: Map<string, any> = new Map<string, any>();

  constructor(template: TemplateRef<any>, viewContainerRef: ViewContainerRef) 
  {
    super();
    this.templateRef = template;
    this.viewContainerRef = viewContainerRef;
  }

  get origin(): ElementRef
  {
    return this.templateRef.elementRef;
  }

  attach(a_host: IPortalHost, locals?: Map<string, any>): Map<string, any>
  {
    this.locals = locals == null ? new Map<string, any>() : locals;
    return super.attach(a_host);
  }

  detach(): void 
  {
    this.locals = new Map<string, any>();
    return super.detach();
  }

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


/**
 * Partial implementation of PortalHost that only deals with attaching either a
 * ComponentPortal or a TemplatePortal.
 */
export abstract class BasePortalHost implements IPortalHost
{
  /**
   * The portal currently attached to the host.
   */
  private f_attachedPortal: Portal<any>;

  /** A function that will permanently dispose this host. */
  private f_disposeFn: () => void;

  /** Whether this host has alreadt been permanently disposed. */
  private f_isDisposed: boolean = false;

  /** Whether this host has an attached portal. */
  hasAttached()
  {
    return this.f_attachedPortal != null;
  } 


  attach(a_portal: Portal<any>): any 
  {
    if (a_portal == null) {
      throw new MdNullPortalError();
    }

    if (this.hasAttached()) {
      throw new MdPortalAlreadyAttachedError();
    }

    if (this.f_isDisposed) {
      throw new MdPortalHostAlreadyDisposedError();
    }

    if (a_portal instanceof ComponentPortal) {
      this.f_attachedPortal = a_portal;
      return this.attachComponentPortal(a_portal);
    } else if (a_portal instanceof TemplatePortal) {
      this.f_attachedPortal = a_portal;
      return this.attachTemplatePortal(a_portal);
    }

    throw new MdUnknownPortalTypeError();

  } // attach()


  abstract attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T>;

  abstract attachTemplatePortal(portal: TemplatePortal): Map<string, any>;

  detach(): void
  {
    if (this.f_attachedPortal)
    {
      this.f_attachedPortal.setAttachedHost(null);
    }

    this.f_attachedPortal = null;
    if (this.f_disposeFn != null)
    {
      this.f_disposeFn();
      this.f_disposeFn = null;
    }

  } // detach()

  dispose()
  {
    if (this.hasAttached())
    {
      this.detach();
    }

    this.f_isDisposed = true;

  } // dispose()


  setDisposeFn(a_fn: () => void)
  {
    this.f_disposeFn = a_fn;
  }

} // abstract class BasePortalHost