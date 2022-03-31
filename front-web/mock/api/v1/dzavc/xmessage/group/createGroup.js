/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-03-31 11:00:40
 * @LastEditors: caokeke
 * @LastEditTime: 2021-03-31 11:10:36
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    msg: 'SUCCESS',
    data: {
      groupId: 'de5eb2e4a1454f46a642776d44f809a6',
      name: 'xmessage测试...',
      number: '0001000000052'
    }
  });
};
