import http from '../config/http';
export default {
    getListData(data) {
        return http({
            method: 'post',
            url: '/network110/web/task/taskDispatch',
            data: data
        });
    },
    signUp(data) {
        return http({
            method: 'post',
            url: '/network110/web/alarm/signReport',
            data: data
        });
    },
    saveTask(data) {
        return http({
            method: 'post',
            url: '/network110/web/task/save',
            data: data
        });
    },
    getTaskInfo(data) {
        return http({
            method: 'post',
            url: '/network110/web/task/findById',
            data: data
        });
    },
    getAlarmInfo(data) {
        return http({
            method: 'post',
            url: 'avc-app/service/rs/v1/api/alert/queryAlertInfo',
            data: data
        });
    },
    // 上传民警位置
    uploadPosition(data) {
        return http({
            method: 'post',
            url: '/network110/web/location/upload',
            data: data
        });
    },
    // 获取报警人位置
    getAlarmUserPosition(data) {
        return http({
            method: 'post',
            url: '/network110/web/location/getPosition',
            data: data
        });
    },
    // 保存自助报警data
    deleteFile(data) {
        return http({
            method: 'post',
            url: '/network110/web/uploadFile/delete',
            data: data
        });
    },
    // 获取民警位置
    getDemonstration(data) {
        return http({
            method: 'post',
            url: '/network110/web/location/getDemonstration',
            data: data
        });
    },
    // 获取民警位置
    uploadRoute(data) {
        return http({
            method: 'post',
            url: '/network110/web/location/uploadRoute',
            data: data
        });
    },
    // 获取民警位置
    getRoute(data) {
        return http({
            method: 'post',
            url: '/network110/web/location/getRoute',
            data: data
        });
    },
    // 获取民警轨迹
    getPoliceRoute(data) {
        return http({
            method: 'post',
            url: '/network110/web/location/getPoliceRoute',
            data: data
        });
    },
    // 获取报警用户轨迹
    getUserRoute(data) {
        return http({
            method: 'post',
            url: '/network110/web/location/getUserRoute',
            data: data
        });
    },
    getAlarmDetail(data) {
        return http({
            method: 'get',
            url: '/avc-app/service/rs/v1/api/alert/alertDetail',
            params: data
        });
    }
};
