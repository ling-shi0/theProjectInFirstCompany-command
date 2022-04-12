import Vue from 'vue';
export default class MapUtil {
  /**
   * @param {String} id 地图容器id
   * @param {Object} tileLayerConfig 切片地图配置,包含了initLonLat，initLevel，hmapHvtUrl，clusterLayer，hmapStyleUrl
   * @param {Function} mapLoaded 地图切片加载完成回调
   */
  constructor(id, tileLayerConfig, mapLoaded) {
    this.id = id;
    // this.tileLayerConfig=tileLayerConfig
    this.tileLayerConfig = Object.assign(
      {
        initLonLat: '120.216039_30.212898',
        initLevel: '17',
        hmapHvtUrl: 'http://10.33.43.58:1709/hmap-server/hvt/',
        clusterLayer: '18',
        hmapStyleUrl: {
          white:
            'http://10.33.43.58:1709/hmap-server/hvtStyles/multalarm-white/MapStyle.json',
          blue:
            'http://10.33.43.58:1709/hmap-server/hvtStyles/multalarm-blue/MapStyle.json'
        }
      },
      tileLayerConfig
    );
    this.mapLoaded = mapLoaded;
    this.map = null;
    this.plot = null;
    this.layers = {};
    this.spatialVectorLayer = null;
    this.mouseTip = null;
  }
  /**
   * @description:地图初始化
   * @param {*}
   * @return {*}
   * @author: caokeke
   */
  initMap() {
    const lonlatAry = this.tileLayerConfig.initLonLat.split('_');
    const mapOptions = {
      zoom: Number(this.tileLayerConfig.initLevel), // 初始级别：初始化地图的默认级别
      center: new hmap.basetype.Coordinate(
        Number(lonlatAry[0]),
        Number(lonlatAry[1]),
        0
      ), // 中心点：初始化地图的默认中心位置
      crs: new hmap.proj.Crs(4326)
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
      this.tileLayerConfig.hvtUrl,
      vtOptions
    );
    // 获取chars.json和chars.png使用
    vectilelayer.updateChars(this.tileLayerConfig.hvtUrl, false);
    // 将图层添加至地图对象
    this.map.addLayer(vectilelayer);
    let that = this;
    vectilelayer.event.addListener(
      EventType.LAYEREVENT_LOADEND,
      function (event) {
        that.mapLoaded();
      },
      false,
      true
    );
  }

  /**
   * @description:获取map
   * @param {*}
   * @return {hmap.map}
   * @author: caokeke
   */
  getMap() {
    return this.map;
  }

  /**
   * @description: 不对外，暂用加载绘制完成后的关闭按钮
   * @param {*}
   * @return {*}
   * @author: caokeke
   */
  addMarker(param) {
    param = Object.assign(
      {
        id: (Math.random() + '').split('.')[1], // 唯一值
        type: 'default_marker_layer', // 如果不需要设置显示隐藏，使用默认值即可
        offsetX: 0, // 默认值为（0,0）,单位是像素，代表偏移量，默认定位在html的（0,0）的位置
        offsetY: 0,
        html: null, // 必传，marker显示的div
        x: undefined, // 必传，代表经纬度
        y: undefined,
        clickEvent: null, // marker的点击事件，如果不需要注册点击就可以不传入
        clickEventParam: null, // clickEventParam marker的点击事件返回的参数，如果不需要可以不传入
        isCenter: false, // 默认false, 居中定位
        isTransform: true // 是否转换坐标系
      },
      param
    );
    if (!param.x || !param.y || !param.html) {
      console.error("can't addMarker, param x,y,html cannot be empty");
      return null;
    }
    const type = param.type;
    if (!this.layers.hasOwnProperty(type)) {
      this.layers[type] = new hmap.layer.OverlayLayer(type);
      // layers[type].id = type
      this.layers[type].visibility = true;
      this.map.addLayer(this.layers[type]);
    }
    const layer = this.layers[type];
    const id = param.id;
    const offset = new hmap.basetype.Offset(param.offsetX, param.offsetY, 0);
    const lonlat = new hmap.basetype.Coordinate(
      Number(param.x),
      Number(param.y),
      0
    );
    let point = new hmap.geom.Point(lonlat);
    if (param.isTransform) {
      point = point.transform(this.map.getCrs(), 3857);
    }
    if (layer.getOverlaysByDomId(id).length != 0) {
      const marker = layer.getOverlaysByDomId[id];
      layer.removeOverlay(marker);
    }
    const ele = document.createElement('div');
    if (param.clickEvent) {
      // marker.clickEventParam = param.clickEventParam
      ele.addEventListener('click', function (e) {
        param.clickEvent(param.clickEventParam, e);
      });
    }
    ele.innerHTML = param.html;
    const marker = new hmap.overlay.SimplePopup({
      location: lonlat,
      domId: id,
      element: ele,
      offset: offset,
      isTransform: false
    });
    layer.addOverlay(marker);
    if (param.isCenter) {
      // map.setCenter(lonlat)
    }
    return id;
  }

