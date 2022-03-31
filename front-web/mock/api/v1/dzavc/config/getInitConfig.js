/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-02-24 15:55:03
 * @LastEditors: caokeke
 * @LastEditTime: 2021-04-09 10:40:56
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    data: {
      overTime: '5',
      qxdaAddr: 'http://127.0.0.1:8099/archives/index.html?type=person&val='
    },
    msg: '操作成功了！'
  });
};
