/**
 * Class: hmap.Biz.BayonetTrace
 * 过车轨迹类.
 * 通过给定的路径，模拟出当前车辆的行驶轨迹，通过setPath设置路径,根据给定的数据进行按时间或距离的回放展示
 * - 等距离比例回放：在整段回放轨迹的基础上，根据轨迹回放步数将整段路程分为等距离的n段，在此每一步移动的距离是固定的；
 * - 等时间比例回放：按照传入的位置节点中的时间差值和轨迹回放展示总时间之间的比例，按照时间比例为基准进行轨迹回放。
 *
 * 示例:
 * (code)
 * var trace=new hmap.Biz.BayontTrace(map,layer,callbackMiddle,callbackStep);
 *
 * (end)
 *
 * Parameters:
 * map: - {<hmap.MapEx>} 地图对象.
 * layer: - {<hmap.vectorLayer>} 轨迹绘制图层.
 * callbackMiddle - {Object} 车辆经过卡口时的回调函数.
 * callbackStep - {Object} 车辆每前进一步的回调函数.
 */
hmap.Biz = hmap.Biz || {};
hmap.Biz.BayonetTrace = function (map, layer, callbackMiddle, callbackStep) {
  var thisObj = this;
  thisObj._distance = 0; // 整个路径的距离
  thisObj._map = map; // 绑定的地图对象
  thisObj._layer = layer; // 地图图层

  thisObj._startPoint = null;
  thisObj._beginPoint = null;
  thisObj._endPoint = null;

  thisObj._currentTempPoint = null; //小车移动临时点位
  thisObj._stopPoint = null; // 停留点
  thisObj._stopPointIndex = 1;
  thisObj.lastPointIndex = 1; // 最后一点 点位的编号
  thisObj.steepLength = 0; // 每步所移动的距离

  thisObj._timer = null; // 计时器

  thisObj._speed = 1; // 速率 *2 *4 *0.5 *0.25
  thisObj.car = null; // 移动目标矢量要素
  thisObj.status = 'pre'; //小车的移动状态 pre、complete、start、pause
  thisObj.points = null; // 保存当前轨迹的轨迹集合

  thisObj._currentAngle = 0; // 小车的旋转角度
  thisObj._stopTime = 1; // 在卡口点的停留时间
  thisObj._stopTimer = null;
  thisObj.completePath = null; // 走过的路径
  thisObj.showPath = true; // 展示道路路径
  thisObj.showPoint = true; //显示数据点

  //时间轴新增项
  thisObj.minTime = 0; // 播放时间
  thisObj.maxTime = 0; // 结束时间
  thisObj.curTime = 0; // 当前时间
  thisObj.timeRatio = 1; // 运行时间和数据时间差之间的比例
  thisObj.pathSize = 0; // 轨迹总点数

  /**
   * APIProperty: data
   * 传入点的点位的数据.
   */
  thisObj.data = null; //传入的点位数据

  /**
   * APIProperty: _interval
   * 移动一下的时间 默认每隔60ms.
   */
  thisObj._interval = 60; // 默认每隔60ms移动一下

  /**
   * APIProperty: _step
   * 在等距离回放中完成轨迹的步数，默认1000.针对于tranceByDistance为默认值true时有效
   */
  thisObj._step = 1000; //多少步完成轨迹

  /**
   * APIProperty: _pauseTime
   * 重复卡口的停留时间，默认4000.
   */
  thisObj._pauseTime = 4000; //重复卡口停留时间
  /**
   * APIProperty: _totalTime
   * 在以时间比例回放中，轨迹运行的总时间，默认为10000ms
   */
  thisObj._totalTime = 10000; //多少步完成轨迹

  /**
   * APIProperty: tranceByDistance
   * true为按等距离规则进行回放，；false为按等时间比例规则进行回放，默认为true
   * 回放规则不一致，传入的参数也存在不一致，请在setPath接口中进行区分
   */
  thisObj.tranceByDistance = true;

  /**
   * APIProperty: showCarOnPath
   * 是否显示车辆，默认true显示，如果卡的话可以将其关闭.
   */
  thisObj.showCarOnPath = true;

  /**
   * APIProperty: _style
   * 设置轨迹的样式.
   *
   * 示例:
   * (code)
   *   var _style = {
   *		"PointDraw" : { //传入位置点的显示样式
   *			pointRadius : 3,
   *			graphicName : "circle",
   *			fillColor : "#ffffff",
   *			fillOpacity : 0.8,
   *			strokeWidth : 4,
   *			strokeOpacity : 1,
   *			strokeColor : "red",
   *			graphicZIndex : 10
   *		},
   *		"Line" : { //根据传入位置点构成道路的道路样式
   *			strokeWidth : 5,
   *			strokeOpacity : 1,
   *			strokeColor : "green",
   *			graphicZIndex : 5
   *		},
   *		"CompleteLine" : {// 走过的路径样式
   *			strokeWidth : 5,
   *			strokeOpacity : 1,
   *			strokeColor : "red",
   *			graphicZIndex : 5
   *		}
   * (end)
   */
  thisObj._style = {
    PointDraw: {
      opacity: 1, //设置marker的透明度，可以为[0,1]区间内的任意值，0表示完全透明，1表示完全不透明
      imgSrc: '/static/trace/images/marker.png', //设置marker的图片路径
      size: new hmap.basetype.Size(21, 25), //设置marker的大小,单位为像素
      anchor: [0.5, 0.5], //设置图标在marker处的偏移量，为大于0的任意值，具体偏移多少可与下方的参考点作比较
      offset: new hmap.basetype.Offset(0, 0, 0)
    },
    Line: {
      width: 3,
      // Opacity: 1,
      color: [
        0,
        new hmap.style.Color(255, 216, 0, 0.6),
        1.0,
        new hmap.style.Color(253, 126, 49, 0.6)
      ]
      // graphicZIndex : 5
    },
    CompleteLine: {
      // 走过的路径样式
      width: 3, //宽度定义为1，单位为px
      color: [
        0,
        new hmap.style.Color(255, 216, 0, 1),
        1.0,
        new hmap.style.Color(253, 126, 49, 1)
      ],
      lineStyle: 'solid', //线型，包括'dot'、'dash'、'dashdot'、'longdash'、'longdashdot'和 'solid'，默认为'solid'（实线）。
      lineCap: 'butt', //线端头的形状，包括'butt'(平头)、'square'(方头)、'round'(圆头)，当前仅支持butt。
      lineJoin: 'bevel' //线连接处的形状。包括'bevel'(平角)、'miter'(尖角)、'round'(圆角)，当前仅支持bevel。
      // graphicZIndex : 5
    }
  };

  /**
   * APIMethod: setInterval
   *
   *
   * 设定轨迹每移动一步的默认时间间隔
   */
  thisObj.setInterval = function (time) {
    thisObj._interval = time;
  };

  /**
   * APIMethod: setTranceStep
   * 按距离回放中设定完成轨迹的步数，默认为1000步
   *
   * Parameters:
   *
   * step - {int} 完成轨迹所需的步数.
   *
   */
  thisObj.setTranceStep = function (step) {
    thisObj._step = step;
    thisObj.steepLength = (thisObj._distance / thisObj._step) * thisObj._speed;
  };
  /**
   * APIMethod: setTotalTime
   * 按等时间比例回放中设定完成轨迹的总时间
   *
   * Parameters:
   *
   * time - {int} 完成轨迹所需的总时间.
   *
   */
  thisObj.setTotalTime = function (time) {
    thisObj._totalTime = time;
    thisObj.timeRatio =
      thisObj._totalTime / (thisObj.maxTime - thisObj.minTime);
  };

  thisObj.startStyle = {
    opacity: 1, //设置marker的透明度，可以为[0,1]区间内的任意值，0表示完全透明，1表示完全不透明
    imgSrc: './static/trace/images/trackStart.png', //设置marker的图片路径
    size: new hmap.basetype.Size(40, 30), //设置marker的大小,单位为像素
    anchor: [0.5, 1], //设置图标在marker处的偏移量，为大于0的任意值，具体偏移多少可与下方的参考点作比较
    offset: new hmap.basetype.Offset(0, 0, 0)
    // [0, new hmap.style.Color(255, 216, 0, 0.3), 1.0, new hmap.style.Color(253, 126, 49, 0.3)]
    // opacity: 1.0
  };
  thisObj.endStyle = {
    opacity: 1, //设置marker的透明度，可以为[0,1]区间内的任意值，0表示完全透明，1表示完全不透明
    imgSrc: './static/trace/images/trackEnd.png', //设置marker的图片路径
    size: new hmap.basetype.Size(40, 30), //设置marker的大小,单位为像素
    anchor: [0.5, 1], //设置图标在marker处的偏移量，为大于0的任意值，具体偏移多少可与下方的参考点作比较
    offset: new hmap.basetype.Offset(0, 0, 0)
    // [0, new hmap.style.Color(255, 216, 0, 0.3), 1.0, new hmap.style.Color(253, 126, 49, 0.3)]
    // opacity: 1.0
  };
  thisObj.moveStyle = {
    opacity: 1, //设置marker的透明度，可以为[0,1]区间内的任意值，0表示完全透明，1表示完全不透明
    imgSrc: './static/trace/images/orbitCircle.png', //设置marker的图片路径
    size: new hmap.basetype.Size(52, 46), //设置marker的大小,单位为像素
    anchor: [0.5, 1], //设置图标在marker处的偏移量，为大于0的任意值，具体偏移多少可与下方的参考点作比较
    offset: new hmap.basetype.Offset(0, 0, 0)
  };
  /**
   * APIMethod: setStartStyle
   * 设置起始点的样式
   *
   * Parameters:
   *
   * style - {Object} 起点样式，设置起始点样式
   *
   * 示例:
   * (code)
   * var startStyle = {
   *	  radius: 1,
   *    fillColor: new hmap.style.Color(255, 216, 0, 0.6),
   *    outlineWidth: 0
   *  };
   *
   * (end)
   */
  this.setStartStyle = function (style) {
    thisObj.startStyle = style;
  };

  /**
   * APIMethod: setendStyle
   * 设置终点的样式
   *
   * Parameters:
   *
   * style - {Object} 终点样式.
   * 设置终点样式.
   */
  this.setendStyle = function (style) {
    thisObj.endStyle = style;
  };

  /**
   * APIMethod: setmoveStyle
   * 设置移动目标的样式
   *
   * Parameters:
   *
   * style - {Object} 移动点样式.
   * 设置移动目标的样式.
   */
  this.setmoveStyle = function (style) {
    thisObj.moveStyle = style;
  };

  /**
   * APIMethod: setPathShow
   * 设置是否显示轨迹线
   *
   * Parameters:
   *
   * b - {Boolean} 是否显示轨迹线，默认true，显示轨迹线.
   *
   */
  this.setPathShow = function (b) {
    thisObj.showPath = b == true;
  };
  /**
   * APIMethod: setStopTime
   * 在卡口点的停留时间设定
   */
  this.setStopTime = function (timesnap) {
    thisObj._stopTime = timesnap;
  };
  // 设定在卡口点的停留时间 ，为保证兼容性，同上setStopTime功能 一致
  this.stopTime = function (timesnap) {
    thisObj._stopTime = timesnap;
  };
  /**
   * 关联地图
   */
  this.bindMap = function (map) {
    thisObj._map = map;
  };
  /**
   * APIMethod: speed
   * 设置过车速度
   *
   * Parameters:
   *
   * speedNum - {Number} 过车速度默认1,speedNum大于1表示加速，小于1表示减速，<=0的设置无效.
   * 设置过车速度.
   */
  this.speed = function (speedNum) {
    if (speedNum <= 0) return;
    thisObj._speed = speedNum;
    if (thisObj.tranceByDistance) {
      //全局设定，计算在按照距离轨迹回放中，每移动一步的距离
      thisObj.steepLength =
        (thisObj._distance / thisObj._step) * thisObj._speed;
    }
  };
  /**
   * 不对外公开，添加起点、终点图标 以及移动小车到图层
   */
  this.addTargetStyle = function (startP, endP) {
    const moveCoord = new hmap.basetype.Coordinate(
      Number(startP._coordinate._x),
      Number(startP._coordinate._y),
      0
    );
    var moveP = new hmap.geom.Point(moveCoord);
    //更换小车样式
    let markerSymbol = new hmap.style.Icon(thisObj.moveStyle);
    // let markerSymbol = new hmap.style.Circle({
    //   radius: 1,
    //   fillColor: new hmap.style.Color(253, 126, 49, 1),
    //   outlineWidth: 0
    // })
    thisObj.car = new hmap.feature.Vector(
      moveP,
      thisObj.data[0],
      new hmap.style.Style({ markerSymbols: [markerSymbol] })
    );
    //更换起点图标为原点
    let startSymbol = new hmap.style.Icon(thisObj.startStyle);
    // let startSymbol = new hmap.style.Circle(thisObj.startStyle);
    // 	{"text":"江陵路地铁",
    // fontColor: new hmap.style.Color(255, 255, 255, 1)});
    //更换终点图标为原点
    let endSymbol = new hmap.style.Icon(thisObj.endStyle);
    // let endSymbol = new hmap.style.Circle(thisObj.endStyle);
    thisObj._startPoint = new hmap.feature.Vector(
      startP,
      null,
      new hmap.style.Style({ markerSymbols: [startSymbol] })
    );
    // thisObj.startStyle);
    thisObj._endPoint = new hmap.feature.Vector(
      endP,
      null,
      new hmap.style.Style({ markerSymbols: [endSymbol] })
    );
    // thisObj.endStyle);
    thisObj._layer.addFeatures([thisObj._endPoint, thisObj._startPoint]);

    // if (thisObj.showCarOnPath) debugger
    thisObj._layer.addFeatures([thisObj.car]);
    thisObj._layer.refresh();
  };

  /**
   * APIMethod: setPath
   * 设置轨迹路径
   *
   * Parameters:
   * data - {Object} 路径点的数组
   *
   * 示例:
   * (code)
   * var data = [ {
   * 			"id" : "KK1",  //点位id
   * 			"latitude" : "3656947", //坐标点纬度坐标
   * 			"longitude" : "13519927", //经度
   * 			"label" : "111",  //显示的标签
   * 			"crossTime" :100  // 卡口停留时间
   * 		}, {
   * 			"id" : "KK2",
   * 			"latitude" : "3657090",
   * 			"longitude" : "13520586",
   * 			"label" : "222",
   * 			"crossTime" :100
   * 		}, {
   * 			"id" : "KK3",
   * 			"latitude" : "3658227",
   * 			"longitude" : "13522277",
   * 			"label" : "333",
   * 			"crossTime" :100
   * 		}];
   *  trace.setPath(data);
   * (end)
   * 如果需要按传入的时间进行
   * (code)
   * var data = [ {
   * 			"id" : "KK1",
   * 			"latitude" : "3658227",
   * 			"longitude" : "13522277",
   * 			"label" : "333",
   * 			"crossTime" :100,
   * 			"time" :1523930914207 //数据点位上传时间
   * 		},{
   * 			"id" : "KK1",
   * 			"latitude" : "3658227",
   * 			"longitude" : "13522277",
   * 			"label" : "333",
   * 			"crossTime" :100,
   * 			"time" :1523930919207
   * 		}];
   *  trace.setPath(data);
   * (end)
   *
   */
  this.setPath = function (data, noRepeatPointList) {
    if (data == null || data == '' || data == undefined) {
      // alert(['track_data_noEmpty']) //轨迹数据不能为空
      return;
    }
    var dataLen = data.length;
    if (dataLen > 1 && noRepeatPointList.length > 1) {
      thisObj.pathSize = dataLen;
      thisObj.data = data;
      thisObj._distance = 0;
      if (thisObj.points == null) thisObj.points = new Array();
      else thisObj.points = [];
      for (var i = 0; i < dataLen; i++) {
        const coord1 = new hmap.basetype.Coordinate(
          Number(data[i].longitude),
          Number(data[i].latitude),
          0
        );
        var pt = new hmap.geom.Point(coord1);
        thisObj.points.push(pt);
        // 如果为按照距离进行回放，则在处理数据的时候，直接获取路径的总长度
        if (i > 0 && thisObj.tranceByDistance) {
          thisObj._distance += thisObj.points[i].distanceTo(
            thisObj.points[i - 1]
          );
        }
      }
      if (thisObj.tranceByDistance) {
        // 执行按照距离的方式
        //设定 每端 运行的长度
        thisObj.steepLength =
          (thisObj._distance / thisObj._step) * thisObj._speed;
      } else {
        //**    按照时间轴的方式进行回放设定        **
        // 设置轨迹开始时间
        thisObj.minTime = this.data[0].time;
        // 设置当前时间
        thisObj.curTime = thisObj.minTime;
        // 设置轨迹回放结束时间
        thisObj.maxTime = this.data[thisObj.pathSize - 1].time;
        // 设置小车的运行时间上传数据的时间差的比例，达到小车按 时间比例运行的效果
        thisObj.timeRatio =
          thisObj._totalTime / (thisObj.maxTime - thisObj.minTime);
      }
      // 计算初始化角度
      thisObj._currentAngle = thisObj.caculateAngle(
        thisObj.points[0],
        thisObj.points[1]
      );
      // 初始化起点，当前阶段的终点，以及当前点
      const beginCoord = new hmap.basetype.Coordinate(
        Number(thisObj.points[0]._coordinate._x),
        Number(thisObj.points[0]._coordinate._y),
        0
      );
      const startCoord = new hmap.basetype.Coordinate(
        Number(thisObj.points[0]._coordinate._x),
        Number(thisObj.points[0]._coordinate._y),
        0
      );
      const stopCoord = new hmap.basetype.Coordinate(
        Number(thisObj.points[1]._coordinate._x),
        Number(thisObj.points[1]._coordinate._y),
        0
      );
      const currentTempCoord = new hmap.basetype.Coordinate(
        Number(thisObj.points[0]._coordinate._x),
        Number(thisObj.points[0]._coordinate._y),
        0
      );
      // var pt = new hmap.geom.Point(coord1);
      thisObj._beginPoint = new hmap.geom.Point(beginCoord);
      thisObj._startPoint = new hmap.geom.Point(startCoord);
      thisObj._stopPoint = new hmap.geom.Point(stopCoord);
      thisObj._currentTempPoint = new hmap.geom.Point(currentTempCoord);

      thisObj.lastPointIndex = thisObj.points.length; // 设定轨迹终止点的index
      var lineString = new hmap.geom.Line(thisObj.points);
      var pointsString = new hmap.geom.MultiPoint(thisObj.points);
      const lineSymbol = new hmap.style.LineSymbol(thisObj._style['Line']);
      const lineStyle = new hmap.style.Style({ lineSymbols: [lineSymbol] });
      var lineVector = new hmap.feature.Vector(lineString, {}, lineStyle);
      var traceLineVectors = new Array();
      traceLineVectors.push(lineVector);
      if (thisObj.showPoint) {
        let markerSymbol = new hmap.style.Icon(thisObj._style['PointDraw']);
        const markerStyle = new hmap.style.Style({
          markerSymbols: [markerSymbol]
        });
        var pointVector = new hmap.feature.Vector(
          pointsString,
          {},
          markerStyle
        );
        // traceLineVectors.push(pointVector)
      }
      layer.addFeatures(traceLineVectors);
      // 添加起点,终点，移动目标
      thisObj.addTargetStyle(thisObj.points[0], thisObj.points[dataLen - 1]);
      // 改变小车的初始状态
      if (thisObj.showCarOnPath) thisObj.changeCarStatus();
      // 缩放到相应位置 hmap2.1.3点坐标重复时获取缓冲区会有问题
      // var polygon = lineString.getBuffer(0.1)
      // var extent = polygon.getExtent()
      if (!noRepeatPointList) {
        noRepeatPointList = data;
      }
      let noRepeatPoint = [];
      //无重复点位的数组
      for (var j = 0; j < noRepeatPointList.length; j++) {
        let noRepeatcoord = new hmap.basetype.Coordinate(
          Number(noRepeatPointList[j].longitude),
          Number(noRepeatPointList[j].latitude),
          0
        );
        let noRepeatPt = new hmap.geom.Point(noRepeatcoord);
        noRepeatPoint.push(noRepeatPt);
      }
      let noRepeatLine = new hmap.geom.Line(noRepeatPoint);
      var polygon = noRepeatLine.getBuffer(0.01);
      var extent = polygon.getExtent();
      map.zoomToExt(extent);
      layer.refresh();
      // map.zoomIn();
      //map.zoomToExtent(extent);
    } else {
      // alert(['point_noTrack']) //一个点不能成为轨迹
      return;
    }
  };

  /**
   * APIMethod: start
   * 开始播放轨迹.
   */
  this.start = function () {
    if (thisObj.status == 'complete') {
      thisObj.stop();
    }
    if (thisObj.status != 'start') {
      thisObj.status = 'start';
      //动起来就触发
      if (callbackMiddle != null) {
        callbackMiddle([thisObj.data[0], 0]);
      }
      if (thisObj.tranceByDistance) {
        thisObj.timeFn();
      } else {
        thisObj.play();
      }
    }
  };

  /**
   * APIMethod: pause
   * 暂停轨迹.
   */
  this.pause = function () {
    clearTimeout(thisObj._timer);
    clearTimeout(thisObj._stopTimer);
    thisObj.status = 'pause';
  };

  /**
   * APIMethod: stop
   * 停止播放轨迹.
   */
  this.stop = function () {
    clearTimeout(thisObj._timer);
    clearTimeout(thisObj._stopTimer);
    thisObj._stopPointIndex = 1;
    thisObj._currentAngle = thisObj.caculateAngle(
      thisObj.points[0],
      thisObj.points[1]
    );
    const currentTempCoord = new hmap.basetype.Coordinate(
      Number(thisObj.points[0]._coordinate._x),
      Number(thisObj.points[0]._coordinate._y),
      0
    );
    // var moveP = new hmap.geom.Point(currentTempCoord);
    thisObj._currentTempPoint = new hmap.geom.Point(currentTempCoord);
    const beginCoord = new hmap.basetype.Coordinate(
      Number(thisObj.points[0]._coordinate._x),
      Number(thisObj.points[0]._coordinate._y),
      0
    );
    thisObj._beginPoint = new hmap.geom.Point(beginCoord);
    const stopCoord = new hmap.basetype.Coordinate(
      Number(thisObj.points[1]._coordinate._x),
      Number(thisObj.points[1]._coordinate._y),
      0
    );
    thisObj._stopPoint = new hmap.geom.Point(stopCoord);
    if (!thisObj.tranceByDistance) {
      thisObj.curTime = thisObj.minTime;
    }
    thisObj.changeCarStatus();
    // thisObj.car.style.label =  thisObj.data[thisObj._stopPointIndex-1].label;
    thisObj.changePosition();
    // 清楚走过的痕迹
    if (thisObj.completePath) {
      layer.removeFeatures([thisObj.completePath]);
    }

    thisObj.completePath = null;
    thisObj.status = 'stop';
  };

  /**
   * APIMethod: resume
   * 暂停后继续播放轨迹.
   */
  this.resume = function () {
    if (thisObj.status == 'pause') {
      thisObj.status = 'pre';
      if (thisObj.tranceByDistance) {
        thisObj.timeFn();
      } else {
        thisObj.play();
      }
    }
  };

  /**
   * APIMethod: restart
   * 重新播放轨迹.不传如参数，默认为从起点到终点；
   *
   *
   * Parameters:
   * startIndex - {int} 开始播放点的下标
   * endIndex - {int} 开始播放点的下标
   */
  this.restart = function (startIndex, endIndex) {
    if (startIndex != undefined && endIndex != undefined) {
      if (
        isNaN(startIndex) ||
        isNaN(endIndex) ||
        startIndex < 0 ||
        endIndex < 0
      ) {
        alert(['replay_track_point_err']); //"重新播放轨迹点错误"
        return;
      }
      if (endIndex > thisObj.lastPointIndex - 1) {
        throw 'restart failed beacause of the endIndex is out of the range';
        return;
      }
    }
    thisObj.status = 'pre';
    thisObj.stop();
    if (startIndex == undefined || endIndex == undefined) {
      //针对常规的轨迹回放
      if (thisObj.tranceByDistance) {
        // 按距离轨迹回放
        thisObj.lastPointIndex = thisObj.points.length; // 设置全局 终止点的 index
      } else {
        // 按时间轨迹回放
        thisObj.curTime = thisObj.data[0].time;
        thisObj.maxTime = thisObj.maxTime = this.data[
          thisObj.pathSize - 1
        ].time;
      }
      thisObj.lastPointIndex = thisObj.points.length;
      // thisObj.car.style.label =  thisObj.data[0].label;
      thisObj.start();
    } else {
      // 针对设定起止点的轨迹回放
      // 用于重新播放的两个标记
      if (thisObj.tranceByDistance) {
        thisObj.lastPointIndex = endIndex + 1; // 设置全局 终止点的 index
      } else {
        thisObj.maxTime = thisObj.data[endIndex].time;
        thisObj.curTime = thisObj.data[startIndex].time;
      }
      const currentTempCoord = new hmap.basetype.Coordinate(
        Number(thisObj.points[startIndex]._coordinate._x),
        Number(thisObj.points[startIndex]._coordinate._y),
        0
      );
      const stopCoord = new hmap.basetype.Coordinate(
        Number(thisObj.points[startIndex + 1]._coordinate._x),
        Number(thisObj.points[startIndex + 1]._coordinate._y),
        0
      );
      // var moveP = new hmap.geom.Point(currentTempCoord);
      thisObj._beginPoint = new hmap.geom.Point(currentTempCoord);
      thisObj._startPoint = new hmap.geom.Point(currentTempCoord);
      thisObj._stopPoint = new hmap.geom.Point(stopCoord);
      thisObj._stopPointIndex = startIndex + 1;
      thisObj._currentTempPoint = thisObj._startPoint;
      thisObj.changePosition();
      thisObj._currentAngle = thisObj.caculateAngle(
        thisObj.points[startIndex],
        thisObj.points[startIndex + 1]
      );
      thisObj.changeCarStatus();
      // thisObj.car.style.label =  thisObj.data[startIndex].label;
      thisObj.start();
    }
  };

  // 两个destory 其中一个存在拼写错误；保证兼容下未删除掉
  this.destory = function () {
    clearTimeout(thisObj._timer);
    clearTimeout(thisObj._stopTimer);
    const result = layer.getAllFeatures();
    layer.removeAllFeatures();
    thisObj == null;
  };

  /**
   * APIMethod: destroy
   * 销毁轨迹播放.
   */
  this.destroy = this.destory;
  /**
   * Method : timeFn
   * 按距离进行轨迹回放的
   */
  this.timeFn = function () {
    //如果轨迹已经播放结束，则继续无效
    if (thisObj.status == 'complete') {
      return;
    }
    var curstop = thisObj._stopPointIndex;
    // 如果两个点重合则原点移动
    if (
      thisObj._beginPoint._coordinate._x == thisObj._stopPoint._coordinate._x &&
      thisObj._beginPoint._coordinate._y == thisObj._stopPoint._coordinate._y
    ) {
      //thisObj._pauseTime  为需要改造项，在此特殊声明
      thisObj._stopTimer = setTimeout(
        thisObj.moveTheSamePoint,
        thisObj._pauseTime / thisObj._speed
      );
      return;
    }
    // 如果起点和终点一样则停留4s直接到下一个点
    thisObj.getNextPoint();
    // 移动目标
    thisObj.changePosition();
    // 填充已经走过的路线
    thisObj.fillPath();
    // 判断是否移动到地图范围外面，如果则重置地图中心点
    if (
      map.getExtent().left > thisObj._currentTempPoint._coordinate._x ||
      map.getExtent().bottom > thisObj._currentTempPoint._coordinate._y ||
      map.getExtent().right < thisObj._currentTempPoint._coordinate._x ||
      map.getExtent().top < thisObj._currentTempPoint._coordinate._y
    ) {
      map.setCenter(
        new hmap.basetype.Coordinate(
          thisObj._currentTempPoint._coordinate._x,
          thisObj._currentTempPoint._coordinate._y,
          0
        )
      );
    }
    //  如果超出，则跳出循环
    if (thisObj._stopPointIndex > thisObj.lastPointIndex - 1) {
      thisObj.status = 'complete';
      clearTimeout(thisObj._timer);
      return;
    }
    // if为在卡口点之间的移动，不需要考虑卡口点停留时间，else为在卡口点的移动，需要考虑卡口点停留时间
    if (curstop == thisObj._stopPointIndex) {
      thisObj._timer = setTimeout(thisObj.timeFn, thisObj._interval);
    } else {
      var passTime =
        thisObj.data[thisObj._stopPointIndex - 1].crossTime != undefined
          ? thisObj.data[thisObj._stopPointIndex - 1].crossTime
          : thisObj._stopTime * 1000;
      thisObj._timer = setTimeout(thisObj.timeFn, passTime);
    }
  };
  /**
   * 按距离进行回放时 获取下一个点的点位信息
   */
  this.getNextPoint = function () {
    // 计算一步移动的距离
    if (thisObj._currentAngle == 0) {
      // x+轴
      thisObj._currentTempPoint._coordinate._x += thisObj.steepLength;
    } else if (thisObj._currentAngle < Math.PI / 2) {
      // 第一象限
      thisObj._currentTempPoint._coordinate._x +=
        thisObj.steepLength * Math.cos(thisObj._currentAngle);
      thisObj._currentTempPoint._coordinate._y +=
        thisObj.steepLength * Math.sin(thisObj._currentAngle);
    } else if (thisObj._currentAngle == Math.PI / 2) {
      // y+轴
      thisObj._currentTempPoint._coordinate._y += thisObj.steepLength;
    } else if (thisObj._currentAngle < Math.PI) {
      // 第二象限
      thisObj._currentTempPoint._coordinate._x -=
        thisObj.steepLength * Math.cos(Math.PI - thisObj._currentAngle);
      thisObj._currentTempPoint._coordinate._y +=
        thisObj.steepLength * Math.sin(Math.PI - thisObj._currentAngle);
    } else if (thisObj._currentAngle == Math.PI) {
      // x-轴
      thisObj._currentTempPoint._coordinate._x -= thisObj.steepLength;
    } else if (thisObj._currentAngle < (Math.PI * 3) / 2) {
      // 第三象限
      thisObj._currentTempPoint._coordinate._x -=
        thisObj.steepLength * Math.cos(thisObj._currentAngle - Math.PI);
      thisObj._currentTempPoint._coordinate._y -=
        thisObj.steepLength * Math.sin(thisObj._currentAngle - Math.PI);
    } else if (thisObj._currentAngle == (Math.PI * 3) / 2) {
      // y-轴
      thisObj._currentTempPoint._coordinate._y -= thisObj.steepLength;
    } else if (thisObj._currentAngle < Math.PI * 2) {
      // 第四象限
      thisObj._currentTempPoint._coordinate._x +=
        thisObj.steepLength * Math.cos(2 * Math.PI - thisObj._currentAngle);
      thisObj._currentTempPoint._coordinate._y -=
        thisObj.steepLength * Math.sin(2 * Math.PI - thisObj._currentAngle);
    }
    var dst = thisObj._currentTempPoint.distanceTo(thisObj._stopPoint);
    // 如果离停止点的具体小于分段则下一点直接是停止点
    if (dst <= thisObj.steepLength) {
      thisObj._currentTempPoint._coordinate._x =
        thisObj._stopPoint._coordinate._x;
      thisObj._currentTempPoint._coordinate._y =
        thisObj._stopPoint._coordinate._y;
      // 抛出回调
      if (callbackMiddle != null) {
        callbackMiddle([
          thisObj.data[thisObj._stopPointIndex],
          thisObj._stopPointIndex
        ]);
      }
      //新增设定一个lastPointIndex的参数，
      if (thisObj._stopPointIndex < thisObj.lastPointIndex - 1) {
        thisObj._stopPointIndex++;
        // 更新终止节点
        thisObj._stopPoint = thisObj.points[thisObj._stopPointIndex];
        // 更新该段的开始点
        thisObj._beginPoint = thisObj.points[thisObj._stopPointIndex - 1];
        // 重新计算新的分段的角度
        thisObj._currentAngle = thisObj.caculateAngle(
          thisObj._currentTempPoint,
          thisObj._stopPoint
        );
        // 重新改变移动点的角度
        thisObj.changeCarStatus();
        //改变标签点的样式
        // thisObj.car.style.label =  thisObj.data[thisObj._stopPointIndex-1].label;
      } else {
        thisObj._stopPointIndex++;
      }
    } else {
      if (callbackStep != null) {
        callbackStep([
          thisObj.data[thisObj._stopPointIndex - 1],
          thisObj._currentTempPoint,
          thisObj._stopPointIndex - 1,
          thisObj._currentAngle
        ]);
      }
    }
  };
  /**
   * Method: play
   * 按给定的时间进行播放轨迹.
   */
  this.play = function () {
    //如果轨迹已经播放结束，则继续无效
    if (thisObj.status == 'complete') {
      return;
    }
    // 当前点是最后一个点，停止
    if (thisObj._stopPointIndex == thisObj.pathSize) {
      return;
    }
    if (thisObj.curTime > thisObj.maxTime) {
      return;
    }
    // 如果两个点重合则原点移动 -------------需要注意的点
    if (
      thisObj._beginPoint._coordinate._x == thisObj._stopPoint._coordinate._x &&
      thisObj._beginPoint._coordinate._y == thisObj._stopPoint._coordinate._y
    ) {
      thisObj._stopTimer = setTimeout(
        thisObj.moveTheSamePoint,
        (thisObj._pauseTime / thisObj._speed) * thisObj.timeRatio
      );
      return;
    }
    var curstop = thisObj._stopPointIndex;
    // 执行回放操作
    thisObj.execute();
    // 移动目标
    thisObj.changePosition();
    // 填充已经走过的路线
    thisObj.fillPath();
    // 判断是否移动到地图范围外面，如果则重置地图中心点
    if (
      map.getExtent().left > thisObj._currentTempPoint._coordinate._x ||
      map.getExtent().bottom > thisObj._currentTempPoint._coordinate._y ||
      map.getExtent().right < thisObj._currentTempPoint._coordinate._x ||
      map.getExtent().top < thisObj._currentTempPoint._coordinate._y
    ) {
      map.setCenter(
        new hmap.basetype.Coordinate(
          thisObj._currentTempPoint._coordinate._x,
          thisObj._currentTempPoint._coordinate._y,
          0
        )
      );
    }
    // 递归调用
    if (thisObj._stopPointIndex > thisObj.pathSize - 1) {
      thisObj.status = 'complete';
      clearTimeout(thisObj._timer);
      return;
    }
    // 在卡口之间路段内匀速回放
    if (curstop == thisObj._stopPointIndex) {
      thisObj._timer = setTimeout(
        thisObj.play,
        (thisObj._interval / thisObj._speed) * thisObj.timeRatio
      );
    } else {
      // 在卡口点停留
      var passTime =
        thisObj.data[thisObj._stopPointIndex - 1].crossTime != undefined
          ? thisObj.data[thisObj._stopPointIndex - 1].crossTime
          : thisObj._stopTime * 1000;
      thisObj._timer = setTimeout(thisObj.play, passTime * thisObj.timeRatio);
    }
  };
  /**
   * Method: execute
   * 按给定的时间播放轨迹,执行步进距离。
   */
  this.execute = function () {
    //增添部分时间容错机制
    if (
      thisObj.data[thisObj._stopPointIndex].time ===
      thisObj.data[thisObj._stopPointIndex - 1].time
    ) {
      thisObj._currentTempPoint._coordinate._y =
        thisObj._stopPoint._coordinate._y;
      thisObj._currentTempPoint._coordinate._x =
        thisObj._stopPoint._coordinate._x;
    } else {
      var xFactor =
        (thisObj._stopPoint._coordinate._x -
          thisObj._beginPoint._coordinate._x) /
        (thisObj.data[thisObj._stopPointIndex].time -
          thisObj.data[thisObj._stopPointIndex - 1].time);
      var yFactor =
        (thisObj._stopPoint._coordinate._y -
          thisObj._beginPoint._coordinate._y) /
        (thisObj.data[thisObj._stopPointIndex].time -
          thisObj.data[thisObj._stopPointIndex - 1].time);
      var x =
        parseFloat(thisObj._beginPoint._coordinate._x) +
        xFactor *
          (thisObj.curTime - thisObj.data[thisObj._stopPointIndex - 1].time);
      var y =
        parseFloat(thisObj._beginPoint._coordinate._y) +
        yFactor *
          (thisObj.curTime - thisObj.data[thisObj._stopPointIndex - 1].time);
      // 计算当前轨迹位置
      thisObj._currentTempPoint._coordinate._y = y;
      thisObj._currentTempPoint._coordinate._x = x;
    }
    // 设置当前回放的时间
    thisObj.curTime =
      parseFloat(thisObj.curTime) + parseFloat(thisObj._interval);
    // 如果时间超过当前路段终点的时间，则进行下一路段的回放
    if (thisObj.curTime > thisObj.data[thisObj._stopPointIndex].time) {
      // 抛出回调
      if (callbackMiddle != null) {
        callbackMiddle([
          thisObj.data[thisObj._stopPointIndex],
          thisObj._stopPointIndex
        ]);
      }
      if (thisObj._stopPointIndex < thisObj.pathSize - 1) {
        thisObj._stopPointIndex++;
        // 更新路段终止节点
        thisObj._stopPoint = thisObj.points[thisObj._stopPointIndex];
        // 更新该段的开始节点
        thisObj._beginPoint = thisObj.points[thisObj._stopPointIndex - 1];
        // 重新计算新的分段的角度
        thisObj._currentAngle = thisObj.caculateAngle(
          thisObj._beginPoint,
          thisObj._stopPoint
        );
        // 重新改变移动点的角度
        thisObj.changeCarStatus();
        // thisObj.car.style.label =  thisObj.data[thisObj._stopPointIndex-1].label;// 改变移动点的标记点样式
      } else {
        thisObj._stopPointIndex++;
      }
    } else {
      // 在当前路段回放
      if (callbackStep != null) {
        // 抛出内插点的回调
        callbackStep([
          thisObj.data[thisObj._stopPointIndex - 1],
          thisObj._currentTempPoint,
          thisObj._stopPointIndex - 1,
          thisObj._currentAngle
        ]);
      }
    }
  };
  /**
   * 当起止点的位置相同时的特殊情况的处理
   */
  this.moveTheSamePoint = function () {
    thisObj._currentTempPoint._coordinate._x =
      thisObj._stopPoint._coordinate._x;
    thisObj._currentTempPoint._coordinate._y =
      thisObj._stopPoint._coordinate._y;
    thisObj._beginPoint = thisObj._stopPoint;
    // 抛出回调
    if (callbackMiddle != null) {
      callbackMiddle([
        thisObj.data[thisObj._stopPointIndex],
        thisObj._stopPointIndex
      ]);
    }
    //如果是最后一个重复点
    if (thisObj._stopPointIndex == thisObj.points.length - 1) {
      thisObj.status = 'complete';
      return;
    }
    if (thisObj._stopPointIndex < thisObj.points.length - 1) {
      thisObj._stopPointIndex++;
      thisObj._stopPoint = thisObj.points[thisObj._stopPointIndex];
    }
    thisObj._currentAngle = thisObj.caculateAngle(
      thisObj._currentTempPoint,
      thisObj._stopPoint
    );
    thisObj.changeCarStatus();
    if (thisObj.tranceByDistance) {
      //
      thisObj.timeFn();
    } else {
      //改变当前点位的当前时间，以适应向下时跳转到下一个点
      thisObj.curTime = thisObj.data[thisObj._stopPointIndex - 1].time;
      thisObj.play();
    }
  };

  /**
   * Method: caculateAngle
   * 根据传入的两个点，计算路径角度；用于显示移动轨迹的方向
   */
  this.caculateAngle = function (startPoint, endPoint) {
    var startx = startPoint._coordinate._x;
    var starty = startPoint._coordinate._y;
    var endx = endPoint._coordinate._x;
    var endy = endPoint._coordinate._y;
    if (startx == endx) {
      if (endy > starty) return Math.PI / 2;
      else return (Math.PI * 3) / 2;
    } else if (starty == endy) {
      if (endx > startx) return 0;
      else return Math.PI;
    } else {
      var angle = Math.atan(Math.abs((endy - starty) / (endx - startx)));
      if (endx > startx && endy > starty) {
        // 第一象限
        return angle;
      } else if (endx < startx && endy > starty) {
        // 第二象限
        return Math.PI - angle;
      } else if (endx < startx && endy < starty) {
        // 第三象限
        return angle + Math.PI;
      } else {
        return 2 * Math.PI - angle;
      }
    }
  };
  /**
   * Method: changeCarStatus
   * 改变小车的车头朝向
   */
  this.changeCarStatus = function () {
    // thisObj.car._style._markerSymbols[0]["_rotation"] = -thisObj._currentAngle * 180 / Math.PI;
    thisObj.car._style._markerSymbols[0].setRotation(
      (-thisObj._currentAngle * 180) / Math.PI
    );
  };
  /**
   * Metod :changePosition
   * 用于移动时改变小车的位置，实现移动的效果
   */
  this.changePosition = function () {
    var toV = new hmap.basetype.Coordinate(
      thisObj._currentTempPoint._coordinate._x,
      thisObj._currentTempPoint._coordinate._y,
      0
    );

    // layer.redraw(thisObj.car);
    thisObj._layer.removeFeatures([thisObj.car]);
    thisObj.car = thisObj.car.copyTo(toV);
    thisObj._layer.addFeatures([thisObj.car]);
    thisObj._layer.refresh();
  };
  /**
   * Method :restPosition
   * 重新设定小车的位置
   */
  this.resetPosition = function () {
    var toV = new hmap.basetype.Coordinate(
      thisObj.data[0].longitude,
      thisObj.data[0].latitude,
      0
    );
    thisObj._layer.removeFeatures([thisObj.car]);
    thisObj.car = thisObj.car.copyTo(toV);
    thisObj._layer.addFeatures([thisObj.car]);
    thisObj._layer.refresh();
    // layer.redraw(thisObj.car);
  };
  thisObj.fillpathArr = [];
  /**
   * Method : fillPath
   * 填充已走过的路径
   */
  this.fillPath = function () {
    if (!thisObj.showPath) return;
    if (thisObj.completePath != null) {
      layer.removeFeatures([thisObj.completePath]);
      thisObj.completePath = null;
    }
    thisObj.fillPathArr = [];
    for (var i = 0; i < thisObj._stopPointIndex; i++) {
      thisObj.fillPathArr.push(thisObj.points[i]);
    }
    // thisObj._currentTempPoint.calculateBounds();
    thisObj.fillPathArr.push(thisObj._currentTempPoint);
    var lineString = new hmap.geom.Line(thisObj.fillPathArr);
    const lineSymbol = new hmap.style.LineSymbol(
      thisObj._style['CompleteLine']
    );
    const lineStyle = new hmap.style.Style({ lineSymbols: [lineSymbol] });
    thisObj.completePath = new hmap.feature.Vector(lineString, {}, lineStyle);
    // thisObj.completePath = new hmap.feature.Vector(lineString, {},
    // 		thisObj._style["CompleteLine"]);
    layer.addFeatures([thisObj.completePath]);
    // layer.refresh();
  };
};
