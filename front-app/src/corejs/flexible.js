/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-08-05 11:26:51
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-08-09 09:49:07
 */
; (function (window, document) {
  var docEl = document.documentElement
  var bodyEl = document.querySelector('body')
  var sizeUI = docEl.clientWidth > 500 ? 1440 : 1080 // 定义设计图尺寸
  var remBase = (docEl.clientWidth / sizeUI) * 100 // 定义基准值

  setRemUnit()

  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) setRemUnit()
  })

  function setRemUnit() {
    var docFontSize = docEl.clientWidth / sizeUI * remBase
    docEl.style.fontSize = docFontSize + 'px'
    bodyEl.style.fontSize = 16 / docFontSize + 'rem'
    handleRemAdapt()
  }

  function handleRemAdapt() {
    var currentFontSize = parseInt(docEl.style.fontSize)
    var temp = currentFontSize
    for (var i = 0; i < 100; i++) {
      var realFontSize = parseInt(window.getComputedStyle(docEl).fontSize)
      var differ = realFontSize - currentFontSize
      if (Math.abs(differ) >= 1) {
        if (differ > 0) {
          temp--
        } else {
          temp++
        }
        docEl.style.fontSize = temp + 'px'
      } else {
        break
      }
    }
  }
})(window, document)
