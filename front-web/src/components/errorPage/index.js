import ErrorPage from './src';

const install = function(Vue) {
  Vue.component(ErrorPage.name, ErrorPage);
};

export default { install };
