import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Group } from './group.model';
import { BaseEntityService } from '../../shared/services/base-entity-service';
import { ApiBaseService } from '../../shared/services/apibase.service';

declare let _: any;
@Injectable()
export class GroupService extends BaseEntityService<Group> {
  groups$: Observable<Group[]>;

  private groupsSubject: BehaviorSubject<Group[]> = new BehaviorSubject<
    Group[]
  >([]);

  constructor(protected apiBaseService: ApiBaseService) {
    super(apiBaseService);
    this.url = 'contact/groups';

    this.groups$ = this.groupsSubject.asObservable();
  }

  // Change get all URL to support caching by SW
  getAll(options?: any, url?: any): Observable<any> {
    const path = url || `${this.url}/all`;
    return this.apiBaseService.post(path, options);
  }

  getAllGroups(): Promise<Group[]> {
    if (_.isEmpty(this.groupsSubject.getValue())) {
      return this.getAll()
        .toPromise()
        .then((res: any) => {
          let groups: Group[] = _.map(res.data, (l: any) =>
            this.mapGroupToMenuItem(l)
          );
          return this.notifyGroupObservers(groups);
        });
    }

    return this.notifyGroupObservers();
  }

  getAllGroupSyn() {
    return this.groupsSubject.getValue();
  }

  getAllGroupsAsync(): Observable<Group[]> {
    return this.groupsSubject.asObservable();
  }

  create(body: any): Observable<any> {
    return super.create(body).mergeMap((res: any) => {
      let group: any = this.mapGroupToMenuItem(res.data);
      return this.notifyGroupObservers(
        this.groupsSubject.getValue().concat([group])
      );
    });
  }

  update(body: any): Observable<any> {
    return super
      .update(body)
      .mergeMap((res: any) =>
        this.updateMenu(this.mapGroupToMenuItem(res.data))
      );
  }

  delete(id: any): Observable<any> {
    return super.delete(id).mergeMap((res: any) => this.removeMenu(res.data));
  }

  getGroupByName(name: string) {
    return _.find(this.groupsSubject.getValue(), (l: any) => l.name === name);
  }

  updateGroupCount(contacts: any[]) {
    let menus: any = {};
    for (let ci = 0; ci < contacts.length; ci++) {
      _.each(contacts[ci].groups, (l: any) => {
        if (!l) return;
        if (menus[`${l.name}`]) {
          menus[`${l.name}`].count += 1;
        } else {
          menus[`${l.name}`] = l;
          menus[`${l.name}`].count = 1;
        }
      });
    }

    // Update group count
    let cMenus = _.map(this.groupsSubject.getValue(), (m: any) => {
      if (menus[m.name])
        return Object.assign(m, { count: menus[m.name].count });
      else if (m.name === 'all contacts')
        return Object.assign(m, { count: contacts.length });
      else return Object.assign(m, { count: 0 });
    });

    this.notifyGroupObservers(cMenus);
  }

  setContactMenu(menus: any[]) {
    this.notifyGroupObservers(menus);
  }

  addGroup(group: Group) {
    this.addMenu(this.mapGroupToMenuItem(group));
  }

  addGroups(groups: Group[]) {
    let menus: any[] = this.groupsSubject.getValue();
    _.each(groups, (group: Group) => {
      // let menus: any[] = this.contactMenuSubject.getValue();
      // menus.push(menu);

      menus.push(this.mapGroupToMenuItem(group));
    });

    // this.notifyGroupObservers(menus);
  }

  addMenu(menu: any): Promise<any> {
    let menus: any[] = this.groupsSubject.getValue();
    menus.push(menu);
    return this.notifyGroupObservers(menus);
  }

  removeMenu(menu: any): Promise<any> {
    let menus: any[] = this.groupsSubject.getValue();
    _.remove(menus, (m: any) => m.id === menu.id);
    return this.notifyGroupObservers(menus);
  }

  removeMenuByName(menu: any): Promise<any> {
    let menus: any[] = this.groupsSubject.getValue();
    _.remove(menus, (m: any) => m.name === menu.name);
    return this.notifyGroupObservers(menus);
  }

  updateMenu(menu: any): Promise<any> {
    let menus: any[] = _.map(this.groupsSubject.getValue(), (m: any) => {
      if (m.id === menu.id) return Object.assign(m, menu);
      else return m;
    });

    return this.notifyGroupObservers(menus);
  }

  updateMenuName(menu: any): Promise<any> {
    let groups = this.groupsSubject.getValue();
    for (let i = 0; i < groups.length; i++) {
      if (menu.id == groups[i]['id']) {
        groups[i]['name'] = menu.name;
        break;
      }
    }
    return this.notifyGroupObservers(groups);
  }

  notifyGroupObservers(
    groups: Group[] = this.groupsSubject.getValue()
  ): Promise<any[]> {
    let orderedGroups = _.orderBy(groups, ['order'], ['asc']);
    this.groupsSubject.next(orderedGroups);

    return Promise.resolve(this.groupsSubject.getValue());
  }

  filterGroup(query: string, groups: any[]) {
    let filtered: any[] = [];
    for (let i = 0; i < groups.length; i++) {
      let group = groups[i];
      if (group.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(group.name);
      }
    }
    return filtered;
  }

  private mapGroupToMenuItem(group: Group): any {
    return {
      id: group.id,
      name: group.name,
      link: '/contacts',
      hasSubMenu: !group.system,
      system: group.system,
      count: 0,
      order: group.system ? group.order : 100 + group.order,
      icon:
        group.name === 'all contacts'
          ? 'fa fa-address-book-o'
          : group.name === 'favourite'
            ? 'fa fa-star'
            : group.name === 'groups'
              ? 'fa fa-users'
              : group.name === 'blacklist'
                ? 'fa fa-ban'
                : group.name === 'social'
                  ? 'fa fa-globe'
                  : group.name === 'chat' ? 'fa fa-comments-o' : 'fa fa-folder-o'
    };
  }
}
