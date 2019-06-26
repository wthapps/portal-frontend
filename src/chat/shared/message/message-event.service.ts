import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  MESSAGE_COPY,
  MESSAGE_DELETE, MESSAGE_EDIT,
  MESSAGE_QUOTE,
  MESSAGE_UPDATE,
  MESSAGE_PREVIEW,
  MESSAGE_DOWNLOAD
} from '@chat/shared/message/message-event.constant';
import { EventData } from '@shared/base-event';

@Injectable()
export class MessageEventService {
  private eventSubject: Subject<EventData>;

  constructor() {
    this.eventSubject = new Subject<EventData>();
  }

  preview(payload?: { message: any }) {
    this.broadcast(MESSAGE_PREVIEW, payload);
  }

  get preview$(): Observable<any> {
    return this.on(MESSAGE_PREVIEW);
  }

  edit(payload: { message?: any }) {
    this.broadcast(MESSAGE_EDIT, payload);
  }

  get edit$(): Observable<any> {
    return this.on(MESSAGE_EDIT);
  }

  update(payload: { message?: any }) {
    this.broadcast(MESSAGE_UPDATE, payload);
  }

  get update$(): Observable<any> {
    return this.on(MESSAGE_UPDATE);
  }

  copy(payload: { message?: any }) {
    this.broadcast(MESSAGE_COPY, payload);
  }

  get copy$(): Observable<any> {
    return this.on(MESSAGE_COPY);
  }

  quote(payload: { message?: any }) {
    this.broadcast(MESSAGE_QUOTE, payload);
  }

  get quote$(): Observable<any> {
    return this.on(MESSAGE_QUOTE);
  }

  download(payload: { message?: any }) {
    this.broadcast(MESSAGE_DOWNLOAD, payload);
  }

  get download$(): Observable<any> {
    return this.on(MESSAGE_DOWNLOAD);
  }

  delete(payload: { message?: any }) {
    this.broadcast(MESSAGE_DELETE, payload);
  }

  get delete$(): Observable<any> {
    return this.on(MESSAGE_DELETE);
  }

  private broadcast(key: any, payload) {
    this.eventSubject.next({ key: key, payload: payload });
  }

  private on(key: any): Observable<any> {
    return this.eventSubject.asObservable().pipe(
      filter(event => event.key === key),
      map(event => event.payload)
    );
  }
}
