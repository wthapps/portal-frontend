import { BaseEvent } from '../../core/shared/event/base-event.d';

export class CommentCreateEvent implements BaseEvent {
  description: string = 'Event create a comment for post';
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}

export class CommentUpdateEvent implements BaseEvent {
  description: string = 'Event update a comment for post';
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}

export class OpenPhotoModalEvent implements BaseEvent {
  description: string = 'Open photo modal';
  data: any;

  constructor(data?: any) {
    this.data = data;
  }
}

export class ViewMoreCommentsEvent implements BaseEvent {
  description: string = 'View more comments';
  data: any;

  constructor(data?: any) {
    this.data = data;
  }
}

export class DeleteCommentEvent implements BaseEvent {
  description: string = 'Delete a comment';
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}

export class CancelEditCommentEvent implements BaseEvent {
  description: string = 'Cancel a edit comment';
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}

export class CancelAddCommentEvent implements BaseEvent {
  description: string = 'Cancel a edit comment';
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}

export class CancelReplyCommentEvent implements BaseEvent {
  description: string = 'Cancel a reply comment';
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}

export class ReplyCreateEvent implements BaseEvent {
  description: string = 'Event create a reply for post';
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}

export class ReplyUpdateEvent implements BaseEvent {
  description: string = 'Event update a reply for post';
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}

export class DeleteReplyEvent implements BaseEvent {
  description: string = 'Delete a reply';
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}

export class CancelEditReplyCommentEvent implements BaseEvent {
  description: string = 'Cancel edit a reply comment';
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}

