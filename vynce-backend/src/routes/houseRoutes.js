const express = require("express");
const router = express.Router();
const houseController = require("../controllers/houseController");
const auth = require("../middleware/auth");

// House routes
router.post("/", auth, houseController.createHouse);
router.get("/", auth, houseController.getHouses);
router.get("/search", houseController.searchHouses);
router.get("/:houseId", auth, houseController.getHouse);
router.post("/:houseId/join", auth, houseController.joinHouse);
router.post("/:houseId/approve", auth, houseController.approveMember);
router.post("/:houseId/reject", auth, houseController.rejectMember);
router.post('/:houseId/leave', auth, houseController.leaveHouse);
router.post('/:houseId/mute', auth, houseController.toggleMute);
router.post('/:houseId/report', auth, houseController.reportHouse);

// Channel routes
router.post("/:houseId/channels", auth, houseController.createChannel);
router.get("/:houseId/channels", auth, houseController.getChannels);

// Message routes
router.put('/:houseId', auth, houseController.editHouse);
router.delete('/:houseId', auth, houseController.deleteHouse);
router.post('/:houseId/members/:memberId/remove', auth, houseController.removeMember);
router.post("/:houseId/channels/:channelId/messages", auth, houseController.sendMessage);
router.get("/:houseId/channels/:channelId/messages", auth, houseController.getMessages);

module.exports = router;