var request = require("request");
var jar = request.jar();
request = request.defaults({jar: jar, followRedirect: false});
var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-mysqueezebox", "MySqueezebox", MySqueezeboxAccessory);
}

function MySqueezeboxAccessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.email = config["email"];
  this.password = config["password"];
  this.playerid = config["playerid"];
  this.oncommand = config["oncommand"];
  this.offcommand = config["offcommand"] || ["power", "0"];

  this.service = new Service.Switch(this.name);

  this.service
    .getCharacteristic(Characteristic.On)
    .on('set', this.setOn.bind(this));
}

MySqueezeboxAccessory.prototype.login = function(callback) {
  // XXX cookies last for a year; don't bother trying to handle expiration
  if (jar.getCookieString("http://mysqueezebox.com")) {
    callback(null);
    return;
  }

  request.get("http://mysqueezebox.com/user/login", {
    form: {email: this.email, password: this.password}
  }, function(err, response, body) {
    if (!err) {
      this.log.debug(jar.getCookieString("http://mysqueezebox.com"));
      callback(null);
    } else {
      this.log.error("MySqueezebox error '%s'. Response: %s", err, body);
      callback(err || new Error("Failed to log into MySqueezebox."));
    }
  }.bind(this));
}

MySqueezeboxAccessory.prototype.command = function(command, callback) {
  var rpc = {id: 1, method: "slim.request", params: [this.playerid, command]};

  request.post({
    url: "http://mysqueezebox.com/jsonrpc.js",
    json: rpc
  }, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      this.log.info("MySqueezebox JSON RPC complete: " + JSON.stringify(rpc));
      callback(null);
    } else {
      this.log.error("MySqueezebox error '%s'. Response: %s", err, body);
      callback(err || new Error("MySqueezebox error occurred."));
    }
  }.bind(this));
}

MySqueezeboxAccessory.prototype.setOn = function(on, callback) {
  this.log.debug("MySqueezebox on: " + on);
  this.login(function(status) {
    if (status) {
      callback(status);
      return;
    }

    var onoff = function(status) {
      if (status) {
        callback(status);
        return;
      }
      this.command(on ? this.oncommand : this.offcommand, callback);
    }.bind(this);

    if (on)
      this.command(["power", "1"], onoff);
    else
      onoff(null);
  }.bind(this));
}

MySqueezeboxAccessory.prototype.getServices = function() {
  return [this.service];
}
