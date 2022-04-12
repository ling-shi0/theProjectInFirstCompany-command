import Vue from 'vue';
export default class MapUtil {
  /**
   * @param {String} id 地图容器id
   * @param {Object} tileLayerConfig 切片地图配置,包含了initLonLat，initLevel，hmapHvtUrl，clusterLayer，hmapStyleUrl
   * @param {Function} mapLoaded 地图切片加载完成回调
   */
  constructor(id, tileLayerConfig, mapLoaded) {
    this.id = id;
    this.tileLayerConfig = tileLayerConfig;
    // this.tileLayerConfig = Object.assign(
    //   {
    //     initLonLat: '120.216039_30.212898',
    //     initLevel: '17',
    //     hmapHvtUrl: 'http://10.33.43.58:1709/hmap-server/hvt/',
    //     clusterLayer: '18',
    //     hmapStyleUrl: {
    //       white:
    //         'http://10.33.43.58:1709/hmap-server/hvtStyles/-white/MapStyle.json',
    //       blue:
    //         'http://10.33.43.58:1709/hmap-server/hvtStyles/-blue/MapStyle.json'
    //     }
    //   },
    //   tileLayerConfig
    // );
    this.mapLoaded = mapLoaded;
    this.map = null;
    this.plot = null;
    this.plotDragCircle = null;
    this.layers = {};
    this.spatialVectorLayer = null;
    this.dragCircleLayer = null;
    this.overlayDragBtnLayer = null;
    this.mouseTip = null;
    this.measureControl = null;
  }
  coordCallback(coord) {
    const arr = hmap.proj.Transformer.GCJ02ToWGS84([coord._x, coord._y]);
    return new hmap.basetype.Coordinate(Number(arr[0]), Number(arr[1]));
  }
  createCoord(lon, lat) {
    const arr = hmap.proj.Transformer.WGS84ToGCJ02([lon, lat]);
    if (this.tileLayerConfig.type === 'gaode') {
      return hmap.proj.Transformer.transform(
        new hmap.basetype.Coordinate(Number(arr[0]), Number(arr[1]), 0),
        4326,
        3857
      );
    } else {
      return new hmap.basetype.Coordinate(Number(lon), Number(lat), 0);
    }
  }
  getBbox() {
    if (this.tileLayerConfig.type === 'gaode') {
      const extent = this.map.getExtent();
      const extent1 = this.extentTransformer(extent);
      return extent1.toString();
    } else {
      return this.map.getExtent().toString();
    }
  }
  // 获取当前屏幕wkt
  getWKT() {
    const ext = this.map.getExtent();
    let geom;
    if (this.tileLayerConfig.type === 'gaode') {
      const ext1 = this.extentTransformer(ext);
      geom = hmap.geom.Polygon.fromExtent(ext1);
    } else {
      geom = hmap.geom.Polygon.fromExtent(ext);
    }

    const wkt = new hmap.format.WKT();
    return wkt.writeGeometry(geom, 2);
  }
  outputCoord(lon, lat) {
    if (this.tileLayerConfig.type === 'gaode') {
      const coord = hmap.proj.Transformer.transform(
        new hmap.basetype.Coordinate(Number(lon), Number(lat), 0),
        3857,
        4326
      );
      const arr = hmap.proj.Transformer.GCJ02ToWGS84([coord._x, coord._y]);
      coord._x = arr[0];
      coord._y = arr[1];
      return coord;
    } else {
      return new hmap.basetype.Coordinate(Number(lon), Number(lat), 0);
    }
  }
  outputGeom(geom) {
    if (this.tileLayerConfig.type === 'gaode') {
      let transGeo = geom.clone();
      transGeo = transGeo.transform(3857, 4326);
      transGeo.applyTransform(this.coordCallback);
      return transGeo;
    } else {
      return geom;
    }
  }
  extentTransformer(extent) {
    const left_bottom = this.outputCoord(extent._left, extent._bottom);
    const right_top = this.outputCoord(extent._right, extent._top);
    extent._left = left_bottom._x;
    extent._bottom = left_bottom._y;
    extent._top = right_top._y;
    extent._right = right_top._x;
    return extent;
  }
  /**
   * @description:地图初始化
   * @param {*}
   * @return {*}
   * @author: caokeke
   */
  initHvtMap() {
    const lonlatAry = this.tileLayerConfig.initLonLat.split('_');
    const mapOptions = {
      zoom: Number(this.tileLayerConfig.initLevel), // 初始级别：初始化地图的默认级别
      // zoom: 15,
      // center: new hmap.basetype.Coordinate(13361647.26, 3546054.67, 0),
      center: this.createCoord(lonlatAry[0], lonlatAry[1]), // 中心点：初始化地图的默认中心位置
      crs: new hmap.proj.Crs(4326)
      // crs: new hmap.proj.Crs('900913')
    };
    // 创建地图对象
    this.map = new hmap.Map(this.id, mapOptions);
    // this.mapUtil = new MapUtil(this.map)
    const vtOptions = {
      matrixOrigin: new hmap.basetype.Coordinate(-180, 90), // 切片原点
      dataFormat: 'hvt', // 切片格式
      labelOn: true, // 是否显示文字标注
      isLGD: true,
      styleUrl: this.tileLayerConfig.styleUrl, //矢量切片样式文件地址
      isRTE: true
      // useLocalStorage: true,
      // gridSize: new hmap.basetype.Size(Number(this.gridSize), Number(this.gridSize)),
    };
    const vectilelayer = new hmap.layer.VectorTileLayer(
      '矢量切片图层',
      this.tileLayerConfig.vtUrl,
      vtOptions
    );
    // 获取chars.json和chars.png使用
    vectilelayer.updateChars(this.tileLayerConfig.vtUrl, false);
    // 将图层添加至地图对象
    this.map.addLayer(vectilelayer);
    let that = this;
    vectilelayer.event.addListener(
      EventType.LAYEREVENT_LOADEND,
      function(event) {
        that.mapLoaded();
      },
      false,
      true
    );
  }
  initGaodeMap() {
    const lonlatAry = this.tileLayerConfig.initLonLat.split('_');
    const lonlatAry1 = this.createCoord(
      Number(lonlatAry[0]),
      Number(lonlatAry[1])
    );
    const mapOptions = {
      zoom: Number(this.tileLayerConfig.initLevel), // 初始级别：初始化地图的默认级别
      center: lonlatAry1,
      // center: new hmap.basetype.Coordinate(13361647.26, 3546054.67, 0),
      crs: new hmap.proj.Crs('900913')
    };
    this.map = new hmap.Map(this.id, mapOptions);
    const tmslayer = new hmap.layer.TMSLayer(
      'test',
      this.tileLayerConfig.vtUrl,
      {
        matrixOrigin: new hmap.basetype.Coordinate(
          -20037508.3427892,
          20037508.3427892
        ),
        dataFormat: 'png',
        // dataMaxLevel: 16,
        visibility: true,
        resolutions: [
          156543.0339279998,
          78271.5169639999,
          39135.7584820001,
          19567.8792409999,
          9783.93962049996,
          4891.96981024998,
          2445.98490512499,
          1222.99245256249,
          611.49622628138,
          305.7481128,
          152.8740565704,
          76.4370282850732,
          38.2185141425366,
          19.1092570712683,
          9.55462853563415,
          4.77731426794937,
          2.38865713397468,
          1.19432856685505,
          0.597164283559817,
          0.298582141647617
        ]
      }
    );
    this.map.addLayer(tmslayer, 0); //添加TMS图层并将图层z-index设置为0
    this.mapLoaded();
    // let that = this;
    // tmslayer.event.addListener(
    //   EventType.LAYEREVENT_LOADEND,
    //   function(event) {
    //     that.mapLoaded();
    //   },
    //   false,
    //   true
    // );
  }
  /**
                  * @description:获取map
                  * @param {*}
                  * @return {hmap.map}
      {}            * @author: caokeke
                  */
  getMap() {
    return this.map;
  }
  // 构建点
  createPoint(item) {
    const coord = this.createCoord(
      Number(item.longitude),
      Number(item.latitude)
    );
    const point = new hmap.geom.Point(coord);
    return point;
  }
  // 构建feature
  createFeature(item) {
    const point = this.createPoint(item);
    const feature = new hmap.feature.Vector(point, item);
    return feature;
  }
  //vue面板点位
  addVueMarker(component, propsData, mapParam) {
    const orbitTemplate = Vue.extend(component);
    const infoContent = new orbitTemplate({
      propsData: propsData
    });
    const ele = infoContent.$mount().$el;
    mapParam = Object.assign(
      {
        feature: null, // 唯一值
        ele: ele, // 如果不需要设置显示隐藏，使用默认值即可
        name: null,
        times: false, // 是否多次
        offsetX: 0,
        offsetY: 0
      },
      mapParam
    );
    this.addInfoTemplate(mapParam);
  }
  // 添加弹框
  addInfoTemplate(param) {
    param = Object.assign(
      {
        feature: null, //唯一值
        ele: null, //如果不需要设置显示隐藏，使用默认值即可
        name: null,
        times: false, //是否多次
        offsetX: 0,
        offsetY: 0
      },
      param
    );
    let overlay = this.map.getLayersByName(param.name)[0];
    if (!overlay) {
      overlay = new hmap.layer.OverlayLayer(param.name);
      this.map.addLayer(overlay);
    }
    if (!param.feature._attributes.longitude) {
      return;
    }
    const coord1 = this.createCoord(
      Number(param.feature._attributes.longitude),
      Number(param.feature._attributes.latitude)
    );
    const simplePopup = new hmap.overlay.SimplePopup({
      domId: param.feature._attributes.id,
      location: coord1,
      element: param.ele,
      offset: new hmap.basetype.Offset(param.offsetX, param.offsetY, 0),
      feature: param.feature
    });
    // 是否只存在一个弹框
    if (!param.times) {
      overlay.removeAllOverlays();
    }
    overlay.addOverlay(simplePopup);
  }

