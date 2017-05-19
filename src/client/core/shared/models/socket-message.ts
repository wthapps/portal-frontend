interface SocketMessage {
  id: number;
  uuid: string;
  type: string;
  body: string;
  read: boolean;
  new: boolean;
}