  /**
   *
   * @description：添加Marker,带弹框
   * @param {*} param
   * @author: dingchunmei
   */
  addMarkerToMap(param) {
    param = Object.assign(
      {
        id: (Math.random() + '').split('.')[1], // 唯一值
        type: 'default_marker_layer', // 如果不需要设置显示隐藏，使用默认值即可
        offsetX: 0, // 默认值为（0,0）,单位是像素，代表偏移量，默认定位在html的（0,0）的位置
        offsetY: 0,
        html: null, // 必传，marker显示的div
        x: undefined, // 必传，代表经纬度
        y: undefined,
        clickEvent: null, // marker的点击事件，如果不需要注册点击就可以不传入
        clickEventParam: null, // clickEventParam marker的点击事件返回的参数，如果不需要可以不传入
        isCenter: false, // 默认false, 居中定位
        isTransform: true // 是否转换坐标系
      },
      param
    );
    if (!param.x || !param.y || !param.html) {
      console.error("can't addMarker, param x,y,html cannot be empty");
      return null;
    }
    const type = param.type;
    if (!this.layers.hasOwnProperty(type)) {
      this.layers[type] = new hmap.layer.OverlayLayer(type);
      // layers[type].id = type
      this.layers[type].visibility = true;
      this.map.addLayer(this.layers[type]);
    }
    const layer = this.layers[type];
    const id = param.id;
    const offset = new hmap.basetype.Offset(param.offsetX, param.offsetY, 0);
    const lonlat = new hmap.basetype.Coordinate(
      Number(param.x),
      Number(param.y),
      0
    );
    let point = new hmap.geom.Point(lonlat);
    if (param.isTransform) {
      point = point.transform(this.map.getCrs(), 3857);
    }
    if (layer.getOverlaysByDomId(id).length != 0) {
      const marker = layer.getOverlaysByDomId[id];
      layer.removeOverlay(marker);
    }
    // const ele = document.createElement('div')
    if (param.clickEvent) {
      // marker.clickEventParam = param.clickEventParam
      ele.addEventListener('click', function (e) {
        param.clickEvent(param.clickEventParam, e);
      });
    }
    // ele.innerHTML = param.html
    const marker = new hmap.overlay.SimplePopup({
      location: lonlat,
      domId: id,
      element: param.html,
      offset: offset,
      isTransform: false
    });
    layer.addOverlay(marker);
    if (param.isCenter) {
      // map.setCenter(lonlat)
    }
    return id;
  }

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

  getLayer(type) {
    return this.layers[type];
  }

  /**
   * 删除单个marker
   * @param id  marker的唯一值
   * @param type 资源类型，addMarker的时候传入，删除的时候就需要传入，反之就可以使用默认值
   */
  clearMarker(markerId, markerName = 'default_marker_layer') {
    const layer = this.getLayer(markerName);
    if (layer) {
      if (layer.getOverlaysByDomId(markerId)) {
        const marker = layer.getOverlaysByDomId(markerId);
        layer.removeOverlay(marker[0]);
      } else {
        console.error(
          `layer ${markerName} do not include the marker with id for ${markerId}!`
        );
      }
    }
  }

