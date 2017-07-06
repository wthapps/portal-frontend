import { Component, OnInit } from '@angular/core';
import { ZContactService } from '../../shared/services/contact.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'z-contact-detail',
  templateUrl: 'contact-detail.component.html'
})
export class ZContactDetailComponent implements OnInit {
  data: any = [];

  constructor(private contactService: ZContactService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      console.log(params);
    });
  }
}
