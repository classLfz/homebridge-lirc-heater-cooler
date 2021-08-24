import { API } from 'homebridge'

import { ACCESSORY_NAME } from './settings'
import { HeaterCoolerAccessory } from './accessory'

export = (api: API) => {
	api.registerAccessory(ACCESSORY_NAME, HeaterCoolerAccessory)
}
