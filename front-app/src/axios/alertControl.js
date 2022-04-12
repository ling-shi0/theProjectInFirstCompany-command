/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-06-29 14:47:11
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-08-25 15:00:43
 */
import http from '../config/http'
const _ = require('lodash');
const faker = require("faker");
faker.locale = "zh_CN";
const str = 'avc-app/service/rs/v1/api/alarm/'

export default {
  getAlarmPersonList(data) {
    return http({
      method: 'post',
      url: str + 'queryFaceAlarm',
      data
    })
  },
  getAlarmCarList(data) {
    return http({
      method: 'post',
      url: str + 'queryVehicleAlarm',
      data
    })
  },
  getFakeAlarmPersonList() {
    return new Promise((resolve, reject) => {
      resolve({
        data: {
          list: _.times(20, n => ({
            id: faker.datatype.number(),
            componentType: "TARGET_ALARM",
            deploymentId: faker.datatype.number(),
            deployName: faker.lorem.words(),
            alarmEventComponentId: "iface",
            deploySubType: "1",
            alarmEventLevel: "2",
            alarmEventObjName: "追踪图20210617100254,通缉犯20210611170601",
            inputSourceName: "1",
            inputSourceIndexCode: "4fff4c12e6fa49cfa09b792adf7302c7",
            snappedPicUrl:
              "http://10.41.2.96:6120/pic?0dd402i89-e*7651911fem2ep=t8i5d*=*4pdi=*1s6i0d5=*5b9i87f046050265b--81460a-045s3e67z4fai=2=",
            refrencePicUrl:
              "http://10.19.177.49:6120/pic?AC01F06B0DB04900E21A*hcsd7c865c157f34f99a_2020/zlbz_pic_no_cover/21313;1623808726140951139445?pic*430668*13012*12*AC01F06B0DB04900E21A-2*1623808784",
            alarmEventType: "iface99",
            alarmTime: +new Date(),
            alarmTimeUTC: +new Date(),
            deviceType: null,
            analysisType: null,
            similarity: "" + Math.random(),
            attribute:
              '{"alarmId":"96c64cecfc654c48a09d994fe532d2dc","controlId":"195409549","controlName":"人脸名单库布控-0617090249","controlUsername":"admin","controlReason":"iface99","cameraIndexCode":"4fff4c12e6fa49cfa09b792adf7302c7","cameraName":"1","traceUuid":"6648FA66-D393-9443-9D32-E175EE1CA5A81","bkgPicUrl":"http://10.41.2.96:6120/pic?5dd475z89-=s5651706fe448--b562050640f78i9b5*=5d0i6s1*=idp4*=*d6i8t=pe2ma-11913e7*e0fai14i64=","bkgPicUrlBak":"http://10.41.2.96:6120/pic?5dd475z89-=s5651706fe448--b562050640f78i9b5*=5d0i6s1*=idp4*=*d6i8t=pe2ma-11913e7*e0fai14i64=","facePicUrl":"http://10.41.2.96:6120/pic?0dd402i89-e*7651911fem2ep=t8i5d*=*4pdi=*1s6i0d5=*5b9i87f046050265b--81460a-045s3e67z4fai=2=","facePicUrlBak":"http://10.41.2.96:6120/pic?0dd402i89-e*7651911fem2ep=t8i5d*=*4pdi=*1s6i0d5=*5b9i87f046050265b--81460a-045s3e67z4fai=2=","age":28,"gender":"female","glass":"no","smile":"no","ethnic":"no","alarmTime":"2021-06-19T12:59:57.000+08:00","createTime":"2021-06-19T12:58:36.046+08:00","updateTime":"2021-06-19T12:58:36.046+08:00","alarmHumanSize":1,"status":0,"humanId":"0827_NqI8NN_Q8I6NIN6NNEXEIq","similarity":0.061473,"humanName":"李四","listLibId":"1623402361588","timesstamp":"1624078715009","recvTime":"2021-06-19T12:58:34.578+08:00","sendTime":"2021-06-19T12:58:34.580+08:00","aitRecvTime":"1624078715008","alarmHumans":[{"alarmHumanId":"9d6233d6578d4f1fa690470c23ddea74","alarmId":"96c64cecfc654c48a09d994fe532d2dc","humanId":"0827_NqI8NN_Q8I6NIN6NNEXEIq","alarmNo":0,"listLibId":"1623402361588","listLibName":"通缉犯20210611170601","listLibType":0,"listLibTags":"[]","similarity":0.061473,"facePicUrl":"http://10.19.177.49:6120/pic?AC01F06B0DB04900E21A*hcsd7c865c157f34f99a_2020/zlbz_pic_no_cover/21313;1623808726140951139445?pic*430668*13012*12*AC01F06B0DB04900E21A-2*1623808784","facePicUrlBak":"http://10.19.177.49:6120/pic?AC01F06B0DB04900E21A*hcsd7c865c157f34f99a_2020/zlbz_pic_no_cover/21313;1623808726140951139445?pic*430668*13012*12*AC01F06B0DB04900E21A-2*1623808784","humanName":"李四","bornTime":"","certificateType":111,"certificateNumber":"362528199602121013","gender":"male"}],"deployType":"iface","rect":{"x":0.891,"width":0.106,"y":0.251,"height":0.462}}',
            alarmEventObjIndexCode: "1623402361588",
            transInfo: null,
            triggers:
              '[{"type":"client","attributes":[{"name":"userIds","value":"admin"}]},{"type":"sms","attributes":[{"name":"phoneNo","value":","},{"name":"content","value":"布控人员{姓名}于{抓拍时间}在{抓拍设备}经过，请核实"}]},{"type":"libOut","attributes":[{"name":"libOut","value":"false"}]}]',
            alarmTime4Global: "2021-06-19T12:59:57.711+08:00",
            userIds: ",admin,",
            reservedField1: null,
            reservedField2: null,
            archivedFlag: "1",
            sourceUuid: "96c64cecfc654c48a09d994fe532d2dc",
          }))
        }
      })
    })
  },
  getFakeCarAlarmList() {
    return new Promise((resolve, reject) => {
      resolve({
        data: {
          list: _.times(20, n => ({
            id: "f601f465b64742bd853e154fa7fd2656",
            componentType: "TARGET_ALARM",
            deploymentId: "ivehicle_40de267d83f740b3a0ee5621d5cd2d3d",
            deployName: faker.lorem.words(),
            alarmEventComponentId: "ivehicle",
            deploySubType: "0",
            alarmEventLevel: "2",
            alarmEventObjName: "沪C12345",
            inputSourceName: "sky_模拟卡口",
            inputSourceIndexCode: "8d2ffeff6a804306bd8251a46a7c2310",
            snappedPicUrl:
              "http://10.41.2.96:6120/pic?0dd402i89-e*7651911fem2ep=t8i5d*=*4pdi=*1s6i0d5=*5b9i87f046050265b--81460a-045s3e67z4fai=2=",
            refrencePicUrl: null,
            alarmEventType: "ivehicle1",
            alarmTime: +new Date(),
            alarmTimeUTC: 1624436955550,
            deviceType: null,
            analysisType: null,
            similarity: null,
            attribute:
              '{"passId":"2959780DFD25A843824EE76F51395309","sequenceId":"2959780DFD25A843824EE76F51395309"}',
            alarmEventObjIndexCode: "沪C12345",
            transInfo: null,
            triggers:
              '[{"type":"client","attributes":[{"name":"userIds","value":"admin"}]},{"type":"sms","attributes":[{"name":"phoneNo","value":","},{"name":"content","value":"布控人员{姓名}于{抓拍时间}在{抓拍设备}经过，请核实"}]},{"type":"alarmTimeRange","attributes":[{"name":"startTime","value":"00:00:00"},{"name":"endTime","value":"23:59:59"}]},{"type":"circleOut","attributes":[{"name":"circleOut","value":"false"}]},{"type":"libOut","attributes":[{"name":"libOut","value":"false"}]}]',
            alarmTime4Global: "2021-06-23T16:29:15.550+08:00",
            userIds: ",admin,",
            reservedField1: null,
            reservedField2: null,
            archivedFlag: null,
            sourceUuid: null,
          }))
        }
      })
    })
  }
}


