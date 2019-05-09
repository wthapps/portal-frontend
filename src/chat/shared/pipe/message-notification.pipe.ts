import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'messageNotification'})
export class MessageNotificationPipe implements PipeTransform {

  transform(message: any, byMe: boolean) {
    let content: string;
    if (message) {
      switch (message.message_type) {
        case 'request':
          if (message.message.indexOf('created this conversation') > -1) {
            content = message.message;
          }
          break;
        case 'notification':
          if (message.message.indexOf('added into') > -1) {
            content = `${ byMe ? 'You' : message.user.name } added ${ message.receiver.name } into this conversation`;
          } else if (message.message.indexOf('removed from') > -1) {
            content = `${ byMe ? 'You' : message.user.name } removed ${ message.receiver.name } from this conversation`;
          } else if (message.message.indexOf('renamed the conversation') > -1) {
            content = `${ byMe ? 'You' : message.user.name } ${ message.message }`;
          }
          break;
        default:
          content = message.message;
      }
    }
    return content;
  }
}

