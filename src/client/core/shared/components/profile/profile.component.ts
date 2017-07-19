import { Component, OnInit, Input } from '@angular/core';
import { PartialsProfileService } from './profile.service';
import { UserContact } from '../../models/user/user-contact.model';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile',
  templateUrl: 'profile.component.html'
})

export class PartialsProfileComponent implements OnInit {
  @Input() dataConfig: any;
  @Input() data: any;

  constructor(private profileService: PartialsProfileService) {

  }

  ngOnInit() {
  //
  }
}
