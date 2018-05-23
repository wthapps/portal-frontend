import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { UserService } from '@shared/services';

@Component({
  selector: 'z-social-cover',
  templateUrl: 'cover.component.html',
  styleUrls: ['cover.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ZSocialCoverComponent implements OnInit {


  constructor(private userService: UserService) {
  }

  ngOnInit() {

  }
}
