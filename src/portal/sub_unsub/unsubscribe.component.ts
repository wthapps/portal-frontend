import { Component, OnInit } from '@angular/core';
import { ApiBaseService } from '../../shared/services/apibase.service';


@Component({
  moduleId: module.id,
  templateUrl: 'unsubscribe.component.html'
})

export class UnSubscribeComponent implements OnInit {
  constructor(private apiBaseService: ApiBaseService) {}
  ngOnInit() {
    this.apiBaseService.put('users/users', {subscribed: false}).subscribe((res:any) => {
      console.log(res);
    });
  }
}
