const CapabilityMqttHandle = require("./CapabilityMqttHandle");
const Commands = require("../common/Commands");
const ComponentType = require("../homeassistant/ComponentType");
const DataType = require("../homie/DataType");
const InLineHassComponent = require("../homeassistant/components/InLineHassComponent");
const PropertyMqttHandle = require("../handles/PropertyMqttHandle");
const stateAttrs = require("../../entities/state/attributes");

class MopDockCleanManualTriggerCapabilityMqttHandle extends CapabilityMqttHandle {
    /**
     * @param {object} options
     * @param {import("../handles/RobotMqttHandle")} options.parent
     * @param {import("../MqttController")} options.controller MqttController instance
     * @param {import("../../core/ValetudoRobot")} options.robot
     * @param {import("../../core/capabilities/MopDockCleanManualTriggerCapability")} options.capability
     */
    constructor(options) {
        super(Object.assign(options, {
            friendlyName: "Mop Dock Clean Manual Trigger"
        }));
        this.capability = options.capability;

        this.registerChild(new PropertyMqttHandle({
            parent: this,
            controller: this.controller,
            topicName: "trigger",
            friendlyName: "Mop Dock Clean Manual Trigger",
            datatype: DataType.ENUM,
            format: Object.values(Commands.SWITCH).join(","),
            setter: async (value) => {
                if (value === Commands.SWITCH.ON) {
                    await this.capability.startCleaning();
                } else if (value === Commands.SWITCH.OFF) {
                    await this.capability.stopCleaning();
                } else {
                    throw new Error("Invalid value");
                }
            },
            getter: async () => {
                const dockStatus = this.robot.state.getFirstMatchingAttribute({
                    attributeClass: stateAttrs.DockStatusStateAttribute.name
                });

                if (dockStatus === null) {
                    throw new Error("Invalid dock status");
                }

                if (dockStatus.value === stateAttrs.DockStatusStateAttribute.VALUE.IDLE) {
                    return Commands.SWITCH.OFF;
                } else {
                    return Commands.SWITCH.ON;
                }
            },
        }).also((prop) => {
            const capabilityType = options.capability.getType();

            this.controller.withHass((hass) => {
                prop.attachHomeAssistantComponent(
                    new InLineHassComponent({
                        hass: hass,
                        robot: this.robot,
                        name: capabilityType,
                        friendlyName: "Trigger Mop Dock Clean",
                        componentType: ComponentType.SWITCH,
                        autoconf: {
                            state_topic: prop.getBaseTopic(),
                            value_template: "{{ value }}",
                            command_topic: `${prop.getBaseTopic()}/set`,
                            icon: "mdi:waves"
                        }
                    })
                );
            });
        }));
    }
}

MopDockCleanManualTriggerCapabilityMqttHandle.OPTIONAL = false;

module.exports = MopDockCleanManualTriggerCapabilityMqttHandle;
