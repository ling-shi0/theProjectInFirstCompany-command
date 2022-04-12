import huiLocale from 'hui/lib/locale';
import huiProLocale from '@hui-pro/locale';
import {DEVICE_OPTIONS} from '@/constants';
// 获取语言参数
const isDev = process.env.NODE_ENV === 'development';
const getLanKey = () => {
  if (isDev) {
    return 'zh_CN';
  } else {
    return document.querySelector('meta[name="lang"]').getAttribute('language');
  }
};
// 获取皮肤参数
const getSkinKey = () => {
  if (isDev) {
    return 'blue';
  } else {
    return document.querySelector('meta[name="skin"]').getAttribute('skin');
  }
};
// 获取csrftoken
const getToken = () => {
  let token = '';
  const metas = document.getElementsByTagName('meta');
  for (const meta of metas) {
    if (meta.getAttribute('name') === '_csrf') {
      token = meta.getAttribute('content');
    }
  }
  return token;
};

const renderTheme = ({ path, id }) => {
  return new Promise((resolve, reject) => {
    const head = document.getElementsByTagName('head')[0];
    let linkTag = document.getElementById(id);
    linkTag && linkTag.parentNode.removeChild(linkTag);
    linkTag = document.createElement('link');
    linkTag.href = path;
    linkTag.rel = 'stylesheet';
    linkTag.type = 'text/css';
    linkTag.setAttribute('id', id);
    linkTag.onload = () => resolve();
    linkTag.onerror = err => reject(err);
    head.appendChild(linkTag);
  });
};

const renderLanguage = ({ i18n, data, id }) => {
  const locales = [huiLocale, huiProLocale];
  return new Promise(resolve => {
    i18n.setLocaleMessage(id, data);
    i18n.locale = id;
    locales.forEach(locale => {
      locale.i18n((key, value) => i18n.t(key, value));
    });
    resolve();
  });
};

/**
 * @desc 生成 UUID
 */
const  UUIDGenerator=()=> {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  )
}

// 获取关联设备类型
const getDeviceTypeName = (type)=>{
 const value= DEVICE_OPTIONS.map(item=>{
    if (item.value===type){
      return item.label
    }
  })
  return value&&value.length&&value[0]?value[0]:'--'
}
export { getLanKey, getSkinKey, getToken, renderTheme, renderLanguage,UUIDGenerator,getDeviceTypeName };
