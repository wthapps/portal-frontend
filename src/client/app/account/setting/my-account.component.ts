import {Component}            from '@angular/core';
import {ROUTER_DIRECTIVES}    from '@angular/router';

import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators
}                             from '@angular/common';

import {UserService}          from '../../shared/services/user.service';
import {CustomValidators}     from '../../shared/validator/custom-validators';

import {AccountMenuComponent} from '../menu/account-menu.component';

@Component({
  moduleId: module.id,
  templateUrl: 'my-account.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    AccountMenuComponent,
    FORM_DIRECTIVES
  ],
  providers: [
    UserService
  ]
})

export class MyAccountComponent {
  pageTitle:string = 'Account setting';

  updateInfo:ControlGroup;

  constructor(private _userService:UserService,
              private _builder:FormBuilder) {
    this.updateInfo = _builder.group({
      first_name: [this._userService.profile.first_name,
        Validators.compose([Validators.required, CustomValidators.emailFormat])
      ],
      email: [this._userService.profile.email,
        Validators.compose([Validators.required, CustomValidators.emailFormat]),
        CustomValidators.duplicated
      ],
      email: [this._userService.profile.email,
        Validators.compose([Validators.required, CustomValidators.emailFormat]),
        CustomValidators.duplicated
      ],
      password: ['',
        Validators.compose([Validators.required])
      ]
    });
  }
}
