const NotImplementedError = require("../NotImplementedError");
const PresetSelectionCapability = require("./PresetSelectionCapability");

/**
 * @template {import("../ValetudoRobot")} T
 * @extends PresetSelectionCapability<T>
 */
class CleanRouteControlCapability extends PresetSelectionCapability {
    /**
     * @abstract
     * @param {string} preset
     * @returns {Promise<void>}
     */
    async selectPreset(preset) {
        throw new NotImplementedError();
    }

    /**
     * @returns {{supportedRoutes: Array<CleanRouteControlCapabilityRoute>, mopOnly: Array<CleanRouteControlCapabilityRoute>, oneTime: Array<CleanRouteControlCapabilityRoute>}}
     */
    getProperties() {
        return {
            supportedRoutes: [],
            mopOnly: [],
            oneTime: []
        };
    }

    /**
     * @returns {string}
     */
    getType() {
        return CleanRouteControlCapability.TYPE;
    }
}

CleanRouteControlCapability.TYPE = "CleanRouteControlCapability";

module.exports = CleanRouteControlCapability;
