const express = require("express");

function NotificationRouter(io) {
  const router = express.Router();

  router.post("/send-notification", (req, res) => {
    const body = req.body;
    let data = {
      receiver_id : body.detail_distribution.detail_vehicle.user_id,
      transaction_id : body.id,
      detail_vehicle : body.detail_distribution.detail_vehicle,
      quota : body.quota,
      location : body.gas_station.location,

    }
    if (!body) {
      res
        .json({
          message: "count not exits",
        })
        .status(401);
    }
    console.log(data.receiver_id.toString());
    
    io.to(data.receiver_id.toString()).emit('message', { data});

    res.json({
      message: "data delivered",
    });
  });

  return router;
}

module.exports = NotificationRouter;