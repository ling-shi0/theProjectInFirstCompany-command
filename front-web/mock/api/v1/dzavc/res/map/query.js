/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-03-29 16:43:41
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-13 14:00:44
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    data: {
      AR: [],
      CAMERA: [
        {
          address: "e8bc40748b9d4ebb9debcc2dd88af8hj",
          amount: 1,
          labelType: 'CAMERA',
          latitude: 30.212276,
          longitude: 120.21773,
          name: null,
          polymerize: false
        },
        {
          address: "e8bc40748b9d4ebb9debcc2dd88af87d",
          amount: 3,
          labelType: 'CAMERA',
          latitude: 30.21205,
          longitude: 120.22044,
          name: null,
          polymerize: true
        }
      ],
      CYBERCAFE: [],
      INDIVIDUAL: [{
        address: "null",
        amount: 0,
        labelType: "INDIVIDUAL",
        latitude: 30.2112274,
        longitude: 120.215981,
        name: "xmessage测试3",
        polymerize: false,
        wkt: null,
        "userId": "xmessage3"
      }],
      INTERCOM: [],
      KTV: [{
        address: null,
        amount: 0,
        labelType: "KTV",
        latitude: 37.43922424316406,
        longitude: 116.34223937988281,
        name: "测试KTV",
        polymerize: false,
        wkt: "['POINT(116.34223764158631 37.43922507536316)']"
      }],
      PLACEPDA: [],
      REGION: [
        {
          address: null,
          amount: 0,
          labelType: 'REGION',
          latitude: 30.2112274,
          longitude: 120.215981,
          name: 'sss',
          polymerize: false,
          wkt:
            '["POLYGON((120.19532335768741 30.196973621072306,120.18751276503605 30.19062215012504,120.19944323073429 30.189077197732463,120.19824160109562 30.198776065530314,120.19532335768741 30.196973621072306))"]'
        }
      ],
      "SENTRY": [{ "name": "文化路区域", "address": null, "longitude": 116.32119, "latitude": 37.4458122, "wkt": "[\"POINT(116.32118766523743 37.44581258070374)\"]", "labelType": "SENTRY", "polymerize": false, "amount": 0, "userId": "8" }, { "name": "广川大道岗亭01", "address": null, "longitude": 116.339462, "latitude": 37.4434738, "wkt": "[\"POINT(116.33945887304688 37.44347369444275)\"]", "labelType": "SENTRY", "polymerize": false, "amount": 0, "userId": "1" }],
      UPTOWN: [],
      VEHICLEGPS: []
    },
    msg: '操作成功了！'
  });
};
