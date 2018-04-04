import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';

@Injectable()
export class PromptUpdateService {

  constructor(private swUpdate: SwUpdate,
              private wthConfirmService: WthConfirmService) {
    swUpdate.available.subscribe(event => {
      console.debug('Should prompt user for updates');

      wthConfirmService.confirm({
        acceptLabel: 'Accept',
        rejectLabel: 'Cancel',
        message: 'There is a app version. Update now ?',
        header: 'Update Available',
        accept: () => {
          swUpdate.activateUpdate().then(() => document.location.reload());
        }
      })
    });
  }

  checkForUpdate() {
    if(!this.swUpdate.isEnabled)
      return;

    console.log('[App] checkForUpdate started');
    this.swUpdate.checkForUpdate()
      .then((res) => {
        console.log('[App] checkForUpdate completed', res)
      })
      .catch(err => {
        console.error(err);
      });
  }

  activateUpdate() {
    if(!this.swUpdate.isEnabled)
      return;

    console.log('[App] activateUpdate started')
    this.swUpdate.activateUpdate()
      .then(() => {
        console.log('[App] activateUpdate completed')
        // this.winRef.nativeWindow.location.reload();
      })
      .catch(err => {
        console.error(err);
      });
  }

}
