import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

import { CableService } from './cable.service';
import { UserService } from '../services/user.service';
import { ServiceManager } from '../services/service-manager';
import { Subject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

declare let ActionCable: any;
declare let App: any;
declare let $: any;

@Injectable()
export class NoteChannelService extends CableService {
  profile;
  editing_user;
  lock$: Observable<any>;
  reload$: Observable<any>;

  private reloadSubject: Subject<any> = new Subject();
  private lockSubject: Subject<any> = new Subject();

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private serviceManager: ServiceManager
  ) {
    super();
    this.profile = this.userService.getSyncProfile();
    this.lock$ = this.lockSubject.asObservable();
    this.reload$ = this.reloadSubject.asObservable();
  }

  subscribe(uuid) {
    console.log('subscribe channel for note: ', uuid);

    if (!uuid) { return; }
    if (this.userService.loggedIn && this.profile) {
      this.createConnectionInstance(this.profile.uuid);

      App[`note_${uuid}`] = App.cable.subscriptions.create(
        { channel: 'NoteChannel', note_uuid: uuid},
        {
          connected: () => {
            return this.install();
          },
          // Called when the WebSocket connection is closed
          disconnected: () => {
            return this.uninstall();
          },
          // Called when the subscription is rejected by the server
          rejected: () => {
            return this.uninstall();
          },
          idle: function({ user_uuid, user_name, note_uuid }) {
            // Calls `this.NoteChannel#idle` on the server
            return this.perform('idle', { user_uuid, user_name, note_uuid });
          },
          editing: function({ user_uuid, user_name, note_uuid }) {
            // Calls `this.NoteChannel#editing` on the server
            return this.perform('editing', { user_uuid, user_name, note_uuid });
          },
          received: (data: any) => {
            // console.log('received', data);
            const { action, user_uuid, user_name, note_uuid } = data;
            if (!user_uuid || !note_uuid) {
              return;
            }

            switch (action) {
              case 'editing': {
                this.editing_user = { user_uuid, user_name, note_uuid};
                if (this.profile.uuid !== user_uuid) {
                  this.lockSubject.next({user_uuid, user_name});
                }
                break;
              }
              case 'idle': {
                if (this.editing_user.user_uuid === user_uuid) {
                  this.editing_user = {};
                }
                if (this.profile.uuid !== user_uuid) {
                  this.lockSubject.next({});
                }
                break;
              }
              case 'notify_update': {
                if (this.profile.uuid !== user_uuid) {
                  this.reloadSubject.next('');
                }
                break;
              }
              default: {
              }
            }
          }
        }
      );
    }
  }

  unsubscribe(note_uuid) {
    if (App[`note_${note_uuid}`]) { App[`note_${note_uuid}`].unsubscribe(); }
  }

  install() {
    console.log('installing ...', App);
  }

  uninstall() {
    console.log('uninstalling ...');
  }

  editing( note_uuid) {
    const {uuid, name} = this.profile;
    if (!App[`note_${note_uuid}`]) { return; }
    App[`note_${note_uuid}`].editing({ user_uuid: uuid, user_name: name, note_uuid });
  }

  idle(note_uuid) {
    const {uuid, name} = this.profile;
    if (!App[`note_${note_uuid}`]) { return; }
    App[`note_${note_uuid}`].idle({ user_uuid: uuid, user_name: name, note_uuid });
  }
}