  // 获取当前地图层级
  getMapZoom() {
    return this.map.getZoom();
  }

  getBbox() {
    return this.map.getExtent().toString();
  }

  addDistanceLine(name, points, distance) {
    const line = new hmap.geom.Line(points);
    const lineSymbol = new hmap.style.LineSymbol({
      width: 1, // 宽度定义为20px
      color: new hmap.style.Color(255, 216, 0, 0.7),
      lineStyle: 'longdashdot' // 线型，包括'dot'、'dash'、'dashdot'、'longdash'、'longdashdot'和 'solid'，默认为'solid'（实线）。
    });
    let vectorLayer = this.map.getLayersByName(name)[0];
    if (!vectorLayer) {
      vectorLayer = new hmap.layer.VectorLayer(name, {
        enableHashCode: false
      });
      this.map.addLayer(vectorLayer);
    }
    const lineStyle = new hmap.style.Style({
      lineSymbols: [lineSymbol]
    });
    const lineFeature = new hmap.feature.Vector(line, null, lineStyle);
    vectorLayer.addFeatures([lineFeature]);

    const textSymbol = new hmap.style.TextSymbol({
      text: '周边' + distance + '米',
      // haloColor: new hmap.style.Color(255, 216, 0, 0.7), //字体描边颜色
      // haloWidth: 1, //字体描边宽
      offset: new hmap.basetype.Offset(50, 0, 0)
    });
    textSymbol.setFontSize(20);
    // textSymbol.setBackgroundColor(new hmap.style.Color(255, 0, 0, 0.7))
    textSymbol.setFontColor(new hmap.style.Color(255, 255, 255, 0.7));
    textSymbol.setFontFace('楷体');
    const textStyle = new hmap.style.Style({
      textSymbols: [textSymbol]
    });
    const textfeature = new hmap.feature.Vector(points[0], {}, textStyle);
    vectorLayer.addFeatures([textfeature]);
    // vectorLayer.addFeatures([line])
  }

