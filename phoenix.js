module.exports = function(RED) {
  function PhoenixNode(config) {
    RED.nodes.createNode(this,config);
    var node = this;
    
    node.on('input', function(msg) {
        msg.payload = msg.payload.toLowerCase();
        node.send(msg);
    });

    const { Socket } = require("phoenix-channels");
    //let socket = new Socket("https://192.168.1.113:4445/socket");
    let socket = new Socket("wss://suprabonds.com/socket/websocket?token=undefined");
    socket.connect();
    let channel = socket.channel("room:lobby", {});
    console.log("hello from phoenix node");
    channel.on("new_msg", payload => {
      node.send({"payload": payload});
    });
    channel.join()
      .receive("ok", resp => { node.send({"payload": resp}) })
      .receive("error", resp => { node.send({"payload": "Unable to join"}) })
  }

  RED.nodes.registerType("phoenix",PhoenixNode);
}

