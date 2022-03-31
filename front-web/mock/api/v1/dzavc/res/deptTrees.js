/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-03-15 14:31:22
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-03-15 14:32:10
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    data: [
      {
        "deptIndexCode": "d1",
        "name": "部门",
        "parentIndexCode": "-1",
        "parentName": null,
        "remark": "默认部门",
        "creator": "admin",
        "createTime": "2020-07-02T17:32:46.697+08:00",
        "weight": 50,
        "existsChild": true,
        "deptExts": null,
        "treeLevel": 1
      },
      {
        "deptIndexCode": "d2",
        "name": "测试部门",
        "parentIndexCode": "d1",
        "parentName": null,
        "remark": "",
        "creator": "admin",
        "createTime": "2020-07-02T19:20:44.610+08:00",
        "weight": 50,
        "existsChild": true,
        "deptExts": null,
        "treeLevel": 2
      },
      {
        "deptIndexCode": "3304",
        "name": "嘉兴市局",
        "parentIndexCode": "d1",
        "parentName": null,
        "remark": "",
        "creator": "admin",
        "createTime": "2020-11-04T09:56:16.200+08:00",
        "weight": 52,
        "existsChild": true,
        "deptExts": null,
        "treeLevel": 2
      },
      {
        "deptIndexCode": "zjs",
        "name": "滨江区",
        "parentIndexCode": "d1",
        "parentName": null,
        "remark": "滨江区",
        "creator": "admin",
        "createTime": "2020-11-12T09:49:37.450+08:00",
        "weight": 53,
        "existsChild": true,
        "deptExts": null,
        "treeLevel": 2
      },
      {
        "deptIndexCode": "12003",
        "name": "小部门",
        "parentIndexCode": "d1",
        "parentName": null,
        "remark": "案事件小部门，用于权限测试",
        "creator": "zhangzhihao",
        "createTime": "2020-11-20T16:01:45.992+08:00",
        "weight": 54,
        "existsChild": true,
        "deptExts": null,
        "treeLevel": 2
      },
      {
        "deptIndexCode": "xmessageTest",
        "name": "xmessageTest",
        "parentIndexCode": "d1",
        "parentName": null,
        "remark": "",
        "creator": "admin",
        "createTime": "2021-03-08T16:12:42.485+08:00",
        "weight": 55,
        "existsChild": false,
        "deptExts": null,
        "treeLevel": 2
      }
    ],
    msg: '操作成功了！'
  })
}
