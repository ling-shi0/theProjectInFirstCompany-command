/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-03-31 11:07:32
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-09 09:59:15
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    msg: 'SUCCESS',
    data: {
      list: [
        {
          account: 'xmessage2',
          deptCode: 'xmessageTest',
          deptPath: '部门/xmessageTest',
          displayNumber: '801021',
          employeePost: null,
          loginType: 'app',
          name: 'xmessage测试2',
          number: '0000000801021',
          phoneNumber: '',
          photoUrl: null,
          registCode: null,
          resId: 'fcf6c2dbdc3a432a8f72e02dabd3e505',
          status: 0,
          type: 8080
        },{
          account: 'xmessage3',
          deptCode: 'xmessageTest3',
          deptPath: '部门/xmessageTest3',
          displayNumber: '801021',
          employeePost: null,
          loginType: 'app',
          name: 'xmessage测试3',
          number: '0000000801022',
          phoneNumber: '',
          photoUrl: null,
          registCode: null,
          resId: 'cde11fdfc1ad407987000d8664fb23ba',
          status: 0,
          type: 8080
        }
      ],
      pageNo: 1,
      pageSize: 1000,
      total: 1
    }
  });
};
