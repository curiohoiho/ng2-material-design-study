import {
  inject,
  fakeAsync,
  tick,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  MdLiveAnnouncer,
  LIVE_ANNOUNCER_ELEMENT_TOKEN
} from './live-announcer';


describe('MdLiveAnnouncer', () => {

  // what do we want to exercise?
  let announcer: MdLiveAnnouncer;
  let ariaLiveElement: Element;
  let fixture: ComponentFixture<TestApp>; // see bottom of this file for this class 


  describe('with default element', () => {

    beforeEach( () => TestBed.configureTestingModule({
      declarations: [TestApp],
      providers: [MdLiveAnnouncer]
    })); // beforeEach()

    beforeEach( 
      fakeAsync(
        inject([MdLiveAnnouncer], (la: MdLiveAnnouncer) => {
          announcer = la;
        }) // inject()
      ) // fakeAsync()
    ); // beforeEach()

    afterEach( () => {
      
      // In our tests we always remove the current live element, because otherwise we would have
      // multiple live elements due to multiple service instantiation
      announcer.f_removeLiveElement();

    }); // afterEach()


    it('should correctly update the announce text', fakeAsync( () => {

      let buttonElement: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;
      buttonElement.click();

      // this flushes our 100ms timeout for the screenreaders.
      tick(100);

      expect(ariaLiveElement.textContent).toBe('Test');

    })); // it('should correctly update the announce text')


    it('should correctly update the politeness attribute', fakeAsync( () => {
      announcer.announce('Hey Google', 'assertive');

      // this flushes our 100ms timeout for the screenreaders.
      tick(100);

      expect(ariaLiveElement.textContent).toBe('Hey Google');
      expect(ariaLiveElement.getAttribute('aria-live')).toBe('assertive');

    })); // it('should correctly update the politeness attribute')


    it('should apply the aria-live value polite by default', fakeAsync( () => {
      announcer.announce('Hey Google');

      // This flushed our 100ms timeout for the screenreaders.
      tick(100);

      expect(ariaLiveElement.textContent).toBe('Hey Google');
      expect(ariaLiveElement.getAttribute('aria-live')).toBe('polite');

    })); // it('should apply the aria-live value polite by default')


    it('should remove the aria-live element from the DOM', fakeAsync( () => {
      announcer.announce('Hey Google');

      // this flushes our 100ms timeout for the screenreaders.
      tick(100);

      announcer.f_removeLiveElement();

      expect(document.body.querySelector('[aria-live]'))
        .toBeFalsy('Expected that the aria-live element was removed from the DOM.');

    })); // it('should remove the aria-live element from the DOM')

  }); // describe('with default element')


  describe('with a custom element', () => {

    let customLiveElement: HTMLElement;

    beforeEach( () => {
      let customLiveElement: HTMLDivElement = document.createElement('div');

      return TestBed.configureTestingModule({
        declarations: [TestApp],
        providers: [
          { provide: LIVE_ANNOUNCER_ELEMENT_TOKEN, useValue: customLiveElement },
          MdLiveAnnouncer
        ]
      }); // return 

    }); // beforeEach()


    beforeEach( 
      inject([MdLiveAnnouncer], (la: MdLiveAnnouncer) => {
        announcer = la;
        ariaLiveElement = getLiveElement();
      }) // inject()
    ); // beforeEach()


    it('should allow to use a custom live element', fakeAsync( () => {
      announcer.announce('Custom Element');

      // this flushes our 100ms timeout for the screenreaders.
      tick(100);

      expect(customLiveElement.textContent).toBe('Custom Element');

    })); // it('should allow to use a custom live element')

  }); // describe('with a custom element')

}); // describe('MdLiveAnnouncer')


/**
 * return document.body.querySelector('[aria-live]');
 */
function getLiveElement(): Element
{
  return document.body.querySelector('[aria-live]');
}


@Component({
  template: `<button (click)="announceText('Test')">Announce</button>`
})
class TestApp
{
  constructor(public live: MdLiveAnnouncer) { };

  announceText(a_s_message: string)
  {
    this.live.announce(a_s_message);
  }

} // class TestApp