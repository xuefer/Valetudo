const CapabilityMqttHandle = require("./CapabilityMqttHandle");
const ComponentType = require("../homeassistant/ComponentType");
const DataType = require("../homie/DataType");
const EntityCategory = require("../homeassistant/EntityCategory");
const HassAnchor = require("../homeassistant/HassAnchor");
const InLineHassComponent = require("../homeassistant/components/InLineHassComponent");
const Logger = require("../../Logger");
const PropertyMqttHandle = require("../handles/PropertyMqttHandle");
const Unit = require("../common/Unit");
const ValetudoProgress = require("../../entities/core/ValetudoProgress");

class ProgressCapabilityMqttHandle extends CapabilityMqttHandle {
    /**
     * @param {object} options
     * @param {import("../handles/RobotMqttHandle")} options.parent
     * @param {import("../MqttController")} options.controller MqttController instance
     * @param {import("../../core/ValetudoRobot")} options.robot
     * @param {import("../../core/capabilities/ProgressCapability")} options.capability
     */
    constructor(options) {
        super(Object.assign(options, {
            friendlyName: "Progresses",
            helpMayChange: {
                "Properties": "Available progresses depend on the robot model.",
            }
        }));
        this.capability = options.capability;

        for (const availableProgressType of this.capability.getProperties().availableProgresses) {
            switch (availableProgressType) {
                case ValetudoProgress.TYPES.TIME:
                    this.registerChild(
                        new PropertyMqttHandle({
                            parent: this,
                            controller: this.controller,
                            topicName: "remaining_time",
                            friendlyName: "Remaining Clean Time",
                            datatype: DataType.INTEGER,
                            unit: Unit.SECONDS,
                            getter: async () => {
                                return this.controller.hassAnchorProvider.getAnchor(
                                    HassAnchor.ANCHOR.PROGRESS_REMAINING_TIME
                                ).getValue();
                            },
                            helpText: "This handle returns the remaining clean time"
                        }).also((prop) => {
                            this.controller.withHass((hass => {
                                prop.attachHomeAssistantComponent(
                                    new InLineHassComponent({
                                        hass: hass,
                                        robot: this.robot,
                                        name: this.capability.getType() + "_remaining_time",
                                        friendlyName: "Remaining Time",
                                        componentType: ComponentType.SENSOR,
                                        autoconf: {
                                            state_topic: prop.getBaseTopic(),
                                            icon: "mdi:timer",
                                            entity_category: EntityCategory.DIAGNOSTIC,
                                            unit_of_measurement: Unit.SECONDS
                                        }
                                    })
                                );
                            }));
                        })
                    );
                    break;

                case ValetudoProgress.TYPES.AREA:
                    this.registerChild(
                        new PropertyMqttHandle({
                            parent: this,
                            controller: this.controller,
                            topicName: "remaining_area",
                            friendlyName: "Remaining Clean Area",
                            datatype: DataType.INTEGER,
                            unit: Unit.SECONDS,
                            getter: async () => {
                                return this.controller.hassAnchorProvider.getAnchor(
                                    HassAnchor.ANCHOR.PROGRESS_REMAINING_AREA
                                ).getValue();
                            },
                            helpText: "This handle returns the remaining clean area"
                        }).also((prop) => {
                            this.controller.withHass((hass => {
                                prop.attachHomeAssistantComponent(
                                    new InLineHassComponent({
                                        hass: hass,
                                        robot: this.robot,
                                        name: this.capability.getType() + "_remaining_area",
                                        friendlyName: "Remaining Area",
                                        componentType: ComponentType.SENSOR,
                                        autoconf: {
                                            state_topic: prop.getBaseTopic(),
                                            icon: "mdi:floor-plan",
                                            entity_category: EntityCategory.DIAGNOSTIC,
                                            unit_of_measurement: Unit.SQUARE_CENTIMETER
                                        }
                                    })
                                );
                            }));
                        })
                    );
                    break;

                case ValetudoProgress.TYPES.BATTERY:
                    this.registerChild(
                        new PropertyMqttHandle({
                            parent: this,
                            controller: this.controller,
                            topicName: "remaining_battery",
                            friendlyName: "Remaining Battery",
                            datatype: DataType.INTEGER,
                            unit: Unit.PERCENT,
                            getter: async () => {
                                return this.controller.hassAnchorProvider.getAnchor(
                                    HassAnchor.ANCHOR.PROGRESS_REMAINING_BATTERY
                                ).getValue();
                            },
                            helpText: "This handle returns the percent of battery will be used in this cleaning"
                        }).also((prop) => {
                            this.controller.withHass((hass => {
                                prop.attachHomeAssistantComponent(
                                    new InLineHassComponent({
                                        hass: hass,
                                        robot: this.robot,
                                        name: this.capability.getType() + "_remaining_battery",
                                        friendlyName: "Remaining Battery",
                                        componentType: ComponentType.SENSOR,
                                        autoconf: {
                                            state_topic: prop.getBaseTopic(),
                                            icon: "mdi:percent",
                                            entity_category: EntityCategory.DIAGNOSTIC,
                                            unit_of_measurement: Unit.PERCENT
                                        }
                                    })
                                );
                            }));
                        })
                    );
                    break;

                case ValetudoProgress.TYPES.PERCENT:
                    this.registerChild(
                        new PropertyMqttHandle({
                            parent: this,
                            controller: this.controller,
                            topicName: "percent",
                            friendlyName: "Progress",
                            datatype: DataType.INTEGER,
                            unit: Unit.PERCENT,
                            getter: async () => {
                                return this.controller.hassAnchorProvider.getAnchor(
                                    HassAnchor.ANCHOR.PROGRESS_PERCENT
                                ).getValue();
                            },
                            helpText: "This handle returns the percent in progress"
                        }).also((prop) => {
                            this.controller.withHass((hass => {
                                prop.attachHomeAssistantComponent(
                                    new InLineHassComponent({
                                        hass: hass,
                                        robot: this.robot,
                                        name: this.capability.getType() + "_percent",
                                        friendlyName: "Progress",
                                        componentType: ComponentType.SENSOR,
                                        autoconf: {
                                            state_topic: prop.getBaseTopic(),
                                            icon: "mdi:percent",
                                            entity_category: EntityCategory.DIAGNOSTIC,
                                            unit_of_measurement: Unit.PERCENT
                                        }
                                    })
                                );
                            }));
                        })
                    );
                    break;
            }
        }
    }

