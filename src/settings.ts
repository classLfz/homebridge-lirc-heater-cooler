import { AccessoryConfig } from 'homebridge'

export const ACCESSORY_NAME = 'HomebridgeLircHeaterCooler'

export const MANU_FACTURER = 'homebridge lirc heater-cooler'

export const MODEL = 'RespberryPI LIRC HeaterCooler'

export const DEFAULT_DEBOUNCE_TIME = 1000

export interface LircHeaterCoolerConfig extends AccessoryConfig {
	lirc: {
		commands: {
			lircd: string,
			irrecord: string,
			irsend: string
		},
		'lirc_driver': string,
		'lirc_conf': string,
		'lirc_pid': string,
		device: string,
		'tmp_dir': string,
		remote: string
	},
	activeCommands: {
		active: string,
		inactive: string,
	},
	stateCommands: {
		auto: string,
		heat: string,
		cool: string,
	},
	heatTempsCommands: {
		template: string,
		[temp: string]: string,
	},
	coolTempsCommands: {
		template: string,
		[temp: string]: string,
	},
	swingModeCommands: {
		disabled: string,
		enabled: string,
	},
	rotationSpeedCommands: {
		template: string,
		[value: string]: string,
	}
}
