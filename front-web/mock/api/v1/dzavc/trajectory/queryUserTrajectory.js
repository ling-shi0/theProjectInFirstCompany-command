/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-04-02 09:55:59
 * @LastEditors: caokeke
 * @LastEditTime: 2021-04-14 14:19:31
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    msg: 'SUCCESS',
    data: [
      {
        latitude: 30.217983,
        longitude: 120.210536,
        reportTime: '2021-04-14T02:50:37.584Z',
        name: '网商路监控1'
      },
      {
        latitude: 30.214983,
        longitude: 120.240536,
        reportTime: '2021-04-14T02:50:37.584Z',
        name: '网商路监控2'
      },
      {
        latitude: 30.215983,
        longitude: 120.23536,
        reportTime: '2021-04-14T02:50:37.584Z',
        name: '网商路监控2'
      },
      {
        latitude: 30.247983,
        longitude: 120.243536,
        reportTime: '2021-04-14T02:50:37.584Z',
        name: '网商路监控3'
      }
    ]
  });
};
