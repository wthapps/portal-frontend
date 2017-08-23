import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'so-profile',
  template: `
    <div class="z-social-media-left can-click" (click)="changeProfileImage($event)" id="profile_image">
      <div class="avatar-md">
          <img [src]="item.profile_image" class="no-user-selected">
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

  changeProfileImage(event: any) {
    // Only allow user with canEdit priviledge update the cover / profile image
    if (this.item.canEdit || this.editable)
      this.outEvent.emit(event);
  }

}
