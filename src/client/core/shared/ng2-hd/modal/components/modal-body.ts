import { Component } from '@angular/core';

@Component({
  selector: 'hd-modal-body',
  template: `
      <div class='modal-body'>
        <ng-content></ng-content>
      </div>
    `
})
export class HdModalBodyComponent {
}
