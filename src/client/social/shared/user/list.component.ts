import { Component, OnInit, HostBinding, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import * as fromMember from '../../actions/member';


declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-share-profile-list',
  templateUrl: 'list.component.html'
})
export class ZSocialShareProfileListComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() type: string; // members, member, communities, community
  @Input() layout: string = 'list-group'; //row
  @Input() class: string = 'list-group-item'; //col-xs-6
  @Output() outEvent: EventEmitter<any> = new EventEmitter();

  @HostBinding('class') classHost = this.layout;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(data: any) {
    if (this.layout == 'row') {
      this.classHost = this.layout + ' row-striped';
    }
  }

  onAction(event: any) {
    switch (event.action) {
      case fromMember.ACTIONS.DELETE:
        this.removeItem(event.data);
        break;
      default:
        break;
    }
    this.outEvent.emit(event);
  }

  removeItem(data: any) {
    _.remove(this.data, (c: any) => c.uuid == data.uuid);
  }
}
