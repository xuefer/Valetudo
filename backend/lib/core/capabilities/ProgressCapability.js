const Capability = require("./Capability");
const NotImplementedError = require("../NotImplementedError");
const ValetudoProgress = require("../../entities/core/ValetudoProgress");

/**
 * @template {import("../ValetudoRobot")} T
 * @extends Capability<T>
 */
class ProgressCapability extends Capability {
    /**
     * The amount and type of stuff returned here depends on the robots implementation
     *
     * @return {Promise<Array<ValetudoProgress>>}
     */
    async getProgresses() {
        throw new NotImplementedError();
    }

    getType() {
        return ProgressCapability.TYPE;
    }

    /**
     * @return {{availableProgresses: Array<ValetudoProgress.TYPES>}}
     */
    getProperties() {
        return {
            availableProgresses: []
        };
    }
}

ProgressCapability.TYPE = "ProgressCapability";

module.exports = ProgressCapability;
