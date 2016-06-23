import {Injectable} from '@angular/core';

@Injectable()
export class WthConstants {
  // public static get MAX_A = '1234';
  public static Operation:Object = {
    update: 'update',
    edit: 'edit',
    //delete: 'delete',
    create: 'create',
    save: 'save',
    cancel: 'cancel'
  };

  public static String:Object = {
    operation: 'operation',
    jwt: 'jwt',
    profile: 'profile',
    logged_in: 'logged_in',
    next: 'next',
    prev: 'prev',
    c: 'c',
    u: 'u'
  };
}
