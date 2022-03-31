/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-02-21 11:40:19
 * @LastEditors: caokeke
 * @LastEditTime: 2021-02-21 12:51:53
 */
const fs = require('fs');
const path = require('path');

module.exports = app => {
  app.all(/.*.do$/, (req, res) => {
    const JSFilePath = path.join(
      __dirname,
      `/api/v1${req.path.replace('/api/', '/').replace('.do', '.js')}`
    );
    if (fs.existsSync(JSFilePath)) {

      delete require.cache[JSFilePath];
      require(JSFilePath)(req, res);
    } else {
      res.send({
        code: '0',
        data: {},
        msg: '请求成功'
      });
    }
  });
};
