import { NgModule, ModuleWithProviders } from '@angular/core';
// import { MdLineModule } from './line/line';
// import { RtlModule } from './rtl/dir';
// import { MdRippleModule} from './ripple/ripple';
// import { PortalModule } from './portal/portal-directives';
// import { OverlayModule } from './overlay/overlay-directives';
// import { A11yModule, A11Y_PROVIDERS } from './a11y/index';
// import { OVERLAY_PROVIDERS } from './overlay/overlay';


// RTL
/* export { Dir, LayoutDirection, RtlModule } from './rtl/dir';*/

// Portals
/*export {
  Portal,
  PortalHost,
  BasePortalHost,
  ComponentPortal,
  TemplatePortal
} from './portal/portal';
*/

/*export {
  PortalHostDirective,
  TemplatePortalDirective,
  PortalModule 
} from './portal/portal-directives';
*/

/*export { DomPortalHost } from './portal/dom-portal-host';*/

// Projection 
// export * from './projection/projection';

// Platform
// export * from './platform/platform';


// Overlay - floating ui, like dialogs, alerts, selects, ... - based on Portals 
/*export { Overlay, OVERLAY_PROVIDERS } from './overlay/overlay';
export { OverlayContainer } from './overlay/overlay-container';
export { OverlayRef } from './overlay/overlay-ref';
export { OverlayState } from './overlay/overlay-state';
export {
  ConnectedOverlayDirective,
  OverlayOrigin,
  OverlayModule
} from './overlay/overlay-directives';
export * from './ overlay/position/connected-position-strategy';
export * from './overlay/position/connected-position';
*/

// Gestures
/*export { MdGestureConfig } from './gestures/MdGestureConfig';*/

// Ripple
/*export { MdRipple, MdRippleModule } from './ripple/ripple';*/

// a11y 
/*export {
  AriaLivePoliteness,
  MdLiveAnnouncer,
  LIVE_ANNOUNCER_ELEMENT_TOKEN
} from './a11y/live-announcer';*/

/*export { FocusTrap } from './a11y/focus-trap'; */
/* export { InteractivityChecker } from './a11y/interactivity-checker';*/
// export { isFakeMousedownFromScreenReader } from './a11y/fake-mousedown';

/*export {
  MdUniqueSelectionDispatcher,
  MdUniqueSlectionDispatcherListener
} from './coordination/unique-selection-dispatcher';*/

/*export { MdLineModule, MdLine, MdLineSetter} from './line/line';*/

// Style
/*export { applyCssTransform } from './style/apply-transform';*/

// Error
/*export { MdError } from './errors/error';*/

// Misc
/*export { ComponentType } from './overlay/generic-component-type';*/

// Keybindings
export * from './keyboard/keycodes';

/*export * from './compatibility/default-mode';*/

// Animation
export * from './animation/animation';

// Coercion
/*export { coerceBooleanProperty } from './coercion/boolean-property';*/
/*export { coerceNumberProperty } from './coercion/number-property';*/

// Compatibility 
// export { DefaultStyleCompatibilityModeModule } from './compatibility/default-mode';
// export { NoConflictStyleCompatibilityMode } from './compatibility/no-conflict-mode';


/*
imports: [MdLineModule, RtlModule, MdRippleModule, PortalModule, OverlayModule, A11yModule],
exports: [MdLineModule, RtlModule, MdRippleModule, PortalModule, OverlayModule, A11yModule],
providers: [A11Y_PROVIDERS, OVERLAY_PROVIDERS],
*/
@NgModule({
  imports: [],
  exports: []
})
export class MdCoreModule
{
  static forRoot(): ModuleWithProviders
  {
    return {
      ngModule: MdCoreModule,
      providers: []
    };
  } // forRoot()

} // class MdCoreModule










