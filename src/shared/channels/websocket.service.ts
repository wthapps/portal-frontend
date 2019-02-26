import { Injectable } from '@angular/core';
import { Socket } from 'phoenix';
import { ConfigByEnv } from '@env/environment';

@Injectable()
export class WebsocketService {
  private socket: any;
  private conversation: any;
  private channels: Array<any> = [];

  createSocket(params: any) {

    if (this.socket) {
      return;
    }
    this.socket = new Socket(ConfigByEnv.CHAT_SOCKET, {
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

  subscribeChannel(channelName: string = 'user' || 'conversation', params: any): any {
    if (!this.socket) {
      console.log('Please createSocket');
      this.createSocket({token: params.token});
    }
    if (this.channels[channelName]) {
      return this.channels[channelName];
    } else {
      this.channels[channelName] = this.socket.channel(`${channelName}:${params.topic}`);
      return this.channels[channelName];
    }
  }

  getChannelByName(channelName: string = 'user' || 'conversation'): any {
    return this.channels[channelName];
  }

}
