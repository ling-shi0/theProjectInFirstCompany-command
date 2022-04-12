import jquery from 'jquery/src/jquery.js';
import verto from 'verto/src/jquery.verto';
import FSRTC from 'verto/src/jquery.FSRTC';
import jsonrpcclient from 'verto/src/jquery.jsonrpcclient';
import jqueryJson from 'jquery-json/dist/jquery.json.min';
import store from '@/store';
import { renderTheme, renderLanguage } from '@/utils/common';
import router from '@/router';
import App from '@/App';
import i18n from '@/i18n';
import axios from 'axios';



const isDev = process.env.NODE_ENV === 'development';
const assetsUrl = process.env.BASE_URL + process.env.VUE_APP_ASSETS;
const i18nFileName = process.env.VUE_APP_I18N_FILENAME;

async function initApp(Vue) {
  const setDefault = async () => {
    await setSkin({
      skin: 'blue'
    });
    await setLanguage({
      languageId: 'zh_CN'
    });
  };
  try {
    const { userInfo } = await store.dispatch('setUserInfo');
    // 设置主题,多语言
    if (!isDev) {
      await Promise.all([setSkin(userInfo), setLanguage(userInfo)]);
    } else {
      await setDefault();
    }
  } catch (error) {
    await setDefault();
  } finally {
    new Vue({
      store,
      router,
      i18n,
      jquery,
      verto,
      FSRTC,
      jsonrpcclient,
      jqueryJson,
      render: h => h(App)
    }).$mount('#app');
  }
}

async function setSkin({ skin }) {
  // public/static/skin/xxx/skin.css
  const requestUrl = `${assetsUrl}/skin/${skin}/skin.css`;
  await renderTheme({
    path: requestUrl,
    id: skin
  });
}

async function setLanguage({ languageId }) {
  let i18nJson = {};
  if (isDev) {
    i18nJson = require(`@/i18n/${languageId}`);
  } else {
    // public/static/i18n/xxx/xxx.json
    const requestUrl = `${assetsUrl}/i18n/${languageId}/${i18nFileName}`;
    const res = await axios.get(requestUrl);
    i18nJson = res.data;
  }
  await renderLanguage({
    i18n,
    data: i18nJson,
    id: languageId
  });
}

export default initApp;
