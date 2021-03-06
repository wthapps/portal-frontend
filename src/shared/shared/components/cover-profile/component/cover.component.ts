import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'so-cover',
  template: `
    <div class="zone-social-cover-action">
    <button class="btn btn-outline-primary" (click)="changeCoverImage($event)" *ngIf="item?.canEdit">
      <i class="fa fa-camera"></i> Edit cover
    </button>
  </div>
  <div class="zone-social-cover-img" id="cover_image">
    <img class="img-bg img-full no-user-selected" [src]="item?.cover_image" alt="">
  </div>
    `
})
export class CoverComponent {
  @Input() item: any;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();


  changeCoverImage(event: any) {
    this.outEvent.emit(event);
  }

  onCoverAction(event: any) {
    this.outEvent.emit(event);
  }

}

