/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-03-29 14:47:34
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-12 09:28:23
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    data: {
      list: [
        {
          address: 'ceshiyixa',
          alertId: 'ca4d871510134204b7165a4b184bb95d',
          disposeDept: null,
          disposeDeptName: null,
          id: 1,
          latitude: 31.3319897,
          longitude: 118.8675124,
          name: '',
          type: 3
        }
      ]
    },
    msg: '操作成功了！'
  });
};
