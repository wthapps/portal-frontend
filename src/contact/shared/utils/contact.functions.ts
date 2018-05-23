import { _wu } from '../../../shared/shared/utils/utils';
import { Config } from '../../../shared/constant/config/env.config';
declare let _: any;

export module _contact {

  export function isContactsHasGroupName(contacts: Object[], name: string): boolean {
    return _wu.every(contacts, (contact: any) => {
      return _.some(contact.groups, ['name', name]);
    });
  }

  export function removeGroupContactsByName(contacts: Object[], name: string) {
    _.forEach(contacts, (contact: any) => {
      _.remove(contact.groups, (group: any) => group.name === name);
    });
  }

  export function addGroupContacts(contacts: Object[], group: any) {
    _.forEach(contacts, (contact: any) => {
      contact.groups.push(group);
      contact.groups = _.unionBy(contact.groups, 'id');
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
      let tmp = contacts[0].groups;
      for (let i = 1; i < contacts.length; i++) {
        if (contacts[i].groups.length == 0) return [];
        _.forEach(tmp, (group: any) => {
          let res = _.filter(contacts[i].groups, ['name', group.name]);
          if (!res || res.length == 0) {
            _.remove(arr, (item: any) => {
              return item.name == group.name;
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
