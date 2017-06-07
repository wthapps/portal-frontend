import { Component, Input, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray, AbstractControl, FormControl
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ApiBaseService } from '../../../shared/services/apibase.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-contact',
  templateUrl: 'contact.component.html'
})

export class PartialsProfileContactComponent {

}
