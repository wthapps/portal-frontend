import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BsModalComponent } from 'ng2-bs3-modal';
import { MessageService } from 'primeng/api';

import { UserService } from '@shared/services';
import { PasswordConfirmationModalComponent } from '@shared/modals/password-comfirmation';
import { Constants } from '@shared/constant';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html'
})
export class DeleteAccountComponent implements OnInit {
  @ViewChild('passwordConfirmationModal') passwordConfirmationModal: PasswordConfirmationModalComponent;
  @ViewChild('deleteAccountModal') deleteAccountModal: BsModalComponent;


  readonly host: string = Constants.baseUrls.app;
  successful = false;
  constructor(private router: Router, private userService: UserService, private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.deleteAccountModal.onDismiss.subscribe(response => {
      this.goToLoginPage();
    });
  }

  openPasswordConfirmationModal() {
    this.passwordConfirmationModal.open();
  }

  delete(payload: any): void {
    this.userService.deleteAccount(payload.password).subscribe(
(response: any) => {
        this.successful = true;
        this.userService.logout('users/sign_out')
          .subscribe(
            res => {
              this.deleteAccountModal.open();

            },
            error => {
              this.deleteAccountModal.open();
            }
          );
      },
      error => {
        this.successful = false;
        this.deleteAccountModal.open();
      });
  }

  submit() {
    this.goToLoginPage();
    this.deleteAccountModal.close();
  }

  private goToLoginPage() {
    if (this.successful) {
      window.location.href = this.host + '/login';
    }
  }
  private showErrorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Deletion failed',
      detail: 'An error occurred during the process. Please try again later.'
    });
  }
}
