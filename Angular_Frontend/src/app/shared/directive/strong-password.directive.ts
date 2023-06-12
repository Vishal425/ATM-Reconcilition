import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[number-only]'
})
export class NumbersOnlyDirective {

  next: string;
  current: string;
  regexOnlyNumStr = '^[0-9]*$';
  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event']) onKeyPress(event) {

    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    else {
      return true;
    }

    // let e = <KeyboardEvent>event;
    // // Do not use event.keycode this is deprecated.
    // // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // let current: string = this.el.nativeElement.value;
    // // We need this because the current value on the DOM element
    // // is not yet updated with the value from this event
    // let next: string = current.concat(e.key);
    // if (next && !String(next).match(this.regexOnlyNumStr)) {
    //   e.preventDefault();
    // }
  }
}
