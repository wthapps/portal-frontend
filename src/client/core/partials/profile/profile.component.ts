import { Component, OnInit } from '@angular/core';
import { PartialsProfileService } from './profile.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile',
  templateUrl: 'profile.component.html'
})

export class PartialsProfileComponent implements OnInit {

  data: any;

  constructor(private profileService: PartialsProfileService) {
  }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.profileService.getMyProfile().subscribe(
      (res: any)=> {
        this.data = res.data;
        console.log(res.data);
      }
    );
  }
}
