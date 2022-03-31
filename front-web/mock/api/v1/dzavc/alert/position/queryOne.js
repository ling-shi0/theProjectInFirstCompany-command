/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-03-31 20:06:11
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-13 11:36:34
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    data: {
      address: '测试一下',
      alertId: 'ca4d871510134204b7165a4b184bb95d',
      disposeDept: null,
      disposeDeptName: null,
      id: 1,
      latitude: 31.3319897,
      longitude: 118.8675124,
      name: '测试一下',
      type: 3
    },
    msg: '操作成功了！'
  });
};
