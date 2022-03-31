/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-02-24 15:51:36
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-09 10:08:01
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    data: {
      percent: '10%',
      time: '16:00',
      type: 'down'
    },
    msg: '操作成功了！'
  });
};
