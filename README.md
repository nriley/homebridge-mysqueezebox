# homebridge-mysqueezebox
[Homebridge](https://github.com/nfarina/homebridge) plugin for sending commands to your Squeezebox or compatible through [MySqueezebox](http://mysqueezebox.com/) or [Logitech Media Server](http://wiki.slimdevices.com/index.php/Logitech_Media_Server").

This plugin exposes a Squeezebox as one or more HomeKit accessories which look like dimmable lightbulbs.  The way I use it, turning on a “light” starts something playing with an `oncommand`, and by default turning the "light" off will turn off the Squeezebox, though you can specify a different `offcommand` if you wish.  With Siri, it's relatively natural to say “Turn on *thing I want to listen to*”, and you can easily incorporate the Squeezebox in HomeKit scenes, for example if you want music to wake up/go to sleep by.  Adjust the lightbulb's brightness to control the Squeezebox’s playback volume.

As of version 0.0.3, you can either control your player via MySqueezebox (specify an `email` and `password`) or a local Logitech Media Server (specify a `serverurl`, embedding your username and password if you have one).  `playerid` is the MAC address of your Squeezebox, which you can find in the Player &gt; General section of MySqueezebox, or Settings &gt; Information on Logitech Media Server.

## Sample usage

Here are some anonymized snippets from my Homebridge `config.json`:

### MySqueezebox
```
    "accessories": [
        {
            "accessory": "MySqueezebox",
            "name": "Bedroom Line In",
            "playerid": "PLAYERID",
            "oncommand": ["setlinein", "linein"],
            "email": "EMAIL",
            "password": "PASSWORD"
        },
        {
            "accessory": "MySqueezebox",
            "name": "Bedroom Radio Paradise",
            "playerid": "PLAYERID",
            "oncommand": ["playlist","play","http://stream-dc1.radioparadise.com/mp3-192","Radio Paradise"],
            "email": "EMAIL",
            "password": "PASSWORD"
        },
```

### Logitech Media Server
```
    "accessories": [
        {
            "accessory": "MySqueezebox",
            "name": "Bedroom Line In",
            "playerid": "PLAYERID",
            "oncommand": ["setlinein", "linein"],
            "serverurl": "http://USERNAME:PASSWORD@LMSHOST:LMSPORT"
        },
        {
            "accessory": "MySqueezebox",
            "name": "Bedroom Radio Paradise",
            "playerid": "PLAYERID",
            "oncommand": ["playlist","play","http://stream-dc1.radioparadise.com/mp3-192","Radio Paradise"],
            "serverurl": "http://USERNAME:PASSWORD@LMSHOST:LMSPORT"
        },
```

If you're trying to figure out what to include for an `oncommand`, the JSON RPC interface used by this plugin is quite similar to the Logitech Media Server command-line interface; [this](http://htmlpreview.github.io/?https://github.com/Logitech/slimserver/blob/public/7.9/HTML/EN/html/docs/cli-api.html#Supported%20Commands) is a good reference.

Note that MySqueezebox website sends your email and password in clear text.  Don't use any password you care about, or use a local Logitech Media Server instead.

## Known issues
MySqueezebox cookies last for a year; the plugin doesn't attempt to deal with cookie expiration or re-login.
