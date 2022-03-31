/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-04-08 16:09:53
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-10 15:02:03
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    data: [{
      "capabilitySet": "string",
      "cascadeCode": "string",
      "crossingId": 0,
      "distance": "100",
      "externalIndexCode": "string",
      "indexCode": "string",
      "latitude": "string",
      "longitude": "string",
      "name": "string",
      "orgIndexCode": "string",
      "resourceType": "CAMERA",
      "status": 0
    }, {
      "capabilitySet": "string",
      "cascadeCode": "string",
      "crossingId": 0,
      "distance": "110",
      "externalIndexCode": "string",
      "indexCode": "string",
      "latitude": "string",
      "longitude": "string",
      "name": "string",
      "orgIndexCode": "string",
      "resourceType": "device",
      "status": 0
    }, {
      "indexCode": "b1e148c11ddc4020be2ee4d5030f67da",
      "orgIndexCode": null,
      "longitude": "120.21654",
      "latitude": "30.21132",
      "name": "AR 01",
      "crossingId": null,
      "externalIndexCode": "33010200001310372230",
      "resourceType": "CAMERA",
      "cascadeCode": "0",
      "status": 0,
      "capabilitySet": "@io@event_ias@event_rule@motiontrack@event_face@event_body@event_veh@event_veh_recognition@gis@event_gis@vss@ptz@manualtrack@",
      "distance": "10950.061681832018"
    },
    {
      "indexCode": "928dbc0ae6ad45f7bdd8d64e05ef3362",
      "orgIndexCode": null,
      "longitude": "120.21654",
      "latitude": "30.21132",
      "name": "AR02",
      "crossingId": null,
      "externalIndexCode": "33010200001310025238",
      "resourceType": "AR",
      "cascadeCode": "0",
      "status": 0,
      "capabilitySet": "@io@event_ias@event_rule@motiontrack@event_face@event_body@event_veh@event_veh_recognition@gis@event_gis@vss@ptz@manualtrack@",
      "distance": "10950.061681832018"
    }],
    msg: '操作成功了！'
  });
};