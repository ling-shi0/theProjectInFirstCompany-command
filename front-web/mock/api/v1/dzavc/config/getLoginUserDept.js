/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-02-24 15:55:20
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2022-03-31 10:59:49
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    data: [
      {
        "deptName": "部门",
        "deptIndexCode": "d1"
      },
      {
        "deptName": "测试部门",
        "deptIndexCode": "d2"
      },
      {
        "deptName": "一大队",
        "deptIndexCode": "330401"
      },
      {
        "deptName": "乌镇",
        "deptIndexCode": "33041101"
      },
      {
        "deptName": "西兴镇",
        "deptIndexCode": "xxz"
      },
      {
        "deptName": "",
        "deptIndexCode": ""
      },
      {
        "deptName": "行业测试",
        "deptIndexCode": "001110000"
      },
      {
        "deptName": "交通",
        "deptIndexCode": "0101"
      },
      {
        "deptName": "小小部门",
        "deptIndexCode": "222"
      },
      {
        "deptName": "二大队",
        "deptIndexCode": "330402"
      },
      {
        "deptName": "嘉兴市局",
        "deptIndexCode": "3304"
      },
      {
        "deptName": "三大队",
        "deptIndexCode": "330403"
      },
      {
        "deptName": "四大队",
        "deptIndexCode": "330404"
      },
      {
        "deptName": "滨江区",
        "deptIndexCode": "zjs"
      },
      {
        "deptName": "五大队",
        "deptIndexCode": "330405"
      },
      {
        "deptName": "小部门",
        "deptIndexCode": "12003"
      },
      {
        "deptName": "六大队",
        "deptIndexCode": "330406"
      },
      {
        "deptName": "嘉善大队",
        "deptIndexCode": "330407"
      },
      {
        "deptName": "平湖大队",
        "deptIndexCode": "330408"
      },
      {
        "deptName": "海盐大队",
        "deptIndexCode": "330409"
      },
      {
        "deptName": "海宁大队",
        "deptIndexCode": "330410"
      },
      {
        "deptName": "桐乡大队",
        "deptIndexCode": "330411"
      }
    ],
    msg: '操作成功了！'
  });
};
