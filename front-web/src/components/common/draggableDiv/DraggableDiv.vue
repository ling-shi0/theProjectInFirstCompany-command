<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-06-03 19:15:23
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-03 20:03:00
-->
<template>
  <div 
		class="draggable-div" 
		:id="domId" 
		:draggable="true" 
		@dragstart="dragStartNote" 
		@dragover="drag" 
		:style="dragStyleStr"
	>
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'DraggableDiv',
	data() {
		return {
			dragStyleStr: '',
			dragMes: {},
			domId: ''
		}
	},
	mounted() {
		this.domId = new Date().getTime()
	},
	methods: {
		dragStartNote(e) {
			const oBox = document.getElementById(this.domId)
			this.dragMes.disX = e.clientX - oBox.offsetLeft;
			this.dragMes.disY = e.clientY - oBox.offsetTop;
		},
		drag(e) {
			let left = e.clientX - this.dragMes.disX + 'px';
			let top = e.clientY - this.dragMes.disY + 'px';
			this.dragStyleStr = `left: ${left};top: ${top}`
		}
	}
}
</script>

<style lang="scss" scoped>
.draggable-div{
	position: fixed;
	z-index: 9999;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
</style>
