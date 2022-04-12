// 获取语言和皮肤参数
import { getLanKey, getSkinKey } from '@/utils/common';
export default {
  setUserInfo(context) {
    return new Promise(resolve => {
      // userInfo
      const data = {
        languageId: getLanKey(),
        skin: getSkinKey()
      };
      context.commit('setUserInfo', data);
      resolve({
        userInfo: data
      });
    });
  },

};
