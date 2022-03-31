/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-05-18 16:31:28
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-18 16:33:12
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    data: '历史报警0次,重复报警0次',
    msg: '操作成功了！'
  });
};
