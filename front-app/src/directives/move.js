/*
 * @Description: 手势事件的指令封装 
  使用方法 例 <div v-move="{start,move,end,left2Right,right2Left,top2Bottom,bottom2Top}"></div>
  (按需引入这些函数，不需要每一个都引用一下)  
  之后需要在vue实例的 methods中分别定义每一个函数回调即可
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-05-20 19:31:27
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-22 10:25:34
 */
export default {
  bind: (el, binding) => {
    /**
     *  判断是PC端还是移动端
     *  通过不同的设备定义不同的事件名
     */
    const isMobile =
      navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      ) !== null
    const [start, move, end] = isMobile
      ? ['touchstart', 'touchmove', 'touchend']
      : ['mousedown', 'mousemove', 'mouseup']

    let touch = {}
    /**
     *  开始触摸
     *  执行触摸回调函数
     *  监听滑动事件
     *  监听触摸结束事件
     *  监听阻止移动端屏幕移动事件
     */
    const startFun = e => {
      judgeBindValue('start', e)
      el.addEventListener(move, moveFun)
      el.addEventListener(end, endFun)
      // 这个是个问题 因为存在不让移动 但是有时候还需要他移动 
      // 所以当不是全局情况下使用这个指令的时候 再把这个代码解开注释
      // window.addEventListener('touchmove', prevent, {
      //   passive: false
      // })
      // 开始滑动的x轴坐标
      touch.startX = e.changedTouches[0].pageX;
      touch.startY = e.changedTouches[0].pageY;
      touch.startTime = new Date().getTime();
    }
    /**
     *  开始滑动
     *  执行滑动回调函数
     */
    const moveFun = e => {
      judgeBindValue('move', e)
      let moveEndX = e.changedTouches[0].pageX;
      let moveEndY = e.changedTouches[0].pageY;
      touch.X = moveEndX - touch.startX;
      touch.Y = moveEndY - touch.startY;
    }
    /**
     *  结束触摸
     *  执行结束触摸回调函数
     *  销毁滑动事件
     *  销毁结束触摸事件
     *  销毁阻止移动屏幕事件
     */
    const endFun = e => {
      judgeBindValue('end', e)
      el.removeEventListener(move, moveFun)
      el.removeEventListener(end, endFun)
      window.removeEventListener('touchmove', prevent)
      touch.endTime = new Date().getTime();
      // 判断一下时间差  太短则认为是在点击 否则是在划动
      const isTouch = touch.endTime - touch.startTime < 200 ? true : false;
      if (Math.abs(touch.X) > Math.abs(touch.Y) && touch.X > 0) {
        if (!isTouch) judgeBindValue('left2Right', e, touch.startX)
        console.log("left 2 right");
      }
      else if (Math.abs(touch.X) > Math.abs(touch.Y) && touch.X < 0) {
        if (!isTouch) judgeBindValue('right2Left', e)
        console.log("right 2 left");
      }
      else if (Math.abs(touch.Y) > Math.abs(touch.X) && touch.Y > 0) {
        if (!isTouch) judgeBindValue('top2Bottom', e)
        console.log("top 2 bottom");
      }
      else if (Math.abs(touch.Y) > Math.abs(touch.X) && touch.Y < 0) {
        if (!isTouch) judgeBindValue('bottom2Top', e)
        console.log("bottom 2 top");
      }
      else {
        console.log("just touch");
      }
    }
    /**
     *  阻止移动端屏幕移动
     */
    const prevent = e => {
      e.preventDefault()
    }

    const judgeBindValue = (funName, ...args) => {
      if (binding.value && binding.value[funName]) {
        binding.value[funName](args)
      }
    }
    /**
     *  监听触摸事件
     */
    el.addEventListener(start, startFun)
  }
}

