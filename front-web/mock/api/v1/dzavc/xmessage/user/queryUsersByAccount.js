/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-03-29 16:35:20
 * @LastEditors: caokeke
 * @LastEditTime: 2021-03-31 10:58:33
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    msg: 'SUCCESS',
    data: {
      account: 'xmessage1',
      deptCode: 'xmessageTest',
      deptPath: '部门/xmessageTest',
      displayNumber: '801020',
      employeePost: null,
      loginType: 'web',
      name: 'xmessage测试',
      number: '0000000801020',
      phoneNumber: '',
      photoUrl: null,
      registCode: '11931106',
      resId: '0b19a4f4975b47d48c676a3b47e87afd',
      status: 1,
      type: 8080
    }
  });
};
