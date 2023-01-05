const express = require("express");

function NotificationRouter(io) {
  const router = express.Router();

  router.post("/send-notification", (req, res) => {
    const body = req.body;
    let data = {
      receiver_id: body.detail_distribution.detail_vehicle.user_id,
      transaction_id: body.id,
      detail_vehicle: body.detail_distribution.detail_vehicle,
      quota: body.quota,
      location: body.gas_station,

    }
    if (!body) {
      res
        .json({
          message: "count not exits",
        })
        .status(401);
    }
    console.log(data);
    // io.to(data.receiver_id.toString()).emit('message', {data});
    //     res.json({
    //       message: "data delivered",
    //     });
    //     return;
    io.to(data.receiver_id.toString()).timeout(30000).emit('message', {
      is_connect: true
    }, (err, resolve) => {
      if (err) {
        res.json({
          message: "not delivered",
        });
        return;
      }
      if (!resolve[0]) {
        res.json({
          message: "not delivered",
        });
        return;
      }
      if (resolve[0].status) {
        io.to(data.receiver_id.toString()).emit('message', {data});
        res.json({
          message: "data delivered",
        });
        return;
      }

    });

  });

  return router;
}

module.exports = NotificationRouter;