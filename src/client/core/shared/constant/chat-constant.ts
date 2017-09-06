export class ChatConstant {
  public static conversationUrl = '/conversations';
  public static searchUrl = '/search';
  public static searchNewContactsUrl = '/search_new_contacts';
  public static profileUrl = '/profile';
}

export const FORM_MODE = {
  CREATE: 'CREATE',
  EDIT: 'EDIT'
};

export let CHAT_ACTIONS: any = {
  TEXT_MESSAGE_CREATE: 'TEXT_MESSAGE_CREATE',

  CHAT_MESSAGE_COPY: 'CHAT_MESSAGE_COPY',
  CHAT_MESSAGE_QUOTE: 'CHAT_MESSAGE_QUOTE',
  CHAT_MESSAGE_EDIT:'CHAT_MESSAGE_EDIT',
  CHAT_MESSAGE_CREATE: 'CHAT_MESSAGE_CREATE',
  CHAT_MESSAGE_DELETE: 'CHAT_MESSAGE_DELETE',
  CHAT_MESSAGE_UPDATE: 'CHAT_MESSAGE_UPDATE',
  CHAT_MESSAGE_SEND_TEXT: 'CHAT_MESSAGE_SEND_TEXT',
  CHAT_MESSAGE_SEND_QUOTE: 'CHAT_MESSAGE_SEND_QUOTE',
  CHAT_MESSAGE_SEND_PHOTO: 'CHAT_MESSAGE_SEND_PHOTO',
  CHAT_MESSAGE_SEND_OTHER_FILE: 'CHAT_MESSAGE_SEND_OTHER_FILE',
  CHAT_MESSAGE_SEND_CONTACT: 'CHAT_MESSAGE_SEND_CONTACT',
  CHAT_MESSAGE_RESEND_CONTACT: 'CHAT_MESSAGE_RESEND_CONTACT',
  CHAT_MESSAGE_SEND_HYPERLINK: 'CHAT_MESSAGE_SEND_HYPERLINK',
  CHAT_MESSAGE_DOWNLOAD: 'CHAT_MESSAGE_DOWNLOAD',
  CHAT_MESSAGE_CANCEL: 'CHAT_MESSAGE_CANCEL',
  CHAT_MESSAGE_SEND_FAILED: 'CHAT_MESSAGE_SEND_FAILED',
  CHAT_MESSAGE_EDITED:'CHAT_MESSAGE_EDITED',

  CHAT_CONTACT_CREATE: 'CHAT_CONTACT_CREATE',
  CHAT_CONTACT_SEND_REQUEST: 'CHAT_CONTACT_SEND_REQUEST',
  CHAT_CONTACT_RESEND_REQUEST: 'CHAT_CONTACT_RESEND_REQUEST',
  CHAT_CONTACT_CANCEL_REQUEST: 'CHAT_CONTACT_CANCEL_REQUEST',
  CHAT_CONTACT_DELETE: 'CHAT_CONTACT_DELETE',

  MESSAGE_COPY: 'MESSAGE_COPY',
  MESSAGE_QUOTE: 'MESSAGE_QUOTE',
  MESSAGE_EDIT: 'MESSAGE_EDIT',
  MESSAGE_DELETE: 'MESSAGE_DELETE',
  MESSAGE_DOWNLOAD: 'MESSAGE_DOWNLOAD',
  MESSAGE_SEND: 'MESSAGE_SEND'
};
