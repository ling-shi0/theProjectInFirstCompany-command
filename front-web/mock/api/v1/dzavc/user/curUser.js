/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-03-29 16:21:16
 * @LastEditors: caokeke
 * @LastEditTime: 2021-03-31 10:55:38
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    msg: 'SUCCESS',
    data: {
      deptIndexCode: 'd1',
      deptName: '部门',
      email: null,
      idCard: null,
      phoneNum: null,
      realName: 'Administrator',
      status: 'ENABLED',
      userDomain: null,
      userIndexCode: 'xmessage1',
      username: 'admin'
    }
  });
};
