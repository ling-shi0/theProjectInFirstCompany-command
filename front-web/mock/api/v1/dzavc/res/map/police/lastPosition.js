/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-04-09 15:08:07
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-16 12:51:59
 */
module.exports = (req, res) => {
  res.send({
    "code": "0",
    "msg": "SUCCESS",
    "data": {
      "id": 44,
      "policeNo": "330103",
      "policeRealName": "xmessage测试3",
      "userIndexCode": "xmessage3",
      "status": null,
      "phoneNum": "",
      "shortNum": null,
      "deptCode": "xmessageTest",
      "deptName": "xmessageTest",
      "associateDeviceType": null,
      "deviceId": null,
      "deviceNumber": null,
      "visual": 1,
      "resMapResps": [{
        "name": "xmessage3",
        "address": "xmessage用户3",
        latitude: 30.2112274,
        longitude: 120.215981,
        "labelType": "APP",
        "deviceIndexCode": "null",
        "cameraIndexCode": "eb2ce4dd58ea45ac9a1a65f2bddaa609"
      }, {
        "name": "xmessage3",
        "address": "xmessage用户3",
        "longitude": 116.40223900000008,
        "latitude": 37.39922419999997,
        "labelType": "PLACEPDA",
        "deviceIndexCode": "null",
        "cameraIndexCode": "eb2ce4dd58ea45ac9a1a65f2bddaa609"
      }, {
        "name": "xmessage3",
        "address": "xmessage用户3",
        "longitude": 116.41223900000008,
        "latitude": 37.40922419999997,
        "labelType": "INDIVIDUAL",
        "deviceIndexCode": "null",
        "cameraIndexCode": "eb2ce4dd58ea45ac9a1a65f2bddaa609"
      }, {
        "name": "xmessage3",
        "address": "xmessage用户3",
        "longitude": 116.42223900000009,
        "latitude": 37.41922419999997,
        "labelType": "INTERCOM",
        "deviceIndexCode": "null",
        "cameraIndexCode": "eb2ce4dd58ea45ac9a1a65f2bddaa609"
      }, {
        "name": "xmessage3",
        "address": "xmessage用户3",
        "longitude": 116.4322390000001,
        "latitude": 37.429224199999965,
        "labelType": "VEHICLEGPS",
        "deviceIndexCode": "null",
        "cameraIndexCode": "eb2ce4dd58ea45ac9a1a65f2bddaa609"
      }]
    }
  });
};
