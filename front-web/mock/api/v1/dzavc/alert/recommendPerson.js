/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-03-05 10:39:44
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-07 14:28:45
 */
module.exports = (req, res) => {
  res.send({ "code": "0", "msg": "SUCCESS", "data": [{ "userIndexCode": "dengyibo", "userName": "dengyibo", "policeNo": "10086", "phoneNo": "10086", "deptCode": "d1", "deptName": "部门", "longitude": "120.15", "latitude": "30.15", "deviceId": "test" }, { "userIndexCode": "yhtest", "userName": "yhtest", "policeNo": "222", "phoneNo": "222", "deptCode": "d1", "deptName": "部门", "longitude": "120.151615644", "latitude": "30.15465123", "deviceId": "test" }, { "userIndexCode": "bwq", "userName": "bbb", "policeNo": "12345", "phoneNo": "12345", "deptCode": "d2", "deptName": "测试部门", "longitude": "120.1511111", "latitude": "30.151111", "deviceId": "test" }] });
};
