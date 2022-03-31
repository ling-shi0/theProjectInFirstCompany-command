/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-02-24 15:52:13
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-09 10:08:16
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    data: {
      num: 1500,
      percent: '10%',
      type: 'up'
    },
    msg: '操作成功了！'
  });
};
