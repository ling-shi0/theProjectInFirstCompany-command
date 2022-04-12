<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-06-02 11:14:30
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2022-03-31 11:02:28
-->
<template>
    <div class="test">
        <is-base-map :tileLayerConfig="tileLayerConfig"></is-base-map>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tileLayerConfig :{
                styleUrl: "http://10.19.134.107:1709/hmap-server/hvtStyles/multalarm-blue/MapStyle.json",
                gridSize: null,
                hvtUrl: "http://10.19.134.107:1709/hmap-server/hvt/",
                initLevel: "17",
                clusterLevel: "18",
                initLonLat: "120.21607_30.211598"
            }
        }
    },
    components: {

    }
}
</script>

<style lang="less">
.test{
    height: 100%;
}
</style>
