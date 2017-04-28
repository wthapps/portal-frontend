import { Component, OnInit } from '@angular/core';
import { ApiBaseService } from '../../core/shared/services/apibase.service';


@Component({
  moduleId: module.id,
  templateUrl: 'subscribe.component.html'
})

export class SubscribeComponent implements OnInit {
  constructor(private apiBaseService: ApiBaseService) {}

  ngOnInit() {
    this.apiBaseService.put('users/users', {subscribed: true}).subscribe((res:any) => {
      console.log(res);
    });
  }
}
