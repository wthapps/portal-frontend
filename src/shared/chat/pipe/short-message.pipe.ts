import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shortMessage' })
export class ShortMessagePipe implements PipeTransform {
  transform(conversation: any) {
    let result = '';
    const { latest_message, status } = conversation;
    const STATUSES = ['sent_request', 'pending'];
    if (STATUSES.includes(status)) {
      if (status === 'sent_request') {
        result = 'Pending request';
      } else {
        result = 'Sent you a request';
      }
    } else {
      const { message, message_type } = latest_message;

      if (message_type === 'share_contact_message') {
        result = 'Shared a contact';
      } else if (message_type === 'notification' && message.indexOf('added into conversation') > -1) {
        result = 'Added member';
      } else if (message_type === 'notification' && message.indexOf('removed from conversation') > -1) {
        result = 'Removed member';
      } else if (message_type === 'notification' && message.indexOf('left this conversation') > - 1) {
        result = 'Member left';
      } else if (message_type === 'notification' && message.indexOf('renamed the conversation') > - 1) {
        result = 'Renamed conversation';
      } else if (message_type === 'file') {
        result = 'Shared a file';
      } else if (message_type === 'message_deleted') {
        result = 'Deleted message';
      } else if (message_type === 'text') {
        result = message;
      } else {
        result = message;
      }
    }
    if (result === null || result === undefined) {
      result = '';
    }
    return result;
  }
}
