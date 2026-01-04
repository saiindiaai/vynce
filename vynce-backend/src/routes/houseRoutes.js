const express = require("express");
const router = express.Router();
const houseController = require("../controllers/houseController");
const auth = require("../middleware/auth");

// House routes
router.post("/", auth, houseController.createHouse);
router.get("/", auth, houseController.getHouses);
router.get("/:houseId", auth, houseController.getHouse);

// Channel routes
router.post("/:houseId/channels", auth, houseController.createChannel);
router.get("/:houseId/channels", auth, houseController.getChannels);

// Message routes
router.post("/:houseId/channels/:channelId/messages", auth, houseController.sendMessage);
router.get("/:houseId/channels/:channelId/messages", auth, houseController.getMessages);

module.exports = router;