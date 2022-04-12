<template>
  <el-dialog
    :title="title"
    :visible="visible"
    :area="[480, 720]"
    @close="cancel"
    top="middle"
    class="edit-police-dialog"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="140px"
      label-position="top"
      class="edit-form"
      :rules="rules"
    >
      <el-form-item label="警员编号" required>
        <el-input v-model="form.policeNo" disabled></el-input>
      </el-form-item>
      <el-form-item label="警员姓名" required>
        <el-input v-model="form.policeRealName" disabled></el-input>
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input v-model="form.phoneNum" disabled></el-input>
      </el-form-item>
      <el-form-item label="短号">
        <el-input v-model="form.shortNum" disabled></el-input>
      </el-form-item>
      <el-form-item label="所属单位" required>
        <el-input v-model="form.deptName" disabled></el-input>
      </el-form-item>
      <el-form-item label="关联设备类型">
        <el-select
          v-model="form.associateDeviceType"
          placeholder="请选择关联设备类型"
        >
          <el-option
            v-for="(item, index) in DEVICE_OPTIONS"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <el-input v-model="form.associateDeviceType"></el-input> -->
      </el-form-item>
      <el-form-item label="关联主动设备编号" prop="deviceId">
        <el-input v-model="form.deviceId" :maxlength="50"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="savePoliceInfo">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { deepClone } from '@hui-pro/utils';
import { modPoliceUserInfo } from '@/api/policeConfig';
import { DEVICE_OPTIONS } from '@/constants.js';
export default {
  name: 'EditPoliceDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '添加警员'
    },
    dataProvide: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        policeNo: '',
        policeRealName: '',
        phoneNum: null,
        shortNum: null,
        deptName: '',
        associateDeviceType: null,
        deviceId: null
      },
      DEVICE_OPTIONS,
      rules: {
        deviceId: [
          {
            pattern: /^[\u4E00-\u9FA5A-Za-z0-9_.·-]+$/,
            message: "设备编号不能包含除'_' '.' '·' '-'以外特殊字符"
          }
        ]
      }
    };
  },
  watch: {
    dataProvide: {
      handler(val) {
        if (val) {
          // 编辑警员信息时同步数据
          for (const key in val) {
            this.form[key] = val[key] || '';
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    cancel() {
      this.$emit('update:visible', false);
    },
    async savePoliceInfo() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.modPoliceInfo();
        }
      });
    },
    async modPoliceInfo() {
      const { deviceId, associateDeviceType } = this.form;
      const { id } = this.dataProvide;
      try {
        const res = await modPoliceUserInfo({
          id,
          deviceId,
          deviceType: associateDeviceType
        });
        if (res.msg === 'SUCCESS') {
          this.$emit('fetch', { type: 'edit' });
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        }
        this.cancel();
      } catch {
        this.cancel();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.edit-police-dialog {
  .edit-form {
    margin: 0 60px;
  }
}
</style>
