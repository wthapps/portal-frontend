import { Component } from '@angular/core';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'z-social',
  templateUrl: 'social.component.html'
})

export class ZSocialComponent {
  constructor() {
  }

  onUpload(event: any) {
    $('#modal-social-upload').modal({
      backdrop: 'static'
    });
  }
}
