/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-03-04 19:39:26
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-03-04 19:39:56
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    data:
      [
        {
          alarmTime: "2021-02-23 11:00:00",
          type: "求助",
          alarmInfo: " 称九千多元丢失，需要帮助寻找",
          address: "锦城街道吴越山庄33幢303室",
          dept: "嘉兴分局",
          feedback: ""
        }
      ],
    msg: '操作成功了！'
  });
};