import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseEvent } from '@shared/base-event/base-event';
import {
  NOTIFICATION_MARK_AS_READ,
  NOTIFICATION_MARK_ALL_AS_READ,
  NOTIFICATION_MARK_ALL_AS_UNREAD,
  NOTIFICATION_INCREASE_COUNT,
  NOTIFICATION_UPDATE_COUNT
} from './notification-event.constant';

@Injectable()
export class NotificationEventService extends BaseEvent {
  constructor() {
    super();
  }

  markAsRead(payload?: any) {
    this.broadcast(NOTIFICATION_MARK_AS_READ, payload);
  }

  get markAsRead$(): Observable<any> {
    return this.on(NOTIFICATION_MARK_AS_READ);
  }

  markAllAsRead(payload?: any) {
    this.broadcast(NOTIFICATION_MARK_ALL_AS_READ, payload);
  }

  get markAllAsRead$(): Observable<any> {
    return this.on(NOTIFICATION_MARK_ALL_AS_READ);
  }

  markAllAsUnRead(payload?: any) {
    this.broadcast(NOTIFICATION_MARK_ALL_AS_UNREAD, payload);
  }

  get markAllAsUnRead$(): Observable<any> {
    return this.on(NOTIFICATION_MARK_ALL_AS_UNREAD);
  }

  updateNotificationCount(payload?: any) {
    this.broadcast(NOTIFICATION_UPDATE_COUNT, payload);
  }

  get updateNotificationCount$(): Observable<any> {
    return this.on(NOTIFICATION_UPDATE_COUNT);
  }
}