/**
 *
            /*this.listArr.push({
              id: "f601f465b64742bd853e154fa7fd2656",
              componentType: "TARGET_ALARM",
              deploymentId: "ivehicle_40de267d83f740b3a0ee5621d5cd2d3d",
              deployName: "车牌布控-沪C12345",
              alarmEventComponentId: "ivehicle",
              deploySubType: "0",
              alarmEventLevel: "2",
              alarmEventObjName: "沪C12345",
              inputSourceName: "sky_模拟卡口",
              inputSourceIndexCode: "8d2ffeff6a804306bd8251a46a7c2310",
              snappedPicUrl:
                "http://10.19.165.23:6120/pic?AC01F06B0DB03203AAD1*hcs0c576a682bdc4890a_2020/zlbz_normal_cover/18308;1624436447913361183872?pic*1204113637*363470*1866*AC01F06B0DB03203AAD1-2*1624436954",
              refrencePicUrl: null,
              alarmEventType: "ivehicle1",
              alarmTime: "2021-06-23T16:29:15.550+08:00",
              alarmTimeUTC: 1624436955550,
              deviceType: null,
              analysisType: null,
              similarity: null,
              attribute:
                '{"passId":"2959780DFD25A843824EE76F51395309","sequenceId":"2959780DFD25A843824EE76F51395309"}',
              alarmEventObjIndexCode: "沪C12345",
              transInfo: null,
              triggers:
                '[{"type":"client","attributes":[{"name":"userIds","value":"admin"}]},{"type":"sms","attributes":[{"name":"phoneNo","value":","},{"name":"content","value":"布控人员{姓名}于{抓拍时间}在{抓拍设备}经过，请核实"}]},{"type":"alarmTimeRange","attributes":[{"name":"startTime","value":"00:00:00"},{"name":"endTime","value":"23:59:59"}]},{"type":"circleOut","attributes":[{"name":"circleOut","value":"false"}]},{"type":"libOut","attributes":[{"name":"libOut","value":"false"}]}]',
              alarmTime4Global: "2021-06-23T16:29:15.550+08:00",
              userIds: ",admin,",
              reservedField1: null,
              reservedField2: null,
              archivedFlag: null,
              sourceUuid: null,
            });*/


