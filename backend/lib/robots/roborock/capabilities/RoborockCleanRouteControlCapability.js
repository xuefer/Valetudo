const CleanRouteControlCapability = require("../../../core/capabilities/CleanRouteControlCapability");

/**
 * @extends CleanRouteControlCapability<import("../RoborockValetudoRobot")>
 */
class RoborockCleanRouteControlCapability extends CleanRouteControlCapability {

    async getRoute() {
        const res = await this.robot.sendCommand("get_mop_mode", [], {});

        return RoborockCleanRouteControlCapability.INT_TO_MODE[res?.[0]] ?? RoborockCleanRouteControlCapability.ROUTE.DEEP;
    }

    async setRoute(newRoute) {
        await this.robot.sendCommand(
            "set_mop_mode",
            [
                RoborockCleanRouteControlCapability.MODE_TO_INT[newRoute]
            ],
            {}
        );
    }

    getProperties() {
        return {
            supportedRoutes: [
                RoborockCleanRouteControlCapability.ROUTE.QUICK,
                RoborockCleanRouteControlCapability.ROUTE.NORMAL,
                RoborockCleanRouteControlCapability.ROUTE.INTENSIVE,
                RoborockCleanRouteControlCapability.ROUTE.DEEP,
                RoborockCleanRouteControlCapability.ROUTE.CUSTOMIZE,
            ],
            mopOnly: [
                RoborockCleanRouteControlCapability.ROUTE.DEEP
            ],
            oneTime: []
        };
    }
}

RoborockCleanRouteControlCapability.INT_TO_MODE = Object.freeze({
    304: RoborockCleanRouteControlCapability.ROUTE.QUICK,
    300: RoborockCleanRouteControlCapability.ROUTE.NORMAL,
    301: RoborockCleanRouteControlCapability.ROUTE.INTENSIVE,
    303: RoborockCleanRouteControlCapability.ROUTE.DEEP,
    302: RoborockCleanRouteControlCapability.ROUTE.CUSTOMIZE,
});

RoborockCleanRouteControlCapability.MODE_TO_INT = Object.freeze(Object.fromEntries(
    Object.entries(RoborockCleanRouteControlCapability.INT_TO_MODE).map(([key, value]) => [value, key])
));

module.exports = RoborockCleanRouteControlCapability;
