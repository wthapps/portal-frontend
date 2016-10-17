import { Injectable }    from '@angular/core';
import { ConfirmationService }    from '../index';

declare var _: any;

@Injectable()
export class DeactivateConfirmService {
  constructor(private confirmationService: ConfirmationService) {
  }

  activate(x: any, y: any) {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    if (!x || _.isEqual(x, y)) {
      return true;
    }
    let decides = new Promise<boolean>(resolve => {
      this.confirmationService.confirm({
        message: 'Leaving this page will lose your changes. Are you sure?',
        header: 'Discard changes?',
        accept: () => {
          return resolve(true);
        },
        reject: () => {
          return resolve(false);
        }
      });
    });
    return decides;
  }
}
