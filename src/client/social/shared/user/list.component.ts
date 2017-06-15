import { Component, OnInit, HostBinding, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'z-social-share-profile-list',
  templateUrl: 'list.component.html'
})
export class ZSocialShareProfileListComponent implements OnInit {
  @Input() data: any;
  @Input() type: string;

  @HostBinding('class') class = 'list-group';

  constructor() {
  }

  ngOnInit() {
  }
}
