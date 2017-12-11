import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';
import { Constants } from '../../../../constant/config/constants';

@Component({
  selector: 'so-profile',
  template: `
    <div class="z-social-media-left can-click" (click)="changeProfileImage($event)" id="profile_image">
      <div class="avatar-md">
          <img *ngIf="item.profile_image" [src]="item.profile_image" class="no-user-selected">
          <img *ngIf="!item.profile_image" [src]="constants.img.avatar" class="no-user-selected">
          <span class="zone-social-cover-info-profile">
            <i class="fa fa-camera"></i>
          </span>
      </div>
     </div>
    `,
    encapsulation: ViewEncapsulation.None
})
export class ProfileComponent {
  @Input() item: any;
  @Input() editable: boolean = false;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  constants: any = Constants;

  changeProfileImage(event: any) {
    // Only allow user with canEdit priviledge update the cover / profile image
    if (this.item.canEdit || this.editable)
      this.outEvent.emit(event);
  }

}
