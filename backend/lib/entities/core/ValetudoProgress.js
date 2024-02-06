const SerializableEntity = require("../SerializableEntity");

class ValetudoProgress extends SerializableEntity {
    /**
     * @param {object} options
     * @param {object} [options.metaData]
     * @param {Date} [options.timestamp]
     * @param {ValetudoProgressType} options.type
     * @param {number} options.value
     * @param {number} options.total
     */
    constructor(options) {
        super(options);

        this.timestamp = options.timestamp ?? new Date();

        this.type = options.type;
        this.value = options.value;
        this.total = options.total;
    }
}

/**
 *
 * @typedef {string} ValetudoProgressType
 * @enum {string}
 */
ValetudoProgress.TYPES = Object.freeze({
    AREA: "area", //in cm²
    BATTERY: "battery", //in % of battery
    TIME: "time", //in seconds
    PERCENT: "percent", //in % of 100
});

module.exports = ValetudoProgress;
