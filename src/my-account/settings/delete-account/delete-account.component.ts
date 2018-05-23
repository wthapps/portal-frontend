import { Component, OnInit } from '@angular/core';
import { LoadingService } from "@shared/shared/components/loading/loading.service";
import { UserService } from "@shared/services";
import { ToastsService } from "@shared/shared/components/toast/toast-message.service";
import { WthConfirmService } from "@shared/shared/components/confirmation/wth-confirm.service";

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent {

  constructor(private loadingService: LoadingService, private userService: UserService,
    private toastsService: ToastsService, private wthConfirmService: WthConfirmService) { }

  onDelete(): void {
    let bodyText = `If you don't think you will not use WTHapps again and would like to delete you account,<br>
     we will take care of that for you.<br>
     Your account adn all details will be deleted after 14 days. If you change your mind <br>
     within 14 days - log back in to restore your account
     If you still want to delete your account, click "Delete My Account". <br>`;
    let body = JSON.stringify({permanent_deleted: true});

    this.wthConfirmService.confirm({
      message: bodyText,
      header: 'Delete Account',
      accept: () => {
        this.loadingService.start();
        this.userService.update(body)
          .subscribe((response: any) => {
              this.toastsService.success(response.message);
              this.loadingService.stop();
              this.userService.logout('users/sign_out')
                .subscribe(
                  response => {
                    // this.userService.deleteUserInfo();
                    // this.appearancesChannelService.unsubscribe();
                    // this.router.navigate(['/login']);
                  },
                  error => {
                    // this.userService.deleteUserInfo();
                    // this.router.navigate(['/login']);
                    // console.log('logout error', error);
                  }
                );
            },
            error => {
              this.toastsService.danger(error);
              this.loadingService.stop();
            });
      }
    });
  }
}
