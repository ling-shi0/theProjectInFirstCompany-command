<template>
  <div class="is-point-label">{{ name }}</div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    name: {
      type: String
    }
  },
  components: {}
};
</script>

<style lang="scss">
.is-point-label {
  //   transform: translate(-50%, -155%) !important;
  transform: translate(20px, -16px) !important;
  height: 32px;
  line-height: 32px;
  padding: 0 16px;
  font-size: 16px;
  background: #fff;
  border-radius: 4px;
}
</style>
