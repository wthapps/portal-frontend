import { Output, EventEmitter } from '@angular/core';
import { _wu } from '../../../core/shared/utils/utils';
import { Config } from '../../../core/shared/config/env.config';

declare let _: any;

export module _contact {

  export function isContactsHasLabelName(contacts: Object[], name: string): boolean {
    return _wu.every(contacts, (contact: any) => {
      return _.some(contact.labels, ['name', name]);
    });
  }

  export function removeLabelContactsByName(contacts: Object[], name: string) {
    _.forEach(contacts, (contact: any) => {
      _.remove(contact.labels, (label: any) => label.name === name);
    });
  }

  export function addLabelContacts(contacts: Object[], label: any) {
    _.forEach(contacts, (contact: any) => {
      contact.labels.push(label);
      contact.labels = _.unionBy(contact.labels, 'id');
    });
  }

  export function isInternal(data: any) {
    if (_.isArray(data) && data.length > 0) {
      return data[0].wthapps_user ? true : false;
    } else {
      return data.wthapps_user ? true : false;
    }
  }

  export function getSocialLink(uuid: string) {
    return `${Config.SUB_DOMAIN.SOCIAL}/profile/` + uuid;
  }

  export function getChatLink(uuid: string) {
    return `${Config.SUB_DOMAIN.CHAT}/conversations/` + uuid;
  }

  export function getSameLables(contacts: any): any {
    if (_.isArray(contacts) && contacts.length > 1) {
      let arr: any = [];
      let tmp = contacts[0].labels;
      for (let i = 1; i < contacts.length; i++) {
        if (contacts[i].labels.length == 0) return [];
        _.forEach(tmp, (label: any) => {
          let res = _.filter(contacts[i].labels, ['name', label.name]);
          if (!res || res.length == 0) {
            _.remove(arr, (item: any) => {
              return item.name == label.name;
            });
          }
          arr = _.concat(res, arr);
        });
        tmp = _.unionBy(arr, 'id');
      }
      return _.unionBy(tmp, 'id');
    }
    return [];
  }
}
