import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'so-profile',
  template: `
    <div class="z-social-media-left can-click" (click)="changeProfileImage($event)" id="profile_image">
      <div class="avatar-md">
          <img [src]="item.profile_image" class="no-user-selected">
          <span class="zone-social-cover-info-profile">
            <i class="fa fa-camera"></i> Update Profile Picture
          </span>
      </div>
     </div>
    `
})
export class ProfileComponent {
  @Input() item: any;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  changeProfileImage(event: any) {
    // Only allow user with canEdit priviledge update the cover / profile image
    if (this.item.canEdit)
      this.outEvent.emit(event);
  }

}

