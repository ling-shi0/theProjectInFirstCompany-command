/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-02-24 15:51:04
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-09 10:07:51
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    data: {
      percent: '20%',
      time: '15:00',
      type: 'up'
    },
    msg: '操作成功了！'
  });
};
