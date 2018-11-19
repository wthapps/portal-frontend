import {
  Component,
  OnInit,
  HostBinding,
  Input,
  OnChanges,
  EventEmitter,
  Output,
  ViewEncapsulation
} from '@angular/core';
import * as fromMember from '../../shared/actions/member';
import { User } from '@wth/shared/shared/models';

@Component({
  selector: 'z-social-share-profile-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZSocialShareProfileListComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() type: string; // members, member, communities, community
  @Input() layout = 'list-group'; // row
  @Input() user: User;
  @Input() class = 'list-group-item'; // col-xs-6
  @Output() outEvent: EventEmitter<any> = new EventEmitter();

  @HostBinding('class') classHost = this.layout;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(data: any) {
    if (this.layout === 'row') {
      this.classHost = this.layout + ' row-striped';
    }
  }

  onAction(event: any) {
    switch (event.action.toUpperCase()) {
      case fromMember.ACTIONS.DELETE:
        this.removeItem(event.data);
        break;
      default:
        break;
    }
    this.outEvent.emit(event);
  }

  removeItem(data: any) {
    _.remove(this.data, (c: any) => c.uuid === data.uuid);
  }
}
