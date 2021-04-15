import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') isOpened: boolean = false;

  @HostListener('click') toggleOpen() {
    console.log('click to open');
    this.isOpened = !this.isOpened;
  }
}
