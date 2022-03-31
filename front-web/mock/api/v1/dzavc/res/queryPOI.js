/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-03-16 14:05:25
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-03-16 14:08:22
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    data: {
      list: [
        {
          "name": "临邑博文学校",
          "address": "林子镇红坛寺森林公园北一公里",
          "longitude": 116.87360607,
          "latitude": 37.29523614
        },
        {
          "name": "德州信息工程学校(南门)",
          "address": "新华路588号",
          "longitude": 116.29985135,
          "latitude": 37.43873999
        },
        {
          "name": "原点私人音乐俱乐部",
          "address": "华府南门东方红学校东50米附近",
          "longitude": 116.79004193,
          "latitude": 37.63942947
        },
        {
          "name": "夏津县技工学校",
          "address": "中山北路与银城路交叉口东100米",
          "longitude": 116.00197493,
          "latitude": 36.97201485
        },
        {
          "name": "夏津县金坤技工学校",
          "address": "朝阳西路与315省道交叉口西南150米",
          "longitude": 115.96849458,
          "latitude": 36.94535049
        },
        {
          "name": "晶橙果艺术学校",
          "address": "德百商贸城8号楼4层东侧",
          "longitude": 115.9807776,
          "latitude": 36.95479073
        },
        {
          "name": "停车场(乐普大道)",
          "address": "乐普大道东50米德州经济开发区宋官屯街道付庄小区人口学校附近",
          "longitude": 116.37911187,
          "latitude": 37.46478047
        },
        {
          "name": "宝莲华学校教职工家属院孔子楼",
          "address": "宁城街道宝莲华小区",
          "longitude": 116.7954258,
          "latitude": 37.63769243
        },
        {
          "name": "庆云县职业中等专业学校",
          "address": "青年街199号",
          "longitude": 117.36925484,
          "latitude": 37.78205325
        },
        {
          "name": "山东鲁庆培训学校",
          "address": "建设街东50米",
          "longitude": 117.37785254,
          "latitude": 37.76528859
        }
      ]
    },
    msg: '操作成功了！'
  })
}
