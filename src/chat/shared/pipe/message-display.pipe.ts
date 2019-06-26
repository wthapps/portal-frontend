import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'messageDisplay'})
export class MessageDisplayPipe implements PipeTransform {

  transform(messages: any[], currentUser: any) {
    return messages.reduce((accumulator, currentMessage) => {
      if (currentMessage.status === 'pending') {
        accumulator.push(currentMessage);
        return accumulator;
      }
      // show time each message
      if (
        accumulator.length === 0 ||
        accumulator[accumulator.length - 1].user_id !== currentMessage.user_id ||
        !['text', 'file'].includes(accumulator[accumulator.length - 1].message_type)) {
        currentMessage.showInfo = true;
      } else {
        currentMessage.showInfo = false;
      }
      // show date
      if (
        accumulator.length === 0 ||
        new Date(accumulator[accumulator.length - 1].created_at).getDate() !==
        new Date(currentMessage.created_at).getDate()
      ) {
        currentMessage.showDate = true;
      } else {
        currentMessage.showDate = false;
      }
      currentMessage.byMe = currentMessage.user_id === currentUser.id;
      accumulator.push(currentMessage);
      return accumulator;
    }, []);
  }
}

