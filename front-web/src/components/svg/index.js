const r = require.context('@/assets/images', true, /.svg$/);

const install = function(Vue) {
  r.keys().map(item => {
    const name = item.match(/(.*\/)*([^.]+).*/)[2];
    const p = item.replace('./', '');
    import(`@/assets/images/${p}?svg`).then(res => {
      Vue.component(`${name}Svg`, res.default);
    });
  });
};

export default {
  install
};
