# homebridge-lirc-heater-cooler

[![Build and Lint](https://github.com/classLfz/homebridge-lirc-heater-cooler/actions/workflows/build.yml/badge.svg)](https://github.com/classLfz/homebridge-lirc-heater-cooler/actions/workflows/build.yml)

A homebridge plugin for lirc heater-cooler.

## install

Make sure you had installed homebridge first, then run the following command to install `homebridge-lirc-heater-cooler`.

```
sudo npm install -g homebridge-lirc-heater-cooler
```

## config

```json
{
	"accessory": "HomebridgeLircHeaterCooler",
	"name": "room air conditioner",
	// node lirc settings, if use default settings, it's not anecessary to add this.
	// https://www.npmjs.com/package/node-lirc
	"lirc": {
		"commands": {
			"lircd": "lircd",
			"irrecord": "irrecord",
			"irsend": "irsend",
			"unbuffer": "unbuffer"
		},
		"lirc_driver": "default",
		"lirc_conf": "/etc/lirc/lircd.conf",
		"lirc_pid": "/var/run/lirc/lircd.pid",
		"device": "/dev/lirc0",
		"tmp_dir": "tmp/",
		"remote": "MY_REMOTE"
	},
	"activeCommands": {
		"active": "TCL.AIRCON ON",
		"inactive": "TCL.AIRCON OFF"
	},
	"stateCommands": {
		"auto": "AIRCON AUTO",
		"heat": "AIRCON HEAT",
		"cool": "AIRCON COOL"
	},
	"heatTempsCommands": {
		// use a template command,
		"template": "THERMOSTAT TEMP_{tempNum}",
		// or list all temperature commands.
		"10": "THERMOSTAT TEMP_10",
		// ...
		"31": "THERMOSTAT TEMP_31"
	},
	"coolTempsCommands": {
		// use a template command,
		"template": "THERMOSTAT TEMP_{tempNum}",
		// or list all temperature commands.
		"10": "THERMOSTAT TEMP_10",
		// ...
		"31": "THERMOSTAT TEMP_31"
	}
}
```
