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
      const { message, message_type, message_sub_type } = latest_message;

      if (message_type === 'share_contact_message') {
        result = 'Contact shared';
      } else if (message_type === 'notification' && message_sub_type === 'conversation_member_add') {
        result = 'Member added';
      } else if (message_type === 'notification' && message_sub_type === 'conversation_member_remove') {
        result = 'Member removed';
      } else if (message_type === 'notification' && message_sub_type === 'conversation_member_leave') {
        result = 'Member left';
      } else if (message_type === 'notification' && message_sub_type === 'conversation_rename') {
        result = 'Conversation renamed';
      } else if (message_type === 'request' && message_sub_type === 'conversation_create') {
        result = 'New conversation';
      } else if (message_type === 'request' && message_sub_type === 'conversation_connect') {
        result = '';
      } else if (message_type === 'file') {
        result = 'File shared';
      } else if (message_type === 'message_deleted') {
        result = 'Message deleted';
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
