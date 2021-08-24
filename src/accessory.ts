import * as fs from 'fs'
import { AccessoryConfig, AccessoryPlugin, API, Logger, Service } from 'homebridge'
import { LircHeaterCoolerConfig, MANU_FACTURER, MODEL } from './settings'

const { version } = require('../package.json')
const nodeLIRC = require('node-lirc')

export class HeaterCoolerAccessory implements AccessoryPlugin {
	public readonly Service: typeof Service = this.api.hap.Service
	public readonly service: any
	public readonly informationService: Service
	public currentActive: number = 0
	public currentState: number = 0
	public targetState: number = 0
	public currentTemperature: number = 10
	public coolingThresholdTemperature: number = 10
	public heatingThresholdTemperature: number = 10
	public temperatureDisplayUnits: number = 0
	public swingMode: number = 0
	public rotationSpeed: number = 0

	constructor (
		public readonly log: Logger,
		public readonly config: AccessoryConfig,
		public readonly api: API
	) {
		this.log = log
		this.config = config
		this.api = api
		this.log.debug('initializing accessory with config: ', this.config)

		// initialize node lirc
		nodeLIRCInit(this.log, this.config.lirc)

		this.informationService = new this.api.hap.Service.AccessoryInformation()
			.setCharacteristic(this.api.hap.Characteristic.Manufacturer, MANU_FACTURER)
			.setCharacteristic(this.api.hap.Characteristic.Model, MODEL)
			.setCharacteristic(this.api.hap.Characteristic.SerialNumber, 'Version ' + version)

		this.service = new this.api.hap.Service.HeaterCooler(this.config.name)

		this.service.getCharacteristic(this.api.hap.Characteristic.Active)
			.onGet(this.handleActiveGet.bind(this))
			.onSet(this.handleActiveSet.bind(this))

		this.service.getCharacteristic(this.api.hap.Characteristic.CurrentHeaterCoolerState)
			.onGet(this.handleCurrentHeaterCoolerStateGet.bind(this))

		this.service.getCharacteristic(this.api.hap.Characteristic.CurrentTemperature)
			.onGet(this.handleCurrentTemperatureGet.bind(this))

		this.service.getCharacteristic(this.api.hap.Characteristic.TargetHeaterCoolerState)
			.onGet(this.handleTargetHeaterCoolerStateGet.bind(this))
			.onSet(this.handleTargetHeaterCoolerStateSet.bind(this))

		this.service.getCharacteristic(this.api.hap.Characteristic.CoolingThresholdTemperature)
			.onGet(this.handleCoolingThresholdTemperatureGet.bind(this))
			.onSet(this.handleCoolingThresholdTemperatureSet.bind(this))

		this.service.getCharacteristic(this.api.hap.Characteristic.HeatingThresholdTemperature)
			.onGet(this.handleHeatingThresholdTemperatureGet.bind(this))
			.onSet(this.handleHeatingThresholdTemperatureSet.bind(this))

		this.service.getCharacteristic(this.api.hap.Characteristic.TemperatureDisplayUnits)
			.onGet(this.handleTemperatureDisplayUnitsGet.bind(this))
			.onSet(this.handleTemperatureDisplayUnitsSet.bind(this))

		this.service.getCharacteristic(this.api.hap.Characteristic.SwingMode)
			.onGet(this.handleSwingModeGet.bind(this))
			.onSet(this.handleSwingModeSet.bind(this))

		this.service.getCharacteristic(this.api.hap.Characteristic.RotationSpeed)
			.onGet(this.handleRotationSpeedGet.bind(this))
			.onSet(this.handleRotationSpeedSet.bind(this))
	}

	getServices () {
		return [
			this.informationService,
			this.service
		]
	}

	/**
	 * active
	 */
	handleActiveGet () {
		this.log.info('Getting current active: ', this.currentActive)
		return this.currentActive
	}

	handleActiveSet (value: number) {
		this.log.info('Setting current active: ', value)
		const config = this.config as LircHeaterCoolerConfig
		const { active, inactive } = config.activeCommands
		const activeCommand = value ? active : inactive

		this.log.info('active command: ', activeCommand)

		nodeLIRC.send(activeCommand)
		this.currentActive = value
	}

	/**
	 * state
	 */
	handleCurrentHeaterCoolerStateGet () {
		this.log.info('Getting current heating cooling state: ', this.currentState)
		return this.currentState
	}

	handleTargetHeaterCoolerStateGet () {
		this.log.info('Getting target heating cooling state: ', this.targetState)
		return this.targetState
	}

