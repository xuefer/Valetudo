const ProgressCapability = require("../../../core/capabilities/ProgressCapability");
const ValetudoProgress = require("../../../entities/core/ValetudoProgress");

/**
 * @extends ProgressCapability<import("../RoborockValetudoRobot")>
 */
class RoborockProgressCapability extends ProgressCapability {

    /**
     * @return {Promise<Array<ValetudoProgress>>}
     */
    async getProgresses() {
        const res = (await this.robot.sendCommand("app_get_clean_estimate_info")).clean_estimate;
        if (!res.total_time) {
            return [];
        }
        if ((res.total_time - res.remaining_time) / res.total_time >= 0.01 && res.percent === 0) {
            // it clear percent after cleaning but leave other staled values which is invalidate
            return [];
        }

        return [
            new ValetudoProgress({
                type: ValetudoProgress.TYPES.TIME,
                value: res.total_time - res.remaining_time,
                total: res.total_time
            }),
            new ValetudoProgress({
                type: ValetudoProgress.TYPES.AREA,
                value: Math.round((res.total_area - res.remaining_area) / 100),
                total: Math.round(res.total_area / 100)
            }),
            new ValetudoProgress({
                type: ValetudoProgress.TYPES.BATTERY,
                value: res.total_battery - res.remaining_battery,
                total: res.total_battery
            }),
            new ValetudoProgress({
                type: ValetudoProgress.TYPES.PERCENT,
                value: res.percent,
                total: 100
            }),
        ];
    }

    getProperties() {
        return {
            availableProgresses: [
                ValetudoProgress.TYPES.AREA,
                ValetudoProgress.TYPES.BATTERY,
                ValetudoProgress.TYPES.TIME,
                ValetudoProgress.TYPES.PERCENT
            ]
        };
    }
}

module.exports = RoborockProgressCapability;