/*this.listArr.push({
              id: "bae5392be94b4121aae8c1d752ea7cc8",
              componentType: "TARGET_ALARM",
              deploymentId: "195409549",
              deployName: "人脸名单库布控-0617090249",
              alarmEventComponentId: "iface",
              deploySubType: "1",
              alarmEventLevel: "2",
              alarmEventObjName: "追踪图20210617100254,通缉犯20210611170601",
              inputSourceName: "1",
              inputSourceIndexCode: "4fff4c12e6fa49cfa09b792adf7302c7",
              snappedPicUrl:
                "http://10.41.2.96:6120/pic?0dd402i89-e*7651911fem2ep=t8i5d*=*4pdi=*1s6i0d5=*5b9i87f046050265b--81460a-045s3e67z4fai=2=",
              refrencePicUrl:
                "http://10.19.177.49:6120/pic?AC01F06B0DB04900E21A*hcsd7c865c157f34f99a_2020/zlbz_pic_no_cover/21313;1623808726140951139445?pic*430668*13012*12*AC01F06B0DB04900E21A-2*1623808784",
              alarmEventType: "iface99",
              alarmTime: "2021-06-19T12:59:57.711+08:00",
              alarmTimeUTC: 1624078797711,
              deviceType: null,
              analysisType: null,
              similarity: "0.061473",
              attribute:
                '{"alarmId":"96c64cecfc654c48a09d994fe532d2dc","controlId":"195409549","controlName":"人脸名单库布控-0617090249","controlUsername":"admin","controlReason":"iface99","cameraIndexCode":"4fff4c12e6fa49cfa09b792adf7302c7","cameraName":"1","traceUuid":"6648FA66-D393-9443-9D32-E175EE1CA5A81","bkgPicUrl":"http://10.41.2.96:6120/pic?5dd475z89-=s5651706fe448--b562050640f78i9b5*=5d0i6s1*=idp4*=*d6i8t=pe2ma-11913e7*e0fai14i64=","bkgPicUrlBak":"http://10.41.2.96:6120/pic?5dd475z89-=s5651706fe448--b562050640f78i9b5*=5d0i6s1*=idp4*=*d6i8t=pe2ma-11913e7*e0fai14i64=","facePicUrl":"http://10.41.2.96:6120/pic?0dd402i89-e*7651911fem2ep=t8i5d*=*4pdi=*1s6i0d5=*5b9i87f046050265b--81460a-045s3e67z4fai=2=","facePicUrlBak":"http://10.41.2.96:6120/pic?0dd402i89-e*7651911fem2ep=t8i5d*=*4pdi=*1s6i0d5=*5b9i87f046050265b--81460a-045s3e67z4fai=2=","age":28,"gender":"female","glass":"no","smile":"no","ethnic":"no","alarmTime":"2021-06-19T12:59:57.000+08:00","createTime":"2021-06-19T12:58:36.046+08:00","updateTime":"2021-06-19T12:58:36.046+08:00","alarmHumanSize":1,"status":0,"humanId":"0827_NqI8NN_Q8I6NIN6NNEXEIq","similarity":0.061473,"humanName":"李四","listLibId":"1623402361588","timesstamp":"1624078715009","recvTime":"2021-06-19T12:58:34.578+08:00","sendTime":"2021-06-19T12:58:34.580+08:00","aitRecvTime":"1624078715008","alarmHumans":[{"alarmHumanId":"9d6233d6578d4f1fa690470c23ddea74","alarmId":"96c64cecfc654c48a09d994fe532d2dc","humanId":"0827_NqI8NN_Q8I6NIN6NNEXEIq","alarmNo":0,"listLibId":"1623402361588","listLibName":"通缉犯20210611170601","listLibType":0,"listLibTags":"[]","similarity":0.061473,"facePicUrl":"http://10.19.177.49:6120/pic?AC01F06B0DB04900E21A*hcsd7c865c157f34f99a_2020/zlbz_pic_no_cover/21313;1623808726140951139445?pic*430668*13012*12*AC01F06B0DB04900E21A-2*1623808784","facePicUrlBak":"http://10.19.177.49:6120/pic?AC01F06B0DB04900E21A*hcsd7c865c157f34f99a_2020/zlbz_pic_no_cover/21313;1623808726140951139445?pic*430668*13012*12*AC01F06B0DB04900E21A-2*1623808784","humanName":"李四","bornTime":"","certificateType":111,"certificateNumber":"362528199602121013","gender":"male"}],"deployType":"iface","rect":{"x":0.891,"width":0.106,"y":0.251,"height":0.462}}',
              alarmEventObjIndexCode: "1623402361588",
              transInfo: null,
              triggers:
                '[{"type":"client","attributes":[{"name":"userIds","value":"admin"}]},{"type":"sms","attributes":[{"name":"phoneNo","value":","},{"name":"content","value":"布控人员{姓名}于{抓拍时间}在{抓拍设备}经过，请核实"}]},{"type":"libOut","attributes":[{"name":"libOut","value":"false"}]}]',
              alarmTime4Global: "2021-06-19T12:59:57.711+08:00",
              userIds: ",admin,",
              reservedField1: null,
              reservedField2: null,
              archivedFlag: "1",
              sourceUuid: "96c64cecfc654c48a09d994fe532d2dc",
            });*/