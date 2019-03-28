import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseEvent } from '@shared/base-event/base-event';
import {
  USER_CHAT_CREATE,
  USER_CHAT_REMOVE,
  USER_PROFILE_EDIT,
  USER_PROFILE_UPDATE,
  USER_PROFILE_VIEW
} from './user-event.constant';

@Injectable()
export class UserEventService extends BaseEvent {
  constructor() {
    super();
  }

  viewProfile(payload?: any) {
    this.broadcast(USER_PROFILE_VIEW, payload);
  }

  get viewProfile$(): Observable<any> {
    return this.on(USER_PROFILE_VIEW);
  }

  updateProfile(payload?: any) {
    this.broadcast(USER_PROFILE_UPDATE, payload);
  }

  get updateProfile$(): Observable<any> {
    return this.on(USER_PROFILE_UPDATE);
  }

  editProfile(payload?: any) {
    this.broadcast(USER_PROFILE_EDIT, payload);
  }

  get editProfile$(): Observable<any> {
    return this.on(USER_PROFILE_EDIT);
  }

  createChat(payload?: any) {
    this.broadcast(USER_CHAT_CREATE, payload);
  }

  get createChat$(): Observable<any> {
    return this.on(USER_CHAT_CREATE);
  }

  removeChat(payload?: any) {
    this.broadcast(USER_CHAT_REMOVE, payload);
  }

  get removeChat$(): Observable<any> {
    return this.on(USER_CHAT_REMOVE);
  }

}
