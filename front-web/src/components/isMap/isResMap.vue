<template>
    <is-base-map :tileLayerConfig="tileLayerConfig" @mapLoaded="mapLoaded"></is-base-map>
</template>

<script>
import IsBaseMap from './IsBaseMap.vue'
export default {
    data() {
        return {

        }
    },
    props:{
        tileLayerConfig:{
            type:Object,
            required:true
        },
        pointType:{
            type:Array,
            required:false
        },
        pointList:{
            type:Array,
            required:false
        }
    },
    components: {
        IsBaseMap

    },
    methods:{
        mapLoaded(){
            
        }
    }
}
</script>

<style lang="less">
</style>
