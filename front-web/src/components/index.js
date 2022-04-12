const r = require.context('./', true, /.index.js$/);
const components = [];
r.keys().map(item => {
  if (item === './index.js') {
    return;
  }
  components.push(r(item).default);
});
export default components;
