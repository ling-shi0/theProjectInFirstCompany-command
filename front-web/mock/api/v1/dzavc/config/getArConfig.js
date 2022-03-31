/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-04-09 10:40:52
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2022-03-31 10:59:28
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    data: {
      // sg:
      //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6InhhdXRoLWF1dGhjIiwiZXhwIjoxNjE4MTk5MTM1LCJpYXQiOjE2MTgxOTg1MzUsImp0aSI6IjA2NzkwOWRkZGZmYzQzZWNiMTdmZmJhNmJkYTE4MzUwIn0.3A-RVj1Y5Y0tI111ZMghTTWs9BBmLu1hHEKnBQvQE4I',

      sg:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6InhhdXRoLWF1dGhjIiwiaWF0IjoxNjE4MjA4NjE1LCJvbmV0aW1lIjoxLCJqdGkiOiI2ZTY0YmFjY2QwZjk0MzMyODYwYjQyMjY3NjU2MWNjYyJ9.TeneHdBh8GYbsbkEXXk08rWYlvYwc9t_zn-WO8rC_ww',
      // sg: '12345',
      port: '8096',
      // ip: '10.33.43.58',
      ip: '10.19.185.14',
      userName: 'admin'
    },
    msg: '操作成功了！'
  });
};
