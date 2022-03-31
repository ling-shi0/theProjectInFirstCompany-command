/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-03-29 16:41:42
 * @LastEditors: caokeke
 * @LastEditTime: 2021-03-31 11:03:59
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    msg: 'SUCCESS',
    data: {
      list: [
        {
          address: '东宋都市花园002号',
          amount: 0,
          labelType: null,
          latitude: 36.79309425,
          longitude: 116.75832014,
          name: '今磨房食疗养生',
          polymerize: false
        },
        {
          address: '湖滨中大道118号德州百货大楼10楼1002号',
          amount: 0,
          labelType: null,
          latitude: 37.44506189,
          longitude: 116.30329934,
          name: '协美医疗美容',
          polymerize: false
        }
      ]
    }
  });
};
