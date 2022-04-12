/*
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-06-02 11:14:30
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2022-03-31 11:02:09
 */
import Vue from "vue";
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
        initLonLat: "120.216039_30.212898",
        initLevel: "17",
        hmapHvtUrl: "http://10.33.43.58:1709/hmap-server/hvt/",
        clusterLayer: "18",
        hmapStyleUrl: {
          white:
            "http://10.33.43.58:1709/hmap-server/hvtStyles/multalarm-white/MapStyle.json",
          blue: "http://10.33.43.58:1709/hmap-server/hvtStyles/multalarm-blue/MapStyle.json",
        },
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
    const lonlatAry = this.tileLayerConfig.initLonLat.split("_");
    const mapOptions = {
      zoom: Number(this.tileLayerConfig.initLevel), // 初始级别：初始化地图的默认级别
      center: new hmap.basetype.Coordinate(
        Number(lonlatAry[0]),
        Number(lonlatAry[1]),
        0
      ), // 中心点：初始化地图的默认中心位置
      crs: new hmap.proj.Crs(4326),
    };
    // 创建地图对象
    this.map = new hmap.Map(this.id, mapOptions);
    // this.mapUtil = new MapUtil(this.map)
    const vtOptions = {
      matrixOrigin: new hmap.basetype.Coordinate(-180, 90), // 切片原点
      dataFormat: "hvt", // 切片格式
      labelOn: true, // 是否显示文字标注
      isLGD: true,
      styleUrl: this.tileLayerConfig.styleUrl, //矢量切片样式文件地址
      isRTE: true,
      // useLocalStorage: true,
      // gridSize: new hmap.basetype.Size(Number(this.gridSize), Number(this.gridSize)),
    };
    const vectilelayer = new hmap.layer.VectorTileLayer(
      "矢量切片图层",
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
}