  // 移除弹框
  removeInfoTemplate(name) {
    const overlay = this.map.getLayersByName(name)[0];
    if (overlay) {
      overlay.removeAllOverlays();
    }
  }

  // 获取当前屏幕wkt
  // getWKT() {
  //   const ext = this.map.getExtent();
  //   const geom = hmap.geom.Polygon.fromExtent(ext);
  //   const wkt = new hmap.format.WKT();
  //   return wkt.writeGeometry(geom, 2);
  // }
  clearAll(layerName) {
    if (this.map) {
      const layer = this.map.getLayersByName(layerName)[0];
      if (layer) {
        layer.removeAllFeatures();
      }
    }
  }
  clearAllOverlay(layerName) {
    const layer = this.map.getLayersByName(layerName)[0];
    if (layer) {
      layer.removeAllOverlays();
    }
  }
  getOverlays(layerName) {
    const layer = this.map.getLayersByName(layerName)[0];
    if (layer) {
      return layer.getAllOverlays();
    } else {
      return null;
    }
  }
  clearDragCircle() {
    this.clearAllOverlay('overlayDragBtn');
    this.clearAll('拖拽圆图层');
  }
  _addDefaultStyle(layer, param) {
    const plotStyle = new hmap.style.Style({
      // 保存绘制要素的图层
      fillSymbols: [new hmap.style.ColorFill(param.fillColor)],
      markerSymbols: [
        new hmap.style.Circle({
          radius: 7,
          fillColor: new hmap.style.Color(255, 255, 255, 0.1),
          outlineColor: param.strokeColor,
          outlineWidth: 3
        })
      ],
      lineSymbols: [
        new hmap.style.LineSymbol({
          color: param.strokeColor,
          width: param.strokeWidth
        })
      ]
    });
    layer.setStyle(plotStyle);
  }
  clearDraw() {
    this.removeMouseTip();
    this.plotDragCircle.setPlotType(undefined); // 将plot的type属性设为undefined
    this.plotDragCircle.deactivate();
  }
  drawDragCircle(param) {
    this.clearDragCircle();
    this.clearMeasureControl();
    if (this.plotDragCircle) {
      this.map.removeControl(this.plotDragCircle);
      this.plotDragCircle = null;
    }
    param = Object.assign(
      {
        type: null, // 图形类型 point,polyline,rectangle, polygon, circle
        drawCallBack: null, // 绘制完成的事件
        cancelBack: () => {}, // 取消回调事件
        distance: 500, // 点选的时候需要传入半径，默认500米
        fillColor: new hmap.style.Color(0, 136, 255, 0.2),
        strokeColor: new hmap.style.Color(0, 136, 255, 1),
        strokeWidth: 2,
        isTransform: true, // 是否转换坐标系
        pic: null //拖拽圆按钮必传
      },
      param
    );
    if (!this.plotDragCircle) {
      if (!this.dragCircleLayer) {
        this.dragCircleLayer = new hmap.layer.VectorLayer('拖拽圆图层', {});
        this.map.addLayer(this.dragCircleLayer, null, 'newCanvas');
        this._addDefaultStyle(this.dragCircleLayer, param);
      }
      // 添加标绘控件
      const controls = this.map.getControls();
      this.plotDragCircle = new hmap.control.Plot({
        layer: this.dragCircleLayer, // 指定矢量图层
        disablePointEdit: false // 是否禁用节点编辑，若不传则默认为true，若为true，则可以对要素的结点进行编辑
      });
      this.map.addControl(this.plotDragCircle);
      this.plotDragCircle.on(
        this.plotDragCircle.plotEventType.PLOTFINISHED,
        evt => {
          this.removeMouseTip();
          this.plotDragCircle.setPlotType(undefined); // 将plot的type属性设为undefined
          this.plotDragCircle.deactivate();
          debugger;
          if (param.type === 'dragCircle') {
            this.addDefaultCircle(
              evt.points[0]._coordinate._x,
              evt.points[0]._coordinate._y,
              param
            );
          } else if (param.type === 'point') {
            if (this.tileLayerConfig.type === 'gaode') {
              evt.points[0].transform(3857, 4326);
              let x = evt.points[0]._coordinate._x;
              let y = evt.points[0]._coordinate._y;
              const arr = hmap.proj.Transformer.GCJ02ToWGS84([x, y]);
              evt.points[0]._coordinate._x = arr[0];
              evt.points[0]._coordinate._y = arr[1];
            }
            param.drawCallBack(evt);
          } else if (evt.type === 'RectangleExt') {
            let wktFeature = evt.feature;
            let geom = wktFeature.getGeometry();
            geom = geom.toPolygon();
            const transGeo = this.outputGeom(geom);
            const wkt = new hmap.format.WKT();
            const result = wkt.writeGeometry(transGeo, 2);
            // 传入参数
            const params = {
              wkt: result,
              id: wktFeature.id,
              feature: wktFeature
            };
            param.drawCallBack(params);
          }
        }
      );
    }
    switch (param.type) {
      case 'point':
        this.plotDragCircle.setPlotType(hmap.control.PlotTypes.POINT.POINT);
        break;
      case 'dragCircle':
        this.plotDragCircle.setPlotType(hmap.control.PlotTypes.POINT.POINT);
        break;
      case 'polygon':
        this.plotDragCircle.setPlotType(hmap.control.PlotTypes.POLYGON.POLYGON);
        break;
      case 'rectangle':
        this.plotDragCircle.setPlotType(
          hmap.control.PlotTypes.POLYGON.RECTANGLE
        );
        break;
      case 'polyline':
        this.plotDragCircle.setPlotType(
          hmap.control.PlotTypes.POLYLINE.POLYLINE
        );
        break;
      default:
        this.plotDragCircle.setPlotType(hmap.control.PlotTypes.POLYGON.CIRCLE);
    }
    let tipInfo = 'esc退出绘制';
    // let tipInfo = '鼠标按下开始，单击结束';
    // if (param.type == 'polygon' || param.type == 'polyline') {
    //   tipInfo = '鼠标按下开始，双击结束';
    // } else if (param.type == 'point') {
    //   tipInfo = '鼠标按下开始，释放结束';
    // }
    // this.addMouseTip(tipInfo);
  }
  /**
   * @description:绘制初始拖拽圆
   * @param   x:经度 y:纬度 param.pic:拖拽按钮图片 必填; param.drawCallBack：回调函数 wkt,featureId,feature;param.distance:默认半径
   * @return {*}
   * @author: caokeke
   */
  addDefaultCircle(x, y, param) {
    this.clearDragCircle();
    param = Object.assign(
      {
        type: null, // 图形类型 point,polyline,rectangle, polygon, circle
        drawCallBack: null, // 绘制完成的事件
        cancelBack: () => {}, // 取消回调事件
        distance: 500, // 点选的时候需要传入半径，默认500米
        distanceColor: '#000',
        fillColor: new hmap.style.Color(0, 136, 255, 0.2),
        strokeColor: new hmap.style.Color(0, 136, 255, 1),
        strokeWidth: 2,
        isTransform: true, // 是否转换坐标系
        pic: null
      },
      param
    );
    let coord, coordCenter;
    // if (this.tileLayerConfig.type === 'gaode') {
    //   coord = hmap.proj.Transformer.transform(
    //     new hmap.basetype.Coordinate(Number(x), Number(y), 0),
    //     3857,
    //     4326
    //   );
    //   coordCenter = hmap.proj.Transformer.transform(
    //     new hmap.basetype.Coordinate(Number(x), Number(y), 0),
    //     3857,
    //     4326
    //   );
    // } else {
    coord = new hmap.basetype.Coordinate(Number(x), Number(y), 0);
    coordCenter = new hmap.basetype.Coordinate(Number(x), Number(y), 0);
    // }

    const center = new hmap.geom.Point(coordCenter);
    //中心点
    const point = new hmap.geom.Point(coord);
    //中心点转换坐标系并构建500米缓冲区
    // let circleGeo;
    // if (this.tileLayerConfig.type === 'gaode') {
    const circleGeo = point
      .transform(this.map.getCrs(), 3857)
      .getBuffer(param.distance);
    // } else {
    //   circleGeo = point.getBuffer(param.distance);
    // }

    //缓冲区面转为4326坐标系
    const circleGeoTransform = circleGeo.transform(3857, this.map.getCrs());
    const polygonVector = new hmap.feature.Vector(circleGeoTransform, null);
    let wktFeature = polygonVector;
    if (!this.dragCircleLayer) {
      this.dragCircleLayer = new hmap.layer.VectorLayer('拖拽圆图层', {});
      this.map.addLayer(this.dragCircleLayer, null, 'newCanvas');
      this._addDefaultStyle(this.dragCircleLayer, param);
    }
    this.dragCircleLayer.addFeatures([polygonVector]);
    //拖拽按钮坐标系转为米
    const pointBtn = point.transform(this.map.getCrs(), 3857);
    //在x轴方向加500
    pointBtn._coordinate._x = pointBtn._coordinate._x + param.distance;
    //坐标系从米转为经纬度
    const pointBtn1 = pointBtn.transform(3857, this.map.getCrs());
    //此时第三个数据center为原始数据，point为添加了500后的数据
    this.addDragBtn(pointBtn1, param.pic, center, param);
    //这么写会出bug
    // this.addDragBtn(pointBtn1, param.pic, point, param.drawCallBack);
    let geom = wktFeature.getGeometry();
    const transGeo = this.outputGeom(geom);
    const wkt = new hmap.format.WKT();
    const result = wkt.writeGeometry(transGeo, 2);
    // 传入参数
    const params = {
      radius: param.distance,
      wkt: result,
      id: wktFeature.id,
      feature: wktFeature
    };
    param.drawCallBack(params);
  }
  addDragBtn(point, pic, center, param) {
    // let distance = 500;
    let divStr =
        '<img style="transform: translate(-50%, -50%);cursor:pointer" src=' +
        pic +
        ' /><div style="position:absolute;width:100px;top:-28px;left:-12px;color:' +
        param.distanceColor +
        '">' +
        param.distance +
        '米</div>',
      ele = document.createElement('div');
    ele.contentEditable = false;
    ele.innerHTML = divStr;
    if (!this.overlayDragBtnLayer) {
      this.overlayDragBtnLayer = new hmap.layer.OverlayLayer('overlayDragBtn');
      this.map.addLayer(this.overlayDragBtnLayer);
    }
    let simplePopup = new hmap.overlay.SimplePopup({
      location: new hmap.basetype.Coordinate(
        point._coordinate._x,
        point._coordinate._y,
        0
      ),
      element: ele,
      editable: true,
      scaleFactor: 1
    });

    this.overlayDragBtnLayer.addOverlay(simplePopup);
    ele.addEventListener('mousedown', e => {
      document.onmousemove = e => {
        //圆
        this.map.setPanEnable(false);
        this.dragCircleLayer.removeAllFeatures();
        this.overlayDragBtnLayer.removeAllOverlays();
        let pnt1 = center;
        let pnt2 = new hmap.geom.Point(
          new hmap.basetype.Coordinate(e.lonlat._x, e.lonlat._y, 0)
        );

        let circleGeom = new hmap.geomext.Circle(pnt1, pnt2);
        const polygonVector = new hmap.feature.Vector(circleGeom);
        this.dragCircleLayer.addFeatures([polygonVector]);
        //按钮
        let pnt1T = pnt1.transform(this.map.getCrs(), 3857);
        let pnt2T = pnt2.transform(this.map.getCrs(), 3857);
        // const pnt1T = pnt1;
        // const pnt2T = pnt2;
        let result = pnt1T.distanceTo(pnt2T);
        pnt1.transform(3857, this.map.getCrs());
        pnt2.transform(3857, this.map.getCrs());
        divStr =
          '<img style="transform: translate(-50%, -50%);cursor:pointer" src=' +
          pic +
          ' /><div style="position:absolute;width:100px;top:-28px;left:-12px;color:' +
          param.distanceColor +
          '">' +
          parseInt(result) +
          '米</div>';
        // ele = document.createElement('div');
        ele.innerHTML = divStr;
        let simplePopup = new hmap.overlay.SimplePopup({
          location: new hmap.basetype.Coordinate(e.lonlat._x, e.lonlat._y, 0),
          element: ele,
          editable: true,
          scaleFactor: 1
        });
        this.overlayDragBtnLayer.addOverlay(simplePopup);
      };
      document.onmouseup = e => {
        document.onmousemove = document.onmouseup = null;
        this.map.setPanEnable(true);
        let pnt1 = center;
        let pnt2 = new hmap.geom.Point(
          new hmap.basetype.Coordinate(e.lonlat._x, e.lonlat._y, 0)
        );
        const radius = pnt1.distanceTo(pnt2);
        let circleGeom = new hmap.geom.Circle(pnt1, radius);
        const transGeo = this.outputGeom(circleGeom);
        const polygonVector = new hmap.feature.Vector(circleGeom);
        let geom = polygonVector.getGeometry();
        const wkt = new hmap.format.WKT();
        const result = wkt.writeGeometry(transGeo, 2);
        // 传入参数
        const params = {
          wkt: result,
          id: polygonVector.id,
          feature: polygonVector,
          radius: parseInt(radius)
        };
        param.drawCallBack(params);
      };
      e.preventDefault();
    });
  }
  // 添加鼠标提示
  addMouseTip(tipInfo) {
    const arr = this.map.getControls();
    debugger;
    if (!this.mouseTip) {
      this.mouseTip = new hmap.control.MouseTipControl({
        offsetX: 10,
        offsetY: 10
      });
      this.map.addControl(this.mouseTip);
    }
    this.mouseTip.activate();
    this.mouseTip.setTipContent(tipInfo);
    const arr1 = this.map.getControls();
    debugger;
  }
  clearMeasureControl() {
    if (this.measureControl) {
      this.measureControl.deactivate();
      this.map.removeControl(this.measureControl._plotControl);
      this.map.removeControl(this.measureControl._tipControl);
      this.map.removeControl(this.measureControl);
      const arr = this.map.getControls();
      console.log(arr);
      this.measureControl = null;
    }
  }
  startMeasure() {
    if (this.plotDragCircle) {
      this.map.removeControl(this.plotDragCircle);
      this.plotDragCircle = null;
    }
    const arr = this.map.getControls();
    if (!this.measureControl) {
      this.measureControl = new hmap.control.Measure();
      this.map.addControl(this.measureControl);
    }

    this.measureControl.startMeasureDistance();
  }
  // 清除鼠标提示
  removeMouseTip() {
    if (this.mouseTip) {
      this.mouseTip.deactivate();
      this.map.removeControl(this.mouseTip);
      this.measureControl = null;
      debugger;
    }
  }
  // 获取当前地图层级
  getMapZoom() {
    return this.map.getZoom();
  }
  // 设置中心点
  setMapCenter(item) {
    const coord = this.createCoord(
      Number(item.longitude),
      Number(item.latitude),
      0
    );
    this.map.setCenter(coord);
  }
  drawSpatialVector(param) {
    param = Object.assign(
      {
        type: null, // 图形类型 point,polyline,rectangle, polygon, circle
        drawCallBack: null, // 绘制完成的事件
        cancelBack: () => {}, // 取消回调事件
        distance: 500, // 点选的时候需要传入半径，默认500米
        fillColor: new hmap.style.Color(0, 136, 255, 0.2),
        strokeColor: new hmap.style.Color(0, 136, 255, 1),
        strokeWidth: 2,
        isTransform: true, // 是否转换坐标系
        delFeatureBtn: true // 是否需要删除的多边形图标
      },
      param
    );
    if (!param.type || !param.drawCallBack) {
      return;
    }
    // let clearBis = param.type === 'polyline' ? false : null
    // this.spatialToolClear(clearBis)
    if (!this.plot) {
      this.spatialVectorLayer = new hmap.layer.VectorLayer('绘制图层', {});
      this.map.addLayer(this.spatialVectorLayer, null, 'newCanvas');
      // spatialVectorLayer.id = "spatialVectorLayer";
      // 添加标绘控件
      const plotStyle = new hmap.style.Style({
        // 保存绘制要素的图层
        fillSymbols: [new hmap.style.ColorFill(param.fillColor)],
        markerSymbols: [
          new hmap.style.Circle({
            radius: 7,
            fillColor: new hmap.style.Color(255, 255, 255, 0.1),
            outlineColor: param.strokeColor,
            outlineWidth: 3
          })
        ],
        lineSymbols: [
          new hmap.style.LineSymbol({
            color: param.strokeColor,
            width: param.strokeWidth
          })
        ]
      });
      this.spatialVectorLayer.setStyle(plotStyle);
      this.plot = new hmap.control.Plot({
        layer: this.spatialVectorLayer, // 指定矢量图层
        disablePointEdit: false // 是否禁用节点编辑，若不传则默认为true，若为true，则可以对要素的结点进行编辑
      });
      this.map.addControl(this.plot);
      const vm = this;
      this.plot.on(this.plot.plotEventType.PLOTFINISHED, function(evt) {
        vm.removeMouseTip();
        vm.plot.setPlotType(undefined); // 将plot的type属性设为undefined
        vm.plot.deactivate();
        let wktFeature = evt.feature;
        if (evt.type == 'Line') {
          const line = new hmap.geom.Line(evt.points);
          const line1 = line
            .transform(vm.map.getCrs(), 3857)
            .getBuffer(param.distance);
          const line2 = line1.transform(3857, vm.map.getCrs());
          const polygonVector = new hmap.feature.Vector(line2, null, plotStyle);
          wktFeature = polygonVector;
          vm.spatialVectorLayer.addFeatures([polygonVector]);
          vm.addDelFeatureBtn(polygonVector, param, evt.type);
        } else if (evt.type == 'Point') {
          const point = evt.points[0];
          const point1 = point
            .transform(vm.map.getCrs(), 3857)
            .getBuffer(param.distance);
          const point2 = point1.transform(3857, vm.map.getCrs());
          const polygonVector = new hmap.feature.Vector(
            point2,
            null,
            plotStyle
          );
          wktFeature = polygonVector;
          vm.spatialVectorLayer.addFeatures([polygonVector]);
          param.originFeature = evt.feature;
          vm.addDelFeatureBtn(polygonVector, param, evt.type);
        } else {
          param.delFeatureBtn &&
            vm.addDelFeatureBtn(evt.feature, param, evt.type);
        }
        // let features = spatialVectorLayer.getAllFeatures()
        // let wkts = []
        // for (let i = 0; i < features.length; i++) {
        //   let geom = features[i].getGeometry()
        //   if (evt.type == 'CircleExt' || evt.type == 'Rectangle') {
        //     geom = geom.toPolygon()
        //   }
        //   let wkt = new hmap.format.WKT()
        //   let result = wkt.writeGeometry(geom, 2)
        //   wkts.push(result)
        // }
        let geom = wktFeature.getGeometry();
        if (evt.type == 'CircleExt' || evt.type == 'Rectangle') {
          geom = geom.toPolygon();
        }
        const transGeo = vm.outputGeom(geom);
        const wkt = new hmap.format.WKT();
        const result = wkt.writeGeometry(transGeo, 2);
        // 传入参数
        const params = {
          wkt: result,
          id: wktFeature.id,
          feature: wktFeature
        };
        param.drawCallBack(params);
      });
      this.plot.on(this.plot.plotEventType.EDITMOVEEND, function(evt) {
        // 编辑完成，回调编辑结果
        // outputPlotResult(evt)
      });
    }
    switch (param.type) {
      case 'point':
        this.plot.setPlotType(hmap.control.PlotTypes.POINT.POINT);
        break;
      case 'polygon':
        this.plot.setPlotType(hmap.control.PlotTypes.POLYGON.POLYGON);
        break;
      case 'rectangle':
        this.plot.setPlotType(hmap.control.PlotTypes.POLYGON.RECTANGLE);
        break;
      case 'polyline':
        this.plot.setPlotType(hmap.control.PlotTypes.POLYLINE.POLYLINE);
        break;
      default:
        this.plot.setPlotType(hmap.control.PlotTypes.POLYGON.CIRCLE);
    }
    let tipInfo = '鼠标按下开始，单击结束';
    if (param.type == 'polygon' || param.type == 'polyline') {
      tipInfo = '鼠标按下开始，双击结束';
    } else if (param.type == 'point') {
      tipInfo = '鼠标按下开始，释放结束';
    }
    this.addMouseTip(tipInfo);
  }

