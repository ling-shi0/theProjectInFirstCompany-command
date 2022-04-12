/* eslint-disable camelcase */
/* 通话状态 */
export const AUDIO_ANSWERING = 'answering'; // 音频-等待接听
export const AUDIO_CALLING = 'calling'; // 音频-拨打中
export const AUDIO_CHATING = 'chating'; // 音频-聊天中
export const AUDIO_END = 'audioEnd'; // 音频-结束

/* 基本消息类型 */
export const TEXT_TYPE = 'txt'; // 文本类型
export const FILE_TYPE = 'file'; // 文件类型
export const VOICE_TYPE = 'audio'; // 语音条类型
export const VIDEO_TYPE = 'video'; // 视频文件类型
export const PIC_TYPE = 'pic'; // 图片类型
export const VIDEO_SHARE_TYPE = 'share'; // 视频分享类型

// 所有基本消息类型
export const NORMAL_MSG_TYPE = [
  TEXT_TYPE,
  FILE_TYPE,
  VOICE_TYPE,
  VIDEO_TYPE,
  PIC_TYPE,
  VIDEO_SHARE_TYPE
];

/* 通话类型 */
export const CHAT_TYPES = ['single_cdr', 'group_call_stop'];

/* 群成员变更消息 */
export const GROUP_NAME_UPDATE_TYPE = 'group_name_update'; // 群名修改
export const GROUP_MEMBER_ADD_TYPE = 'group_member_add'; // 群成员新增
export const GROUP_MEMBER_DEL_TYPE = 'group_member_del'; // 群成员删除

// 所有群变更消息
export const GROUP_MEMBER_UPDATE_TYPES = [
  GROUP_NAME_UPDATE_TYPE,
  GROUP_MEMBER_ADD_TYPE,
  GROUP_MEMBER_DEL_TYPE
];

// 所有消息类型集合
export const All_MSG_TYPES = [...NORMAL_MSG_TYPE, ...CHAT_TYPES, ...GROUP_MEMBER_UPDATE_TYPES];

export const GROUP_TYPE = ['6100', '6061']; // 群组类型值

// 挂断状态
export const HANGUP_CAUSE = {
  NORMAL_CLEARING: '通话已被挂断',
  USER_NOT_REGISTERED: '用户不在线',
  ORIGINATOR_CANCEL: '通话已取消',
  USER_BUSY: '通话已拒绝',
  CALL_REJECTED: '对方已拒绝',
  DESTINATION_OUT_OF_ORDER: '服务器异常',
  INCOMPATIBLE_DESTINATION: '此号码无法呼叫'
};

// 发送消息的状态
export const SEND_MSG_STATUS = {
  sending: 'sending',
  sendSuc: 'sendSuc',
  sendErr: 'sendErr'
};

// 通话消息挂断类型
export const CALL_FINISH_STATUS = {
  cancel: '通话已取消',
  normal: '通话结束',
  reject: '通话已拒绝',
  no_answer: '通话未接听',
  off_line: '通话未接听'
}

export const MAX_VIDEO_CHAT_NUM = 9; // 最大视频通话人数

// 通话类型
export const CALL_TYPES = {
  audio: '音频',
  video: '视频'
};

// 上传成功标识位
export const REQUEST_SUCCESS = '0';

// 设备类型
export const DEVICE_OPTIONS = [{
  label: '对讲机PDT',
  value: 1
}, {
  label: '单兵',
  value: 2
}, {
  label: '执法记录仪',
  value: 3
}, {
  label: '车载',
  value: 4
}, {
  label: '电台',
  value: 5
}]

export const LEGEND_PIC = [
  {
    labelName: "岗亭",
    picUrl: require('./assets/images/config/police-box.png')
  },
  {
    labelName: "KTV",
    picUrl: require('./assets/images/config/ktv.png')
  },
  {
    labelName: "小区",
    picUrl: require('./assets/images/config/housing-estate.png')
  },
  {
    labelName: "网吧",
    picUrl: require('./assets/images/config/internet-bar.png')
  },
  {
    labelName: "重点区域",
    picUrl: require('./assets/images/config/areas.png')
  }
]
