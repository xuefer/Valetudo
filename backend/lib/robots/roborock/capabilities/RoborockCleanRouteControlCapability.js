const CleanRouteControlCapability = require("../../../core/capabilities/CleanRouteControlCapability");

/**
 * @extends CleanRouteControlCapability<import("../RoborockValetudoRobot")>
 */
class RoborockCleanRouteControlCapability extends CleanRouteControlCapability {
    /**
     * @param {string} preset
     * @returns {Promise<void>}
     */
    async selectPreset(preset) {
        const matchedPreset = this.presets.find(p => {
            return p.name === preset;
        });

        if (matchedPreset) {
            await this.robot.sendCommand("set_mop_mode", [matchedPreset.value], {});
        } else {
            throw new Error("Invalid Preset");
        }
    }

    getProperties() {
        return {
            mopOnly: [
                RoborockCleanRouteControlCapability.ROUTE.INTENSIVE,
                RoborockCleanRouteControlCapability.ROUTE.DEEP,
            ],
            oneTime: []
        };
    }
}

module.exports = RoborockCleanRouteControlCapability;