  // 停止绘制
  stopDrawSpatialVector() {
    if (this.plot) {
      this.plot.setPlotType(undefined); //将plot的type属性设为undefined
      this.plot.deactivate(); //销毁plot
      this.removeMouseTip(); // 清除鼠标提示
    }
  }
  // 设置地图缩放范围
  setMapExtent(wktString) {
    const wkt = new hmap.format.WKT();
    const extent = wkt
      .readGeometry(wktString)
      // .getBuffer(0.01)
      .getExtent();
    this.map.zoomToExt(extent);
    // map.zoomTo(18)
  }
  //非公共待改造
  //添加重点区域
  addRegionPolygonLayer(name, polygonList, callback) {
    const fillColor = new hmap.style.GradientFill(
        new hmap.style.Color(255, 0, 0, 0.05),
        new hmap.style.Color(255, 0, 0, 0.05),
        0
      ),
      strokeColor = new hmap.style.Color(250, 101, 103, 1),
      strokeWidth = 1;
    const strokeColor1 = new hmap.style.Color(108, 91, 3, 1);
    let vectorLayer = this.map.getLayersByName(name)[0];
    if (!vectorLayer) {
      vectorLayer = new hmap.layer.VectorLayer(name, {
        enableHashCode: false
      });
      this.map.addLayer(vectorLayer);
    }
    const plotStyle = new hmap.style.Style({
      //   fillSymbols: [new hmap.style.ColorFill(fillColor)],
      fillSymbols: [fillColor],
      markerSymbols: [
        new hmap.style.Circle({
          radius: 7,
          fillColor: new hmap.style.Color(255, 255, 255, 0.1),
          outlineColor: strokeColor,
          outlineWidth: 3
        })
      ],
      lineSymbols: [
        new hmap.style.LineSymbol({
          color: strokeColor,
          width: 2
        })
      ]
    });
    vectorLayer.setStyle(plotStyle);
    const that = this;
    polygonList.forEach((item, index) => {
      if (item.wkt) {
        const wkt = new hmap.format.WKT();
        // let polygonWKT = item
        const polygon = wkt.readGeometry(item.wkt);
        const polygonCenter = new hmap.geom.Point(polygon.getCentroid());
        item.longitude = polygonCenter._coordinate._x;
        item.latitude = polygonCenter._coordinate._y;
        // if (index === 0) {
        //   that.setMapCenter(item);
        // }
        const nameFeature = new hmap.feature.Vector(polygonCenter, item);
        if (callback) {
          callback(nameFeature);
        }
        const polygonVector = new hmap.feature.Vector(
          polygon.transform(4326, this.map.getCrs()),
          item,
          plotStyle
        );
        vectorLayer.addFeatures([polygonVector]);
      }

      if (item.deviceResultDTOList) {
        that.addPointsToLayer(item.placeName, item.deviceResultDTOList);
      }
      if (item.placeResultDTOList) {
        that.addPointsToLayer(item.placeName, item.placeResultDTOList);
      }
    });
    // if (polygonList.length > 0) {
    //   this.setMapExtent(polygonList[polygonList.length - 1].wkt)
    // }
  }
  addCustomLocation(layerName, callback) {
    // let vectorLayer = this.map.getLayersByName(layerName)[0];
    // if (!vectorLayer) {
    let vectorLayer = new hmap.layer.VectorLayer('handleLayerName', {
      enableHashCode: false
    });
    this.map.addLayer(vectorLayer);
    // }
    //设置该图层中点线面的样式，若不设置，则有默认样式
    let plotStyle = new hmap.style.Style({
      //保存绘制要素的图层
      fillSymbols: [
        new hmap.style.ColorFill(new hmap.style.Color(0, 136, 255, 0))
      ],
      markerSymbols: [
        new hmap.style.Circle({
          radius: 7,
          fillColor: new hmap.style.Color(255, 255, 255, 0),
          outlineColor: new hmap.style.Color(0, 136, 255, 0),
          outlineWidth: 0
        })
      ],
      lineSymbols: [
        new hmap.style.LineSymbol({
          color: new hmap.style.Color(0, 136, 255, 0),
          width: 0
        })
      ]
    });
    vectorLayer.setStyle(plotStyle);
    if (!this.plot) {
      this.plot = new hmap.control.Plot({
        layer: vectorLayer, // 指定矢量图层
        disablePointEdit: false // 是否禁用节点编辑，若不传则默认为true，若为true，则可以对要素的结点进行编辑
      });
      this.map.addControl(this.plot);
    }
    this.plot.setPlotType(hmap.control.PlotTypes.POINT.POINT);
    const vm = this;
    this.plot.on(this.plot.plotEventType.PLOTFINISHED, function(evt) {
      vm.plot.setPlotType(undefined); //将plot的type属性设为undefined
      vm.plot.deactivate(); //销毁plot
      // let feature = evt.feature;
      if (vm.tileLayerConfig.type === 'gaode') {
        evt.points[0].transform(3857, 4326);
      }
      callback(evt);
    });
  }
  //添加辖区
  addAreaLayer(name, polygonList, callback) {
    const fillColor = new hmap.style.GradientFill(
        new hmap.style.Color(165, 203, 255, 0.2),
        new hmap.style.Color(165, 203, 255, 0.2),
        0
      ),
      strokeColor = new hmap.style.Color(0, 121, 255, 1),
      strokeWidth = 1;
    const strokeColor1 = new hmap.style.Color(108, 91, 3, 1);
    let vectorLayer = this.map.getLayersByName(name)[0];
    if (!vectorLayer) {
      vectorLayer = new hmap.layer.VectorLayer(name, {
        enableHashCode: false
      });
      this.map.addLayer(vectorLayer);
    }
    const plotStyle = new hmap.style.Style({
      //   fillSymbols: [new hmap.style.ColorFill(fillColor)],
      fillSymbols: [fillColor],
      markerSymbols: [
        new hmap.style.Circle({
          radius: 7,
          fillColor: new hmap.style.Color(255, 255, 255, 0.1),
          outlineColor: strokeColor,
          outlineWidth: 3
        })
      ],
      lineSymbols: [
        new hmap.style.LineSymbol({
          color: strokeColor,
          width: 2
        })
      ]
    });
    vectorLayer.setStyle(plotStyle);
    const that = this;
    polygonList.forEach((item, index) => {
      if (item.wkt) {
        const wkt = new hmap.format.WKT();
        // let polygonWKT = item
        const polygon = wkt.readGeometry(item.wkt);
        const polygonCenter = new hmap.geom.Point(polygon.getCentroid());
        item.longitude = polygonCenter._coordinate._x;
        item.latitude = polygonCenter._coordinate._y;
        if (index === 0) {
          that.setMapCenter(item);
        }
        const nameFeature = new hmap.feature.Vector(polygonCenter, item);
        if (callback) {
          callback(nameFeature);
        }
        const polygonVector = new hmap.feature.Vector(polygon, item, plotStyle);
        vectorLayer.addFeatures([polygonVector]);
      }

      if (item.deviceResultDTOList) {
        that.addPointsToLayer(item.placeName, item.deviceResultDTOList);
      }
      if (item.placeResultDTOList) {
        that.addPointsToLayer(item.placeName, item.placeResultDTOList);
      }
    });
    if (polygonList.length > 0) {
      this.setMapExtent(polygonList[polygonList.length - 1].wkt);
    }
  }
  clearDrawVector() {
    if (this.spatialVectorLayer) {
      this.spatialVectorLayer.removeAllFeatures();
      this.clearAllOverlay('close-layer');
    } else {
      console.log('需清理图层不存在，请先绘制');
    }
  }
}
