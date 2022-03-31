/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-02-24 15:53:21
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-18 16:33:44
 */
module.exports = (req, res) => {
  res.send({
    code: '0',
    data: {
      list: [
        {
          alarmAreaCode: null,
          alarmComment: '称九千多元丢失，需要帮助寻找',
          alarmLevel: '4',
          alarmMode: '电话报警',
          alarmNo: '330000180820090001811111111',
          alarmPersonCertificateNumber: null,
          alarmPersonFaceUrl: null,
          alarmPersonName: '张三',
          alarmPersonPhone: '13801545102',
          alarmPersonSex: null,
          alarmPersonTag: '多次报警',
          alarmPhoneTag: '历史报警1115次,重复报警1次',
          alarmSituationAddress: '案发地：泺清水岸小区二期C9号楼2单元1101室；报警人现在张庄镇',
          alarmSituationCategory: '自然灾害测试',
          alarmSituationType: null,
          alarmState: '接警',
          alarmTime: '2021-03-18 16:45:08',
          alarmType: '110报警',
          alertVaildState: null,
          arriveTime: null,
          assignTime: '2021-03-29 16:48:08',
          callInTime: null,
          callOutTime: null,
          caseNo: null,
          dealResult: null,
          disposeDept: '330401',
          disposePerson: null,
          disposePersonUserId: null,
          disposeType: '派单处置',
          endTime: null,
          feedBackTime: null,
          feedback: null,
          feedbackPicUrl: null,
          feedbackVideoUrl: null,
          feedbackVoiceUrl: null,
          finalFeedback: null,
          focus: '0',
          forceNum: null,
          id: 'ca4d871510134204b7165a4b184bb95d',
          jurisdictionalDept: null,
          jurisdictionalDeptCode: null,
          latitude: '37.45265',
          longitude: '116.30351',
          positionType: null,
          recordingsNo: null,
          signTime: null,
          signUserId: null,
          takeAlarmDept: '嘉兴分局',
          takeAlarmDeptCode: '3304',
          updateTime: '2021-03-18 16:44:11'
        },
        {
          id: 101,
          alarmNo: '3301001708100200194',
          alarmLevel: '1',
          alarmTime: '2021-02-23 10:00:00',
          feedBackTime: null,
          arriveTime: '2021-03-29 15:23:08',
          signTime: '2021-02-23 10:00:48',
          assignTime: '2021-02-23 10:00:38',
          alarmType: '110报警',
          alarmMode: '电话报警',
          disposeType: '派单处置',
          recordingsNo:
            'https://ws.stream.qqmusic.qq.com/C400004MYIua2lHw9P.m4a?guid=9861136692&vkey=1F0F1899E5F62918E67D9E1C58D437297C1D65DF668063859823F5C40780E40598C3B4DA7A87CD68F91F0FB457B0C12B01D841EF34273813&uin=0&fromtag=66',
          alarmPersonName: '李四',
          alarmPersonCertificateNumber: '',
          alarmPersonTag: '',
          alarmPhoneTag: '历史报警3次,重复报警0次',
          alarmPersonFaceUrl: '',
          alarmPersonPhone: '13801545101',
          alarmPersonsex: '男',
          alarmComment:
            '称手机放在厕所被人捡走了，现已关机，求助，此报警电话可以联系到报警人',
          alarmSituationAddress: '教工路欧美中心D座901',
          longitude: '116.31351',
          latitude: '37.46265',
          alarmSituationCategory: '自然灾害',
          alarmSituationType: '',
          alarmState: '到达',
          jurisdictionalDept: '',
          jurisdictionalDeptCode: '',
          disposeDept: '3304',
          disposePerson: '',
          disposePersonUserId: '',
          dealResult: '',
          updateTime: '2021-02-23 10:00:00',
          alarmAreaCode: '',
          forceNum: '',
          callInTime: '',
          callOutTime: '',
          takeAlarmDept: '一大队',
          takeAlarmDeptCode: '330401',
          feedback: '',
          finalFeedback: '',
          focus: '0',
          feedbackPicUrl: '',
          feedbackVideoUrl: '',
          feedbackVoiceUrl: ''
        }
      ]
    },
    msg: '操作成功了！'
  });
};
