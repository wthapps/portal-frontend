import { Component, OnInit, Input, ViewEncapsulation, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';


import { UserService } from '@wth/shared/services';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import { LoadingService } from '../../../shared/components/loading/loading.service';
import { ApiBaseService } from '../../../services/apibase.service';
import { CommonEventService } from '../../../services/common-event/common-event.service';
import { CustomValidator } from '@shared/shared/validator/custom.validator';
import { WModalService } from '@shared/modal/w-modal-service';


@Component({
  selector: 'w-user-cover-info',
  templateUrl: 'cover-info.component.html',
  styleUrls: ['cover-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CoverInfoComponent implements OnInit {
  @Input() user: any;
  @Input() editable = true;
  @Input() nameOnly = false;
  @ViewChild('modal') modal: BsModalComponent;
  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOpenModal: EventEmitter<any> = new EventEmitter<any>();

  destroySubject: Subject<any> = new Subject<any>();

  userForm = this.fb.group({
    firstName: ['', [Validators.required, CustomValidator.blanked]],
    lastName: ['', [Validators.required, CustomValidator.blanked]],
    nickName: [''],
  });

  constructor(
    private fb: FormBuilder,
    private modalService: WModalService,
    private loadingService: LoadingService,
    private apiBaseService: ApiBaseService,
    private userService: UserService,
    private toastsService: ToastsService,
    private commonEventService: CommonEventService
    ) {
      this.handleSelectCropEvent();

    }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  openModal() {
    this.onOpenModal.emit({modalName: 'NameEditModal', user: this.user});
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit(values: any): void {

  }




  changeProfileImage(event: any): void {
    event.preventDefault();
    // this.uploadProfile.modal.open();
    this.commonEventService.broadcast({channel: 'SELECT_CROP_EVENT',
     action: 'SELECT_CROP:OPEN', payload: {currentImage: this.userService.getSyncProfile().profile_image} });

  }

  handleSelectCropEvent() {
    this.commonEventService.filter((event: any) => event.channel === 'SELECT_CROP_EVENT')
      .takeUntil(this.destroySubject)
      .subscribe((event: any) => {
        this.doEvent(event);
      });
  }


  doEvent(event: any) {
    // console.log(event);
    switch (event.action) {
      case 'SELECT_CROP:DONE':
        // Change user profile
        if (!event.card) {
          this.updateProfileImageBase64(event.payload);
        }
        break;
      default:
        break;
    }
  }

  updateProfileImageBase64(img: string): void {
    this.updateUser(JSON.stringify({image: img}));
  }

  private createUserForm(nameOnly: boolean): FormGroup {
    if (nameOnly) {
      return this.fb.group({
        firstName: ['', [Validators.required, CustomValidator.blanked]],
        lastName: ['', [Validators.required, CustomValidator.blanked]],
      });
    } else {
      return this.fb.group({
        firstName: ['', [Validators.required, CustomValidator.blanked]],
        lastName: ['', [Validators.required, CustomValidator.blanked]],
        nickName: [''],
      });
    }
  }

  private updateUser(body: string): void {
    this.userService.update(body)
      .subscribe((result: any) => {
          // stop loading
          this.loadingService.stop();
          this.toastsService.success(result.message);

          //  reload profile image
          // $('img.lazyloaded').addClass('lazyload');
        },
        error => {
          // stop loading
          this.loadingService.stop();
          this.toastsService.danger(error);
          console.log(error);
        }
      );
  }
}
