import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';

@Injectable()
export class PromptUpdateService {

  constructor(private swUpdate: SwUpdate,
              private wthConfirmService: WthConfirmService) {
    console.log('inside promp update service');
    swUpdate.available.subscribe(event => {
      console.log('Should prompt user for updates');

      this.confirmUpdate();
    });
  }

  checkForUpdate() {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    console.log('[App] checkForUpdate started');
    this.swUpdate.checkForUpdate()
      .then((res) => {
        console.log('[App] checkForUpdate completed', res);
        this.confirmUpdate();
      })
      .catch(err => {
        console.error(err);
      });
  }

  activateUpdate() {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    console.log('[App] activateUpdate started');
    this.swUpdate.activateUpdate()
      .then(() => {
        console.log('[App] activateUpdate completed');
        // this.winRef.nativeWindow.location.reload();
      })
      .catch(err => {
        console.error(err);
      });
  }

  private confirmUpdate() {
    this.wthConfirmService.confirm({
      acceptLabel: 'Accept',
      rejectLabel: 'Cancel',
      message: 'There is a newer app version. Update now ?',
      header: 'Update Available',
      accept: () => {
        this.swUpdate.activateUpdate().then(() => document.location.reload());
      }
    });
  }
}
