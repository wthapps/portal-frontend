import { Injectable } from '@angular/core';
import { Socket } from 'phoenix';
import { ConfigByEnv } from '@env/environment';

@Injectable()
export class WebsocketService {
  private socket: any;
  private conversation: any;
  userChannel: any;

  createSocket(params: any) {

    if (this.socket) {
      return;
    }
    this.socket = new Socket(ConfigByEnv.SOCKET_API, {
      params: params,
      logger: (kind, msg, data) => {
        // console.log(`SOCKET CONNECTED::: ${kind}: ${msg}`, data);
      }
    });
    this.socket.connect();
  }

  get getSocket() {
    return this.socket;
  }

  joinConversation(socket: any, conversationId: string) {
    if (!socket) {
      return false;
    }

    this.conversation = socket.channel(``);
  }

  leaveConversation(socket: any, conversationId: string) {

  }

  subscribeChannel(topic: string, options: any): any {
    // console.log('SOCKET CHANNELS:::', this.socket.channels);
    if (!this.socket) {

      this.createSocket({token: options.token});
    }
    return this.socket.channel(topic, {token: options.token});
  }

  connectUserChannel(userId: string): any {
    const params = {token: userId };
    if (!this.socket) {
      this.createSocket(params);
    }
    this.userChannel = this.socket.channel(`user:${userId}`, params);
    this.userChannel.join({token: 'test token'})
      .receive('ok', ({userInfo}) => {
        // console.log('JOINED USER CHANNEL', userInfo);
      })
      .receive('error', ({reason}) => {})
      .receive('timeout', () => {});
  }
}
