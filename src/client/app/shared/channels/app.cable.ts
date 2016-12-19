declare let ActionCable: any;

(function() {
  this.App || (this.App = {});
  ActionCable.startDebugging();

  // App.cable = ActionCable.createConsumer("ws://localhost:7474/cable");

  App.cable = ActionCable.createConsumer("ws://localhost:4000/cable");

}).call(this);



