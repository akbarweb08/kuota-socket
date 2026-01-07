const express = require("express");

function NotificationRouter(io) {
  const router = express.Router();

  router.post("/send-notification", (req, res) => {
    const body = req.body;
    let data = {
      receiver_id: body['data'].detail_distribution.detail_vehicle.user_id+'-'+body['qrToken'],
      transaction_id: body['data'].id,
      detail_vehicle: body['data'].detail_distribution.detail_vehicle,
      quota: body['data'].quota,
      location: body['data'].gas_station,
      kilometer_number : body['data'].kilometer_number,
    }
    // let data = {
    //   receiver_id: body.detail_distribution.detail_vehicle.user_id,
    //   transaction_id: body.id,
    //   detail_vehicle: body.detail_distribution.detail_vehicle,
    //   quota: body.quota,
    //   location: body.gas_station,
    //   kilometer_number : body.kilometer_number,
    // }
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