  addVectorToLayer(item) {
    let param = {
      type: null, // 图形类型 point,polyline,rectangle, polygon, circle
      drawCallBack: null, // 绘制完成的事件
      cancelBack: () => {}, // 取消回调事件
      distance: 500, // 点选的时候需要传入半径，默认500米
      fillColor: new hmap.style.Color(0, 136, 255, 0.2),
      strokeColor: new hmap.style.Color(0, 136, 255, 1),
      strokeWidth: 2,
      isTransform: true // 是否转换坐标系
    };
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
          width: 3
        })
      ]
    });
    if (!this.spatialVectorLayer) {
      this.spatialVectorLayer = new hmap.layer.VectorLayer('绘制图层', {});
      this.map.addLayer(this.spatialVectorLayer, null, 'newCanvas');

      this.spatialVectorLayer.setStyle(plotStyle);
    }
    const wkt = new hmap.format.WKT();
    // let polygonWKT = item
    const polygon = wkt.readGeometry(item.wkt);
    const polygonCenter = new hmap.geom.Point(polygon.getCentroid());
    item.longitude = polygonCenter._coordinate._x;
    item.latitude = polygonCenter._coordinate._y;
    // if (index === 0) {
    this.setMapCenter(item);
    // }
    // const nameFeature = new hmap.feature.Vector(polygonCenter, item)
    // if (callback) {
    //     callback(nameFeature)
    // }
    const polygonVector = new hmap.feature.Vector(polygon, item, plotStyle);
    this.spatialVectorLayer.addFeatures([polygonVector]);
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
    this.plot.on(this.plot.plotEventType.PLOTFINISHED, function (evt) {
      vm.plot.setPlotType(undefined); //将plot的type属性设为undefined
      vm.plot.deactivate(); //销毁plot
      // let feature = evt.feature;
      callback(evt);
    });
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
      this.plot.on(this.plot.plotEventType.PLOTFINISHED, function (evt) {
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
        const wkt = new hmap.format.WKT();
        const result = wkt.writeGeometry(geom, 2);
        // 传入参数
        const params = {
          wkt: result,
          id: wktFeature.id,
          feature: wktFeature
        };
        param.drawCallBack(params);
      });
      this.plot.on(this.plot.plotEventType.EDITMOVEEND, function (evt) {
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
  clearAll(layerName) {
    if (this.map) {
      const layer = this.map.getLayersByName(layerName)[0];
      if (layer) {
        layer.removeAllFeatures();
      }
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

  clearAllOverlay(layerName) {
    const layer = this.map.getLayersByName(layerName)[0];
    if (layer) {
      layer.removeAllOverlays();
    }
  }

  clearAllCluster(layerName) {
    const layer = this.map.getLayersByName(layerName)[0];
    if (layer) {
      const features = layer.getAllFeatures();
      layer.removeFeatures(features);
    }
    // layer.removeAllOverlays(features)
  }

  // 设置中心点
  setMapCenter(item) {
    const coord = new hmap.basetype.Coordinate(
      Number(item.longitude),
      Number(item.latitude),
      0
    );
    this.map.setCenter(coord);
  }

  // 构建点
  createPoint(item) {
    const coord = new hmap.basetype.Coordinate(
      Number(item.longitude),
      Number(item.latitude),
      0
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

  // 添加鼠标提示
  addMouseTip(tipInfo) {
    if (!this.mouseTip) {
      this.mouseTip = new hmap.control.MouseTipControl({
        offsetX: 10,
        offsetY: 10
      });
      this.map.addControl(this.mouseTip);
    }
    this.mouseTip.activate();
    this.mouseTip.setTipContent(tipInfo);
  }

  // 清除鼠标提示
  removeMouseTip() {
    if (this.mouseTip) {
      this.mouseTip.deactivate();
      this.mouseTip.destroy();
    }
  }

  // 添加删除多边形按钮
  addDelFeatureBtn(transFeature, param, type) {
    const vm = this;
    let feature = transFeature;
    if (type == 'CircleExt' || type == 'Rectangle') {
      feature = new hmap.feature.Vector(
        transFeature.getGeometry().toPolygon(),
        null,
        null
      );
    }
    if (type === 'Polygon') {
      feature = transFeature._bbox;
    }
    let x, y;
    if (feature && feature.getExtent) {
      x = feature.getExtent()._right;
      y = feature.getExtent()._bottom;
    } else {
      x = feature._extent._right;
      y = feature._extent._bottom;
    }
    this.addMarker({
      id: transFeature.id,
      type: 'close-layer',
      html:
        '<div style="font-size:18px;color:' +
        param.strokeColor.toRGBColor() +
        '"><i class="lidaicon-h-close-circle">X</i></div>',
      x: x,
      y: y,
      isTransform: false,
      clickEvent: function () {
        vm.clearMarker(transFeature.id, 'close-layer');
        if (vm.spatialVectorLayer) {
          param.deleteButCallBack(transFeature);
          vm.spatialVectorLayer.removeFeatures([transFeature]);
          if (param.originFeature) {
            vm.spatialVectorLayer.removeFeatures([param.originFeature]);
          }
        }
      }
    });
  }

  // 从指定图层移除点位
  removePointFromLayer(name, polygonList) {
    const layer = this.map.getLayersByName(name)[0];
    const that = this;
    polygonList.forEach(item => {
      const features = layer.getFeaturesByAttribute(
        'placeCode',
        item.placeCode
      );
      const text = layer.getFeaturesByAttribute('id', item.placeCode)[0];
      if (item.deviceResultDTOList) {
        that.removePointsToLayer(item.placeName, item.deviceResultDTOList);
      }
      if (item.placeResultDTOList) {
        that.removePointsToLayer(item.placeName, item.placeResultDTOList);
      }
      layer.removeFeatures(features);
      if (text) {
        layer.removeFeature(text);
      }
    });
  }

  // 从指定图层移除多边形数组
  removePolygonToLayer(name, polygonList) {
    const layer = this.map.getLayersByName(name)[0];
    const that = this;
    polygonList.forEach(item => {
      const features = layer.getFeaturesByAttribute(
        'placeCode',
        item.placeCode
      );
      const text = layer.getFeaturesByAttribute('id', item.placeCode)[0];
      if (item.deviceResultDTOList) {
        that.removePointsToLayer(item.placeName, item.deviceResultDTOList);
      }
      if (item.placeResultDTOList) {
        that.removePointsToLayer(item.placeName, item.placeResultDTOList);
      }
      layer.removeFeatures(features);
      if (text) {
        layer.removeFeature(text);
      }
    });
  }

  // 隐藏预警中心图层
  hideAllLayers() {
    let layers = this.map.getAllLayers(1);
    layers = layers.filter(
      item =>
        item.name != '矢量切片图层' &&
        item.name != 'orbitInfo' &&
        item.name != 'orbitPoint' &&
        item.name != 'orbitLine'
    );
    layers.forEach(element => {
      element.setVisibility(false);
      if (element.name === 'selectedPoint') {
        element.enableHashCode = false;
      }
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
    // if (polygonList.length > 0) {
    //   this.setMapExtent(polygonList[polygonList.length - 1].wkt)
    // }
  }
  // 添加区域图层
  addPolygonLayer(name, polygonList, callback) {
    const fillColor = new hmap.style.GradientFill(
        new hmap.style.Color(255, 216, 0, 0.01),
        new hmap.style.Color(253, 126, 49, 0.15),
        0
      ),
      strokeColor = new hmap.style.Color(255, 216, 0, 0.7),
      strokeWidth = 2;
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
          width: 3
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
    // if (polygonList.length > 0) {
    //   this.setMapExtent(polygonList[polygonList.length - 1].wkt)
    // }
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
    const coord1 = new hmap.basetype.Coordinate(
      Number(param.feature._attributes.longitude),
      Number(param.feature._attributes.latitude),
      0
    );
    const simplePopup = new hmap.overlay.SimplePopup({
      domId: param.name + param.feature._attributes.placeCode,
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
  getWKT() {
    const ext = this.map.getExtent();
    const geom = hmap.geom.Polygon.fromExtent(ext);
    const wkt = new hmap.format.WKT();
    return wkt.writeGeometry(geom, 2);
  }
  addPointBuffer(name, item, distance) {
    const fillColor = new hmap.style.GradientFill(
        new hmap.style.Color(255, 216, 0, 0.01),
        new hmap.style.Color(253, 126, 49, 0.15),
        0
      ),
      strokeColor = new hmap.style.Color(255, 216, 0, 0.7),
      strokeWidth = 2;
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
          width: 3
        })
      ]
    });
    const coord = new hmap.basetype.Coordinate(
      Number(item.longitude),
      Number(item.latitude),
      0
    );
    const point = new hmap.geom.Point(coord);
    const point1 = point.transform(this.map.getCrs(), 3857).getBuffer(distance);
    const point2 = point1.transform(3857, this.map.getCrs());
    const polygonVector = new hmap.feature.Vector(point2, null, plotStyle);
    // let layer = map.getLayersByName(name)[0]
    // if (!layer) {
    //   layer = new hmap.layer.VectorLayer(name, {
    //   })
    //   map.addLayer(layer)
    // }
    // layer.addFeatures([polygonVector])
    const wktFeature = polygonVector;
    const geom = wktFeature.getGeometry();
    const wkt = new hmap.format.WKT();
    const result = wkt.writeGeometry(geom, 2);
    return result;
  }

  setMapLineBuffer(noRepeatPointList) {
    const noRepeatPoint = [];
    // 无重复点位的数组
    for (var j = 0; j < noRepeatPointList.length; j++) {
      const noRepeatcoord = new hmap.basetype.Coordinate(
        Number(noRepeatPointList[j].longitude),
        Number(noRepeatPointList[j].latitude),
        0
      );
      const noRepeatPt = new hmap.geom.Point(noRepeatcoord);
      noRepeatPoint.push(noRepeatPt);
    }
    if (noRepeatPoint.length < 2) {
      this.map.setMapCenter(noRepeatPoint[0]);
    } else {
      const noRepeatLine = new hmap.geom.Line(noRepeatPoint);
      var polygon = noRepeatLine.getBuffer(0.01);
      var extent = polygon.getExtent();
      this.map.zoomToExt(extent);
    }
  }
  createImgPointVector(param, layer) {
    param = Object.assign(
      {
        id: (Math.random() + '').split('.')[1], // 唯一值
        name: 'default_marker_layer' // 如果不需要设置显示隐藏，使用默认值即可
      },
      param
    );
    // const { scaleRatio } = store.getters.showroomConfig
    const markerSymbol = new hmap.style.Icon({
      opacity: 1.0, // 设置marker的透明度，可以为[0,1]区间内的任意值，0表示完全透明，1表示完全不透明
      imgSrc: param.img, // 设置marker的图片路径
      size: new hmap.basetype.Size(106 * 0.6, 96 * 0.6), //设置marker的大小,单位为像素
      anchor: [0, 0], // 设置图标在marker处的偏移量，为大于0的任意值，具体偏移多少可与下方的参考点作比较
      offset: new hmap.basetype.Offset((-106 * 0.6) / 2, -96 * 0.6, 0)
    });
    const coord = new hmap.basetype.Coordinate(
      Number(param.longitude),
      Number(param.latitude),
      0
    );
    const point = new hmap.geom.Point(coord);
    const markerStyle = new hmap.style.Style({
      markerSymbols: [markerSymbol]
    });
    const vector = new hmap.feature.Vector(point, param, markerStyle);
    return vector;
  }

  createTextSymbol(param, layer) {
    param = Object.assign(
      {
        id: (Math.random() + '').split('.')[1], //唯一值
        name: 'default_marker_layer' //如果不需要设置显示隐藏，使用默认值即可
      },
      param
    );
    // const { scaleRatio } = store.getters.showroomConfig
    //    const textSymbol = new hmap.style.TextSymbol({
    //        fontWeight: 'normal', //字的粗细
    //        fontStyle: 'normal', //斜体等
    //        fontSize: 16, //字大小
    //        fontFace: 'Microsoft YaHei', //字体
    //        text: '江南大道',
    //        offset: new hmap.basetype.Offset(1, 1, 0),
    //        placement: 'point', //文本的放置方式
    //        rotateWithView: false, //是否跟着视图旋转
    //        rotation: 0, //旋转角度，单位为度
    //        textAlign: 'center', //文本横向排列方式，分为center、left、right，end，start
    //        textBaseline: 'top', //文本纵向排列方式，分为top、middle、bottom
    //        overflow: false, //是否允许文本超出多边形或线的路径长度
    //        fontColor: new hmap.style.Color(6, 6, 6, 1), //字体填充颜色
    //        haloColor: new hmap.style.Color(255, 1, 1, 1), //字体描边颜色
    //        haloWidth: 1, //字体描边宽
    //        backgroundColor: new hmap.style.Color(157, 200, 247, 1), //背景填充颜色
    //        maxAngle: Math.PI / 4, //允许相邻文字之间的最大角度，单位弧度
    //        opacity: 0.5,
    //        // opacity: 1.0, //设置marker的透明度，可以为[0,1]区间内的任意值，0表示完全透明，1表示完全不透明
    //        // text: param.placeName, //设置marker的图片路径
    //        //    size: new hmap.basetype.Size(106 * 0.6, 96 * 0.6), //设置marker的大小,单位为像素
    //        // anchor: [0, 0], //设置图标在marker处的偏移量，为大于0的任意值，具体偏移多少可与下方的参考点作比较
    //        // offset: new hmap.basetype.Offset((-106 * 0.6) / 2, -96 * 0.6, 0),
    //    })
    let textSymbol = new hmap.style.TextSymbol({
      text: '风景游览区',
      haloColor: new hmap.style.Color(0, 0, 255, 0.8), //字体描边颜色
      haloWidth: 4 //字体描边宽
    });
    textSymbol.setFontSize(26);
    textSymbol.setBackgroundColor(new hmap.style.Color(255, 0, 0, 0.7));
    textSymbol.setFontColor(new hmap.style.Color(255.0, 255.0, 0.0, 1.0));
    textSymbol.setFontFace('楷体');
    // const coord = new hmap.basetype.Coordinate(Number(param.longitude), Number(param.latitude), 0)
    // const point = new hmap.geom.Point(coord)
    let point = new hmap.geom.Point(
      new hmap.basetype.Coordinate(120.216357, 30.252617)
    );
    const markerStyle = new hmap.style.Style({
      textSymbol: [textSymbol]
    });
    const vector = new hmap.feature.Vector(point, param, markerStyle);
    return vector;
  }

  addClusterPointToLayer(name, pointList, img) {
    // 聚合点的文字样式

    // 用来标识聚合点的mark符号
    const markerSymbolA = new hmap.style.Icon({
      opacity: 1.0, // 可选参数，设置marker的透明度，可以为[0,1]区间内的任意值，0表示完全透明，1表示完全不透明
      imgSrc: img, // 必选参数，设置marker的图片路径，IOCN中的必选参数
      size: new hmap.basetype.Size(48, 48), //可选参数，设置marker的大小,单位为像素
      anchor: [0, 0], // 可选参数，设置图标在marker处的偏移量，为大于0的任意值，具体偏移多少可与下方的参考点作比较
      offset: new hmap.basetype.Offset(0, 0, 0) // 可选参数，图标的偏移量
    });
    let layer = this.map.getLayersByName(name)[0];
    if (!layer) {
      layer = new hmap.layer.VectorLayer(name, {
        enableHashCode: false,
        atlasSize: 512
      });
      this.map.addLayer(layer);
    }
    const that = this;
    const vectors = [];
    pointList.forEach(item => {
      const coord = new hmap.basetype.Coordinate(
        Number(item.longitude),
        Number(item.latitude),
        0
      );
      const point = new hmap.geom.Point(coord);
      const textSymbolA = new hmap.style.TextSymbol({
        text: item.pointNum + '',
        fontSize: 16, // 可选参数 聚合数值大小，若不传，默认为16
        fontColor: new hmap.style.Color(255, 255, 255, 1.0), //可选参数，聚合数值的字体颜色
        fontFace: '楷体', // 可选参数，聚合数值的字体
        offset: new hmap.basetype.Offset(24, 24, 0) // 可选参数，聚合文字显示的偏移量，默认不偏移
      });
      const markerStyle = new hmap.style.Style({
        markerSymbols: [markerSymbolA],
        textSymbols: [textSymbolA]
      });
      const vector = new hmap.feature.Vector(point, item, markerStyle);
      vectors.push(vector);
    });
    layer.addFeatures(vectors);
  }

  // 添加点位至图层
  addPointsToLayer(name, pointList, zIndex) {
    // let enable = true
    // if (enableHashCode === '1') {
    //   enable = false
    // }
    let layer = this.map.getLayersByName(name)[0];
    if (!layer) {
      layer = new hmap.layer.VectorLayer(name, {
        enableHashCode: true,
        atlasSize: 512
      });
      if (zIndex) {
        layer.setZIndex(zIndex);
      }
      this.map.addLayer(layer);
    }
    const that = this;
    const vectors = [];
    pointList.forEach(item => {
      const vector = that.createImgPointVector(item, layer);
      vectors.push(vector);
    });
    layer.addFeatures(vectors);
  }

  // 添加点位名称至图层
  addTextToLayer(name, pointList) {
    let layer = this.map.getLayersByName(name)[0];
    if (!layer) {
      layer = new hmap.layer.VectorLayer(name, {
        enableHashCode: true,
        atlasSize: 512
      });
      this.map.addLayer(layer);
    }
    const that = this;
    const vectors = [];
    pointList.forEach(item => {
      const vector = that.createTextSymbol(item, layer);
      vectors.push(vector);
    });
    layer.addFeatures(vectors);
    // let point = new hmap.geom.Point(new hmap.basetype.Coordinate(120.216357, 30.252617))
    // let vectorLayer = new hmap.layer.VectorLayer('矢量要素图层')
    // this.map.addLayer(vectorLayer)
    // vectorLayer.removeAllFeatures()
    // let textSymbol = new hmap.style.TextSymbol({
    //     text: '风景游览区',
    //     haloColor: new hmap.style.Color(0, 0, 255, 0.8), //字体描边颜色
    //     haloWidth: 4, //字体描边宽
    // })
    // textSymbol.setFontSize(26)
    // textSymbol.setBackgroundColor(new hmap.style.Color(255, 0, 0, 0.7))
    // textSymbol.setFontColor(new hmap.style.Color(255.0, 255.0, 0.0, 1.0))
    // textSymbol.setFontFace('楷体')
    // let textStyle = new hmap.style.Style({ textSymbols: [textSymbol] })
    // let textfeature = new hmap.feature.Vector(point, {}, textStyle)
    // vectorLayer.addFeatures([textfeature])
  }

  removePointsToLayer(name, pointList) {
    const layer = this.map.getLayersByName(name)[0];
    pointList.forEach(item => {
      const feature = layer.getFeaturesByAttribute(
        'placeCode',
        item.placeCode
      )[0];
      layer.removeFeature(feature);
    });
  }

  // 获得一个坐标点的规定范围的缓冲区 然后得到这个区域的wkt 用于拖拽定位
  getBufferWkt(x, y, z, distance) {
    let coord = new hmap.basetype.Coordinate(x, y, z || 0);
    let point = new hmap.geom.Point(coord);
    const circle = point.getBuffer(Math.floor(distance / 100000));
    let circleVector = new hmap.feature.Vector(
      circle,
      null,
      new hmap.style.Style({})
    );
    let str = wkt.writeFeature(circleVector);
    return str;
  }

  drawWktPolygon(name, polygons, callback, titleName = '') {
    let vectorLayer = this.map.getLayersByName(name)[0];
    if (!vectorLayer) {
      vectorLayer = new hmap.layer.VectorLayer(name, {
        enableHashCode: false
      });
      this.map.addLayer(vectorLayer);
    }
    const polygonFillColor = new hmap.style.ColorFill(
      new hmap.style.Color(165, 203, 255, 0.2)
    ); //定义面的填充色
    const lineSymbol = new hmap.style.LineSymbol({
      //定义边框颜色和宽度
      color: new hmap.style.Color(0, 121, 255, 1),
      width: 2
    });
    const polygonStyle = new hmap.style.Style({
      fillSymbols: [polygonFillColor],
      lineSymbols: [lineSymbol]
    });
    // 区域标题部分
    let textSymbol = new hmap.style.TextSymbol({
      text: titleName || ''
    });
    textSymbol.setFontSize(18);
    textSymbol.setFontColor(new hmap.style.Color(198, 198, 198, 1));
    textSymbol.setFontFace('Arial');
    let textStyle = new hmap.style.Style({ textSymbols: [textSymbol] });
    // 重组字符串
    if (polygons.length) {
      const wkt = new hmap.format.WKT();
      polygons.forEach(polygon => {
        polygon = wkt.readGeometry(polygon);
        let polygonVector = new hmap.feature.Vector(
          polygon,
          null,
          polygonStyle
        );
        this.map.setCenter(polygon.getCentroid(), 10);
        const textPoint = new hmap.geom.Point(polygon.getCentroid());
        let textfeature = new hmap.feature.Vector(textPoint, {}, textStyle);
        vectorLayer.addFeatures([polygonVector, textfeature]);
      });
      callback && callback();
    }
  }
}
