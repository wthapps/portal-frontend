// import * as TestApplication from './app.cable';
declare let App: any;
//
console.log('apppppp', App);
// App.notifications = App.cable.subscriptions.create('ChatroomsChannel', {
//   received: function(response: any) {
//     console.log('response', response);
//   },
//   sendMessage: (chatroom_id: number, message: string) => {
//     console.log("send_message", this);
//     this.perform('send_message',{chatroom_id: 3, body: 'hello world'});
//   }
// });
// App.notifications = App.cable.subscriptions.create("ChatroomsChannel", {

(function() {

    App.notifications = App.cable.subscriptions.create('NotificationsChannel', {

    connected: function() {},
    disconnected: function() {},
    received: function(response: any) {
      console.log('response', response);
    },
    sendMessage: function(chatroom_id: any, message: any) {
      return this.perform('send_message', {
        chatroom_id: chatroom_id,
        body: message
      });
    }
  });

}).call(this);
