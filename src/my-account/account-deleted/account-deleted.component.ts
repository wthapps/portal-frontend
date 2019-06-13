import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-deleted',
  templateUrl: './account-deleted.component.html',
  styleUrls: ['account-deleted.component.scss']
})
export class AccountDeletedComponent implements OnInit {
  email: String = 'account@email.com';

  constructor(route: ActivatedRoute) {
    route.queryParamMap.forEach(paramMap => {
      this.email = paramMap.get('email');
    });
  }

  ngOnInit() {}
}
