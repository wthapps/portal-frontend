import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
} from '@angular/forms';

import { ReCaptchaComponent } from 'angular2-recaptcha/lib/captcha.component';


import { LoadingService } from '../../shared/shared/components/loading/loading.service';
import { ToastsService } from '../../shared/shared/components/toast/toast-message.service';
import { CustomValidator } from '../../shared/shared/validator/custom.validator';
import { fadeInAnimation } from '../../shared/shared/animations/route.animation';
import { ApiBaseService, UrlService } from "@shared/services";
import { Router, ActivatedRoute } from "@angular/router";

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-confirmation',
  templateUrl: 'confirmation.component.html',
  styleUrls: ['confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  constructor(private apiBaseService: ApiBaseService, private urlService: UrlService, private router: Router) {

  }
  ngOnInit() {
    this.apiBaseService.get(`users/confirmation?confirmation_token=${this.urlService.getId()}`).subscribe((res: any) => {
      if(res.data.verified) {
        this.router.navigate(["/settings/profile"], {queryParams: {verified: true}})
      } else {
        this.router.navigate(["/settings/profile?verified=false"])
      }
    })
  }
}
