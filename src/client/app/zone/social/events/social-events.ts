export class CommentCreateEvent implements BaseEvent {
  description:string = 'Event create a comment for post';
  data: any;
  constructor(data) {
    this.data = data;
  }
}

export class PhotoModalEvent implements BaseEvent {
  description:string = 'Open photo modal';
}
