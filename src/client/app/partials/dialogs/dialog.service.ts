import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {
  /**
   * Information about a dialog.
   *
   * It has the following properties:
   * - `message` is a content of dialog
   * - `title` is a title of dialog
   * - `okText` is a text of ok
   * - `cancelText` is a title of cancel
   * - `longModal` is a type of dialog, if message is too many line.
   *
   */
  activate: (message?: string, title?: string, okText?: string, cancelText?: string, longModal?: boolean) => Promise<boolean>;

  confirm() {
    return this.activate('<p>Leaving this page will lose your changes. Are you sure?</p>', 'Confirm',
      'Leave this Page', 'Stay on this Page');
  }
}
