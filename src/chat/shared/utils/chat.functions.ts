declare let _: any;

export module _chat {
  export function combineMessages(currentMessages: any, newMessages: any): any {
    newMessages = _.uniqBy(newMessages, 'id');
    currentMessages = _.uniqBy(currentMessages, 'id');

    newMessages = _.concat(currentMessages, newMessages);
    newMessages = _.orderBy(newMessages, ['id'], ['asc']);

    return newMessages;
  }
}