	handleTargetHeaterCoolerStateSet (value: number) {
		this.log.info('Setting target heating cooling state to: ', value)
		const config = this.config as LircHeaterCoolerConfig
		if (!config.stateCommands) {
			this.log.error('stateCommands config not found.')
			return
		}
		const state = ['AUTO', 'HEAT', 'COOL'][value]
		const stateCommand = config.stateCommands[state]
		if (!state || !stateCommand) {
			this.log.debug('target state command not found.')
			return
		}

		this.log.info('state command: ', stateCommand)

		nodeLIRC.send(stateCommand)
		this.currentState = value
		this.targetState = value
	}

	/**
	 * temperature
	 */
	handleCurrentTemperatureGet () {
		this.log.info('Getting current temperature: ', this.currentTemperature)
		return this.currentTemperature
	}

	handleHeatingThresholdTemperatureGet () {
		this.log.info('Getting heating threshold temperature: ', this.heatingThresholdTemperature)
		return this.heatingThresholdTemperature
	}

	handleHeatingThresholdTemperatureSet (value: number) {
		this.log.info('Setting heating threshold temperature: ', value)
		const config = this.config as LircHeaterCoolerConfig
		const tempNum = parseInt(value.toString())
		// temp command template
		const tempCommand = config.heatTempsCommands.template
			? config.heatTempsCommands.template.replace(/\{tempNum\}/, tempNum.toString())
			: config.heatTempsCommands[tempNum]
		if (!tempCommand) {
			this.log.debug('tempature set command not found.')
			return
		}

		this.log.info('temp command: ', tempCommand)

		nodeLIRC.send(tempCommand)
		this.heatingThresholdTemperature = value
		this.currentTemperature = value
	}

	handleCoolingThresholdTemperatureGet () {
		this.log.info('Getting cooling threshold temperature: ', this.coolingThresholdTemperature)
		return this.coolingThresholdTemperature
	}

	handleCoolingThresholdTemperatureSet (value: number) {
		this.log.info('Setting cooling threshold temperature: ', value)
		const config = this.config as LircHeaterCoolerConfig
		const tempNum = parseInt(value.toString())
		// temp command template
		const tempCommand = config.coolTempsCommands.template
			? config.coolTempsCommands.template.replace(/\{tempNum\}/, tempNum.toString())
			: config.coolTempsCommands[tempNum]
		if (!tempCommand) {
			this.log.debug('tempature set command not found.')
			return
		}

		this.log.info('temp command: ', tempCommand)

		nodeLIRC.send(tempCommand)
		this.coolingThresholdTemperature = value
		this.currentTemperature = value
	}

	handleTemperatureDisplayUnitsGet () {
		this.log.info('Getting temperature display units :', this.temperatureDisplayUnits)
		return this.temperatureDisplayUnits
	}

	handleTemperatureDisplayUnitsSet (value: number) {
		this.log.info('Setting temperature display units to:', value)
		this.temperatureDisplayUnits = value
	}

	handleSwingModeGet () {
		this.log.info('Getting swing mode :', this.swingMode)
		return this.swingMode
	}

	handleSwingModeSet (value: number) {
		this.log.info('Setting swing mode to:', value)
		const config = this.config as LircHeaterCoolerConfig
		const modeCommand = value ? config.swingModeCommands.disabled : config.swingModeCommands.enabled
		if (!modeCommand) {
			this.log.debug('swing mode set command not found.')
			return
		}

		this.log.info('swing mode command: ', modeCommand)

		nodeLIRC.send(modeCommand)
		this.swingMode = value
	}

	handleRotationSpeedGet () {
		this.log.info('Getting rotation speed :', this.rotationSpeed)
		return this.rotationSpeed
	}

	handleRotationSpeedSet (value: number) {
		this.log.info('Setting rotation speed to:', value)
		const config = this.config as LircHeaterCoolerConfig
		const speedNum = parseInt(value.toString())
		// speed command template
		const speedCommand = config.rotationSpeedCommands.template
			? config.rotationSpeedCommands.template.replace(/\{speedValue\}/, speedNum.toString())
			: config.rotationSpeedCommands[speedNum]
		if (!speedCommand) {
			this.log.debug('rotation speed set command not found.')
			return
		}

		this.log.info('rotation speed command: ', speedCommand)

		nodeLIRC.send(speedCommand)
		this.rotationSpeed = value
	}
}

const nodeLIRCInit = (log: Logger, config?: any) => {
	if (config) {
		fs.writeFileSync('./config.json', JSON.stringify(config))
	}
	nodeLIRC.init()
	nodeLIRC.on('stdout', (event) => {
		log.info('nodeLIRC on stdout event: ' + event.instructions)
	})

	nodeLIRC.on('stderr', (data) => {
		log.info('irrecord output stderr: ' + data.toString())
	})

	nodeLIRC.on('exit', (code) => {
		log.info('irrecord exited with code ' + (code ? code.toString() : '(unknown)'))
	})
}
