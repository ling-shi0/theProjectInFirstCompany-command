<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-06-02 20:04:53
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-04 14:27:31
-->
<template>
  <div class="carousel">
		<el-carousel indicator-position="outside" :autoplay="false">
			<el-carousel-item v-for="len in carouselLength" :key="len">
				<div class="carousel-item-inside">
					<carouselItem 
            v-for="(carouselItem,index) in getSliceArray(len)" 
            :key="index" 
            :name="carouselItem.name"
            :status="carouselItem.status"
          ></carouselItem>
				</div>
			</el-carousel-item>
  	</el-carousel>
	</div>
</template>

<script>
import AudioItem from './audioItem'
export default {
	name: 'Carousel',
	props: {
		carouselItem: Object,
		carouselData: Array
	},
	components: {
		carouselItem: this && this.carouselItem || AudioItem
	},
	data() {
		return {
			carouselLength: 0
		}
	},
	watch: {
		carouselData(val) {
			let len = val && val.length || 0
			this.carouselLength = Math.ceil(len / 6);
		}
	},
	mounted() {
			let len = this.carouselData && this.carouselData.length || 0
			this.carouselLength = Math.ceil(len / 6);
	},
	methods: {
		getSliceArray(len) {
			return this.carouselData.slice((len - 1) * 6,len * 6)
		}
	}
}
</script>

<style lang="scss" scoped>
.carousel {
	width: 100%;
	height: 100%;
	&-item-inside {
		width: 100%;
		height: 100%;
		display: flex;
		flex-wrap: wrap;
		padding: 8px 0 8px 8px;
	}
}
</style>
<style>
.el-carousel__indicator > button {
	width: 6px;
	height: 6px;
	border-radius: 6px;
}
</style>
