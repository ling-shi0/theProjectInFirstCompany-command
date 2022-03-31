/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-02-24 15:54:40
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2022-03-31 10:59:26
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    msg: 'SUCCESS',
    data: {
      clusterLevel: '18',
      hmapHvtUrl: 'http://10.19.134.107:1709/hmap-server/hvt/',
      hmapStyleUrl:
        'http://10.19.134.107:1709/hmap-server/hvtStyles-multalarm-blue/MapStyle.json',
      initLevel: '17',
      initLonLat: '120.21607_30.211598'
      // initLonLat: "116.294263_37.456893",
      // initLevel: "17",
      // hmapHvtUrl: "http://10.33.43.58:1709/hmap-server/hvt/",
      // clusterLevel: "18",
      // hmapStyleUrl: "http://10.33.43.58:1709/hmap-server/hvtStyles-dezhou-white/MapStyle.json"
    }
  });
};
