const CapabilityRouter = require("./CapabilityRouter");

class ProgressCapabilityRouter extends CapabilityRouter {
    initRoutes() {
        this.router.get("/", async (req, res) => {
            try {
                res.json(await this.capability.getProgresses());
            } catch (e) {
                this.sendErrorResponse(req, res, e);
            }
        });
    }
}

module.exports = ProgressCapabilityRouter;