    async refresh() {
        const progresses = await this.capability.getProgresses();
        const typeToProgress = Object.fromEntries(progresses.map((progress) => [progress.type, progress]));

        for (const availableProgressType of this.capability.getProperties().availableProgresses) {
            const anchorId = DATA_POINT_TYPE_TO_ANCHOR_ID_MAPPING[availableProgressType];

            if (anchorId) {
                const progress = typeToProgress[availableProgressType];

                const value = (() => {
                    if (!progress) {
                        return 0;
                    } else if (progress.type === ValetudoProgress.TYPES.PERCENT) {
                        return progress.value;
                    } else {
                        return progress.total - progress.value;
                    }
                })();
                await this.controller.hassAnchorProvider.getAnchor(anchorId).post(value);
            } else {
                Logger.warn(`No anchor found for Progress Data Type ${availableProgressType}`);
            }
        }

        await super.refresh();
    }
}

const DATA_POINT_TYPE_TO_ANCHOR_ID_MAPPING = {
    [ValetudoProgress.TYPES.TIME]: HassAnchor.ANCHOR.PROGRESS_REMAINING_TIME,
    [ValetudoProgress.TYPES.AREA]: HassAnchor.ANCHOR.PROGRESS_REMAINING_AREA,
    [ValetudoProgress.TYPES.BATTERY]: HassAnchor.ANCHOR.PROGRESS_REMAINING_BATTERY,
    [ValetudoProgress.TYPES.PERCENT]: HassAnchor.ANCHOR.PROGRESS_PERCENT,
};

ProgressCapabilityMqttHandle.OPTIONAL = true;

module.exports = ProgressCapabilityMqttHandle;
