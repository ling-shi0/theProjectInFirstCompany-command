/*
 * @Description: 发布订阅模式 优于Bus的一点是 多了一层类似VUEX的数据存储共享能力 
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-05-19 19:28:18
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-20 13:41:25
 */
class NativeEventEmitter {

  /**
   * 构造函数
   * @param {*} x reactiveData表示响应式数据
   * @param {*} y storage表示存储的数据对象
   */
  constructor(x = {}, y = {}) {
    this.reactiveData = Object.assign({}, x);
    this.storage = Object.assign({}, y);
  }

  /**
   * 
   * @param {*} data 
   */
  setStorageData(data) {
    this.storage = Object.assign({}, data);
  }

  getStorageData() {
    return this.storage
  }

  removeStorageData(key) {
    this.storage[key] = null
  }

  /**
   * 
   * @param {*} event 
   * @param {*} cb 
   */
  $on(event, cb) {

    cb()
  }


  /**
   * 
   * @param {*} event 
   * @param {*} data 
   */
  $emit(event, data) {

  }

  $off() {

  }
}
