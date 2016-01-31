# homebridge-mysqueezebox
[Homebridge](https://github.com/nfarina/homebridge) plugin for sending commands through [MySqueezebox](http://mysqueezebox.com/).

This plugin exposes your Squeezebox as a set of switches.  The way I use it, turning on a "switch" starts something playing, and by default turning off a switch will turn off the Squeezebox, though you can specify a different `offcommand` if you wish.  With Siri, it's pretty natural to say "Turn on (thing I want to listen to)", and you can easily connect the Squeezebox to HomeKit scenes, for example if you want music to wake up/go to sleep by.

## Sample usage
```
    "accessories": [
        {
            "accessory": "MySqueezebox",
            "name": "Line In",
            "playerid": "PLAYERID",
            "oncommand": ["setlinein", "linein"],
            "email": "EMAIL",
            "password": "PASSWORD"
        },
        {
            "accessory": "MySqueezebox",
            "name": "Radio Paradise",
            "playerid": "PLAYERID",
            "oncommand": ["playlist","play","http://stream-dc1.radioparadise.com/mp3-192","Radio Paradise"],
            "email": "EMAIL",
            "password": "PASSWORD"
        },
```

`playerid` is the MAC address of your Squeezebox.

MySqueezebox's JSON RPC interface is quite similar to the Logitech Media Server command-line; [this](http://htmlpreview.github.io/?https://github.com/Logitech/slimserver/blob/public/7.7/HTML/EN/html/docs/cli-api.html#Supported%20Commands) is a good reference.

Note that MySqueezebox website sends your email and password in clear text.  Don't use any password you care about.

## Known issues
MySqueezebox cookies last for a year; the plugin doesn't attempt to deal with cookie expiration or re-login.
