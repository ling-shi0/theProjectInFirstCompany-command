// import oracleDecode from 'oracle-decode';
// import fixInt from 'fix-int';
import flattenDeep from 'lodash/flattenDeep';
import moment from 'moment';
// import { fetchSystemInfo } from '@/io/global'
/**
 * 将函数数组变成连续调用--数组内函数只能有一个参数，一个返回值
 * @param  {...any} funcs
 */
export const chainArrayFuncs = (...funcs) => {
  return async value => {
    let result = value;
    while (funcs.length > 0) {
      result = await funcs.shift()(result);
    }
    return result;
  };
};
/**
 * 根据结果，将数组分成两部分
 * @param {Array} array
 * @param {Function} predicate
 * @return {[Array,Array]}
 */
export const separate = (array, predicate) => {
  const truthy = [];
  const falsy = [];
  for (const item of array) {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }
  return [truthy, falsy];
};

/**
 * 截取图片，生成url
 * @param {string} url
 * @param {{x:number,y:number,w:number,h:number,type:'percent'|'px'}}
 * @return {Promise<string>}
 */
export async function clipImage(url, { x, y, w, h, type = 'percent' }) {
  const canvas = document.createElement('canvas');
  const image = await createImage(url);
  // 注意 非同域的url会失败
  // image.setAttribute('crossOrigin', 'anonymous')
  const imageWidth = image.width;
  const imageHeight = image.height;
  const { width, height, left, top } =
    type === 'percent' //
      ? {
          width: imageWidth * w,
          height: imageHeight * h,
          left: -imageWidth * x,
          top: -imageHeight * y
        }
      : { left: -x, top: -y, width: w, height: h };
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(image, left, top, imageWidth, imageHeight);
  // console.log(left, top, imageWidth, imageHeight)
  // document.body.appendChild(canvas)
  // document.body.appendChild(image)
  // window.image = image
  // window.context = context
  return canvas.toDataURL('image/png');
}
/**
 * 创建图片，在vue里头可以用来做预加载
 * @param {string} url
 * @return {Promise<HTMLImageElement>}
 */
export function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = document.createElement('img');
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = e => reject(e);
  });
}
/**
 * 获取图片尺寸
 * @param {string | HTMLImageElement} img
 * @return {Promise<{width:number,height:number}>}
 */
export async function getImgSize(img) {
  // 如果是字符串，认为是图片链接
  if (Object.prototype.toString.call(img) === '[object String]') {
    const $img = await createImage(img);
    const { width, height } = $img;
    return { width, height };
  } else if (
    Object.prototype.toString.call(img) === '[object HTMLImageElement]'
  ) {
    const { naturalWidth: width, naturalHeight: height } = img;
    return { width, height };
  }
}
/**
 * 求和， 如果参数中有数组，会直接打平求和
 * @param {Array<number | Array<number>>} args
 * @return {number}
 */
export const sum = (...args) => {
  args = flattenDeep(args);
  return args.reduce((last, next) => last + next, 0);
};
/**
 * sleep 指定时长 -- 假的
 * @param {Number} ms
 * @return {void}
 */
export const asyncSleep = ms =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve();
    }, ms)
  );

/**
 * 数字保留两位小数
 * @param {number} dec
 * @return {number}
 * @author liqiang22
 */
export const fixDecimal2Digit = dec => {
  return +dec.toFixed(2);
};

export const getLocationHost = () => {
  return location.hostname;
};

export const getLocationPort = () => {
  const port = location.port;
  if (port) {
    return port;
  }
  if (location.protocol.includes('https')) {
    return '443';
  }
  return '80';
};

export const getLocationProtocol = () => {
  return location.protocol.replace(/[:/]/g, '');
};
/**
 * @param {Promise} promis
 * @param {Function} task
 * @return {Function}
 * @author liqiang22
 * 等待指定的promise状态转换为resolved，如果状态转换到了reject，则需要单独处理（全局监听，或者自行在promise内部处理掉），这里不提供处理方式
 * 注意： 即使task 是同步的，在等待 promise 的时候， 也会转换成异步的，所以封装的方法，如果要结果，需要自行 await
 * 关于this指向，这里包装的函数是function，可以被修改this指向，task真正执行的时候，包装函数内部的this指向哪里，则task内部的this同样指向哪里
 */
export const waitFor = (promis, task) => {
  return function(...args) {
    return promis.then(() => {
      return task.call(this, ...args);
    });
  };
};

/**
 *
 * @param {Array} array
 * @param {string|Symbol} field
 */
export const sortByField = (array, field) => {
  return array.sort((a, b) => {
    const af = Reflect.get(a, field);
    const bf = Reflect.get(b, field);
    if (af > bf) {
      return 1;
    } else if (af === bf) {
      return 0;
    }
    return -1;
  });
};

/**
 * @param {string} str1
 * @param {string} str2
 * @author liqiang22
 */
export const equalsIgnoreCase = (str1, str2) => {
  return String(str1).toLowerCase() === String(str2).toLowerCase();
};

/**
 * 把一个普通的rect扩展成正方形 rect
 * -- 注意： 如果传入的是比例， 会将比例搞成1：1 的， 然后再乘以图片的宽高， 会得到一个跟原图比例一致的图 -- 像素值就不一定是1：1了
 * @param {{x:number,y:number,w:number,h:number}} rect
 */
export function makeSquareRect(rect) {
  let { x, y, w, h } = rect;
  if (w > h) {
    y -= (w - h) / 2;
    h = w;
  } else if (h > w) {
    x -= (h - w) / 2;
    w = h;
  }
  return { x, y, w, h };
}

export const toISOString = date => moment(date).toISOString(true);
/**
 * 生成一个promise， 当promise转换为 fulfilled 状态时， 执行 task， 返回 resolve 方法
 * @param {function} task
 * @param {function} ca 异常时的处理， 不传则吞掉异常
 * @return {function} promise的resolve函数，内部挂载了一个reject
 */
export const resolve = (task, ca = () => {}) => {
  let res;
  new Promise((resolve, reject) => {
    res = resolve;
    res.reject = reject;
  })
    .then(task)
    .catch(ca);
  return res;
};

/**
 * 根据字段名field 将d2 的数据合并到d1中去
 * @template T
 * @param {Array<T>} d1
 * @param {Array<T>} d2
 * @param {string} field
 * @return {Array<T>}
 */
export const mergeData = (d1, d2, field) => {
  d2.forEach(t => {
    const t1 = d1.find(item => item[field] === t[field]);
    if (t1) {
      Object.assign(t1, t);
    } else {
      d1.push(t);
    }
  });
  return d1;
};
/**
 *
 * @param {执行的函数} func
 * @param {防抖等待时间} wait
 */
export function debounce(func, wait) {
  let timer = null;
  return () => {
    if (timer) {
      clearTimeout(timer);
      timer = setTimeout(func, wait);
    } else {
      timer = setTimeout(func, wait);
    }
  };
}

/**
 * 把图片文件读取成url
 * @param {File} file
 * @return {Promise<string>}
 */
export function getFileUrl(file) {
  return new Promise(resolve => {
    const fr = new FileReader();
    fr.onload = evt => {
      /** @type {string} */
      const txt = evt.target.result;
      resolve(txt);
    };
    fr.readAsDataURL(file);
  });
}
/**
 * @param {Date:number} date
 */
export function getTime(date) {
  return moment(date).format('HH:mm:SS');
}
