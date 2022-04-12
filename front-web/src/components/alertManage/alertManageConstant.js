/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-02-23 20:33:03
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-06 09:36:22
 */
const dealSteps = {
  '接警': -1,
  '分派': 0,
  "签收": 1,
  '到达': 2,
  '反馈': 3,
  '完结': 4
};
const itemTypeOptions = [
  {
    name: '治安',
    style: 'info'
  },
  {
    name: '纠纷',
    style: 'warning'
  },
  {
    name: '求助',
    style: 'danger'
  },
  {
    name: '第四级',
    style: 'mostDanger'
  }
]
export { dealSteps, itemTypeOptions }