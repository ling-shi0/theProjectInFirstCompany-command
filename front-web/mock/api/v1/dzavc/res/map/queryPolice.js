/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-03-31 11:03:56
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-16 12:49:39
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    msg: 'SUCCESS',
    data: {
      list: [
        {
          associateDeviceType: null,
          deptCode: 'xmessageTest',
          deptName: 'xmessageTest',
          deviceId: null,
          deviceNumber: null,
          id: 43,
          phoneNum: '',
          policeNo: '330102',
          policeRealName: 'xmessage测试2',
          resMapResps: [
            {
              address: '林子镇森林公园北37.53922419999998',
              labelType: 'APP',
              latitude: 30.2112274,
              longitude: 120.215981,
              name: 'xmessage2'
            },
            {
              address: '林子镇森林公园北37.549224199999976',
              labelType: 'PLACEPDA',
              latitude: 37.549224199999976,
              longitude: 116.45223900000006,
              name: 'xmessage2'
            }
          ],
          shortNum: null,
          status: null,
          userIndexCode: 'xmessage2',
          visual: 0
        }
      ]
    }
  });
};
