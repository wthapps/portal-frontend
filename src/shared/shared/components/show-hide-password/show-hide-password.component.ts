import { Component, ContentChild, ElementRef } from '@angular/core';
import { Constants } from '../../../constant/config/constants';

@Component({
  selector: 'show-hide-password',
  template: `<div class="has-password">
                <ng-content></ng-content>
                <span (click)="toggleShow()" class="hideShowPassword-toggle" pTooltip="{{ tooltip.showPassword }}"
                tooltipPosition="top"></span>
              </div>`
})
export class ShowHidePasswordComponent {
  show = false;
  tooltip: any = Constants.tooltip;

  @ContentChild('showhidepassword') input: ElementRef;

  toggleShow() {
    this.show = !this.show;
    console.log(this.input);
    if (this.show) {
      this.input.nativeElement.type = 'text';
    } else {
      this.input.nativeElement.type = 'password';
    }
  }
}
