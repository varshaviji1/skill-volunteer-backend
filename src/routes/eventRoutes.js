import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRole from "../middleware/authorizeRole.js";

const router = express.Router();

router.post(
  "/create-event",
  verifyToken,
  authorizeRole("coordinator"),
  (req, res) => {

    const newEvent = {
      title: "Sample Event",
      createdBy: req.user.id
    };

    // Emit to all connected clients
    req.io.emit("new-event", newEvent);

    res.json({ 
      message: "Event created successfully",
      event: newEvent
    });
  }
);


router.get(
  "/view-events",
  verifyToken,
  (req, res) => {
    res.json({ message: "Events list shown" });
  }
);

export default router;
