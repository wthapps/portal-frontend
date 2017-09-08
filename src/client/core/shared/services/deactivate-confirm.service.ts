import { Injectable }    from '@angular/core';

declare var _: any;

@Injectable()
export class DeactivateConfirmService {
  constructor() {
  }

  activate(x: any, y: any): any {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    if (!x || _.isEqual(x, y)) {
      return true;
    }
    let decides: any = null;
    // let decides = new Promise<boolean>(resolve => {
    //   this.confirmationService.confirm({
    //     message: 'Leaving this page will lose your changes. Are you sure?',
    //     header: 'Discard changes?',
    //     accept: () => {
    //       return resolve(true);
    //     },
    //     reject: () => {
    //       return resolve(false);
    //     }
    //   });
    // });
    return decides;
  }
}
