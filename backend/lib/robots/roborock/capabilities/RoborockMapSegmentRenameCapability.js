const MapSegmentRenameCapability = require("../../../core/capabilities/MapSegmentRenameCapability");

/**
 * @extends MapSegmentRenameCapability<import("../RoborockValetudoRobot")>
 */
class RoborockMapSegmentRenameCapability extends MapSegmentRenameCapability {
    /**
     * @param {import("../../../entities/core/ValetudoMapSegment")} segment
     * @param {string} name
     * @returns {Promise<void>}
     */
    async renameSegment(segment, name) {
        if (name.length > 23) {
            throw new Error("Invalid name. Max length 23");
        }
        if (this.segmentNames === undefined) {
            throw new Error("Missing segmentNames in memory");
        }

        const segmentNames = { ...this.segmentNames };
        segmentNames[parseInt(segment.id)] = name ;

        const payload = Object.keys(segmentNames).map(k => {
            const data = { miRoomId: segmentNames[k], robotRoomId: parseInt(k) };
            if (this.tagIds[k] !== undefined) {
                data.robotTagId = this.tagIds[k];
            }
            return data;
        });

        await this.robot.sendCommand("name_segment", payload, {timeout: 2500});
        await this.fetchAndStoreSegmentNames();

        this.robot.pollMap();
    }

    /**
     * This is a roborock-specific method which fetches the segment names and stores them
     * in the capability, which is somewhat ugly but not as ugly as other solutions considered
     *
     * @returns {Promise<void>}
     */
    async fetchAndStoreSegmentNames() {
        const segmentNames = await this.robot.sendCommand("get_room_mapping");

        // Example response: [ [ 21, 'RoomName' ] ]
        if (Array.isArray(segmentNames)) {
            this.segmentNames = {};
            this.tagIds = {};

            segmentNames.forEach(s => {
                this.segmentNames[s[0]] = s[1];
                this.tagIds[s[0]] = s[2];
            });
        } else {
            this.segmentNames = undefined;
            this.tagIds = undefined;
        }
    }
}

module.exports = RoborockMapSegmentRenameCapability;
