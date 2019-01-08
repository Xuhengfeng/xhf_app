<template>
  <!-- 发布通知 -->
  <div class="send-notice">
    <div class="header">
      <group gutter="0">
        <div class="title">标题</div>
        <x-input v-model="formData.noticeName" placeholder="请输入标题..."></x-input>
        <div class="title">内容</div>
        <x-textarea v-model="formData.noticeContent" :rows="5" name="description" placeholder="请输入内容..."></x-textarea>
      </group>
      <div class="files">
        <file-list :edit="true" :icon-size="40" :image-size="80" v-model="attachments" :props="{}" @on-remove="delFile"></file-list>
      </div>
      <div class="groupIcon">
        <div>
          <upload label-width="60px" @on-success="uploadSuccess"><img src="@/images/7.png"><span>图片</span></upload>
        </div>
        <div v-if="isShowVoice"><label for="xFile"><img src="@/images/audio.png"><span>录音</span></label></div>
        <input id="xFile" ref="audioFile" style="position:absolute;clip:rect(0 0 0 0);width:20%" type="file" accept="audio/*" capture="microphone" @change="uploadAudio($event)">
      </div>
      <div class="groupRange">发布范围</div>
    </div>

    <div class="main">
      <div class="groupPublish">
        <div>
          <label for="student">
            <p>学生</p>
            <p>{{selectStudent.length}}人</p>
          </label>
          <input id="student" type="checkbox" v-model="formData.noticeStudent" />
        </div>
        <div>
          <label for="parent">
            <p>家长</p>
            <p>{{formData.arg2}}人</p>
          </label>
          <input id="parent" type="checkbox" v-model="formData.noticeParent" />
        </div>
      </div>
      <template v-if="selectStudent&&selectStudent.length">
        <!-- 学生 -->
        <div class="staff bgColor" v-for="(item,index) in selectStudent" :key="index" v-show="index<=maxShowStudentNum">
          {{item.studentName}}<img class="icon-remove" src="@/images/close.svg" @click.stop="remove(item)" />
        </div>
        <!-- 家长 -->
        <div class="staff bgColor parent" v-for="item in parent" :key="item.parentId">
          <span>{{item.parentName}}</span><img class="icon-remove" src="@/images/close.svg" @click.stop="removeParent(item)" />
        </div>
        <div class="staff" v-if="selectStudent.length<=studentListNum" @click="addPerson()">添加</div>
        <div class="more" v-if="selectStudent.length>=maxShowStudentNum" @click="checkMore()">查看更多<i class="lc-rt-arrow"></i></div>
      </template>
      <div v-if="!selectStudent.length" class="staff" @click="addPerson()">修改人员</div>
    </div>
    <div class="footer">
      <div>
        <button @click="send(0)">保存草稿</button>
        <button @click="send(1)">正式发布</button>
      </div>
    </div>
  </div>
</template>

<script>
import { XTextarea, Group, Cell, XInput, PopupPicker, XButton, XSwitch, Radio, Checker, CheckerItem, Popup, Checklist, PopupHeader } from 'vux'
import { mapState } from 'vuex'
import { once } from '@xuhengfeng/utils-app'
const { fileApi } = window.SYSTEM_CONFIG
const { Prefix, AuthUrl } = window.COS_CONFIG || {}
export default {
  name: 'edit',
  components: {
    XTextarea,
    Group,
    Cell,
    XInput,
    PopupPicker,
    XButton,
    XSwitch,
    Radio,
    Checker,
    CheckerItem,
    Popup,
    Checklist,
    PopupHeader
  },
  props: {
    // 上传服务器地址
    action: {
      type: String,
      default: Prefix || `${fileApi}/file`
    },
    // 请求头参数
    query: {
      type: Object,
      default () {
        return {
          terminal_type: 'pc',
          access_token: window.localStorage.getItem('token')
        }
      }
    },
    // 下载服务器地址
    action2: {
      type: String,
      default: fileApi + '/file/IoReadFile'
    }
  },
  data () {
    return {
      parent: [], // 家长
      maxShowStudentNum: 12, // 最多显示学生多少个
      attachments: [], // 附件
      isShowVoice: true, // 是否显示录音功能
      // 提交接口
      formData: {
        arg1: 0, // 学生人数
        arg2: 0, // 家长人数
        id: '',
        noticeName: '', // 通知主题
        noticeContent: '', // 通知内容
        noticeFileList: [], // 附件
        parentIdList: [],
        noticeStudent: true, // 是否通知学生0 1
        noticeParent: true, // 是否通知家长0 1
        sendStatus: 0, // 0草稿  1发布
        userIdList: [] // 学生id
      },
      // 通知类型列表
      typeList: [],
      showPopup: false, // 显示角色选择弹层
      // 角色列表
      roleList: [],
      recorder: null,
      audioUrl: null // 录音地址
    }
  },
  computed: {
    ...mapState({
      selected: state => state.selected.selected,
      // 选中的学生
      selectStudent: state => state.selectStudent,
      // 学生总人数
      studentListNum: state => state.studentListNum,
      // 当前要删除的草稿对象
      currentDropItem: state => state.currentDropItem,
      // 删除的草稿
      dropItem: state => state.dropItem
    }),
    // 是否显示添加
    isShowAdd () {
      if (this.studentListNum === this.selectStudent.length) {
        return false
      } else if (this.studentListNum > this.selectStudent.length) {
        return true
      }
    },
    // 是否显示更多
    isShowMore () {
      if (this.selectStudent.length > this.maxShow) {
        return true
      }
    }
  },
  watch: {
    dropItem (value) {
      if (value.attachments) {
        this.formData.arg1 = this.dropItem.arg1
        this.formData.arg2 = this.dropItem.arg2
        this.formData.noticeFileList = this.dropItem.noticeFileList
        this.formData.noticeName = this.dropItem.noticeName
        this.formData.noticeContent = this.dropItem.noticeContent
        this.attachments = this.dropItem.noticeFileList
        this.selectStudent = this.dropItem.arr1
        this.parent = this.dropItem.arr2
        this.formData.id = this.dropItem.id
      }
    }
  },
  mounted () {
    if (this.$Terminal === 'iPhone') this.isShowVoice = false
  },
  methods: {
    // 查看更多
    checkMore () {
      this.isShowMore = false
      this.maxShow = this.selectStudent.length
    },
    // 添加人员
    addPerson () {
      this.$router.push('/SendNotice/AddPerson')
      this.$store.dispatch('getNotice', this.formData)
    },
    // 移除学生
    remove (item) {
      if (this.selectStudent) {
        var tagIndex = this.selectStudent.findIndex(el => el.studentId === item.studentId)
        this.selectStudent.splice(tagIndex, 1)
        this.$store.dispatch('getSelectStudent', this.selectStudent)
      }
    },
    // 移除家长
    removeParent (item) {
      let tagIndex = this.parent.findIndex(el => el.parentId === item.parentId)
      this.parent.splice(tagIndex, 1)
      this.formData.arg2 = this.parent.length
    },
    // 获取授权信息
    _getAuthorization (file) {
      return axios.get(`${AuthUrl}?method=POST`).then(res => {
        if (res.data.success) {
          return res.data.data
        }
      })
    },
    // 上传到腾讯云
    _upload1 (file) {
      this._getAuthorization().then(auth => {
        const formData = new FormData()
        let pathname = 'file-' + parseInt(1000000 * (Math.random() + 1)) + '/' + file.name // 随机文件夹名以避免同名文件覆盖
        formData.append('Signature', auth.Authorization)
        formData.append('x-cos-security-token', auth.XCosSecurityToken)
        formData.append('key', pathname)
        formData.append('file', file)
        axios({
          url: this.action,
          method: 'post',
          data: formData,
          params: this.query
        }).then(res => {
          this._toast('上传录音成功')
          const data = { url: `${this.action.replace(/\/$/, '')}/${pathname}` }
          var obj = {
            'fileTitle': '音频录音文件',
            'fileType': file.fileType,
            'fileUrl': data.url,
            'fileUuid': 'audio'
          }
          this.formData.noticeFileList.push(obj)
        })
      })
    },
    // 上传录音
    uploadAudio (e) {
      var that = this
      var reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])// 发起异步请求
      reader.onload = function (res) {
        that._upload1(e.target.files[0])
      }
    },
    // 上传附件
    uploadSuccess (value) {
      var obj = {
        'fileTitle': value.name,
        'fileType': value.ext,
        'fileUrl': value.url,
        'fileUuid': value.uuid
      }
      this.attachments.push(obj)
      this.formData.noticeFileList.push(obj)
    },
    // 删除附件
    delFile (item) {
      var arr = this.dropItem.noticeFileList.filter(el => el.fileTitle !== item.fileTitle)
      var obj = Object.assign({}, this.dropItem, { noticeFileList: arr })
      this.$store.dispatch('getDropItem', obj)
    },
    // 获取家长列表
    getParentList () {
      this.parent = []
      if (this.selectStudent) {
        this.$classAjax.post(this.$URL.classNoticeListStudentParent, this.selectStudent.map(el => el.studentId)).then(res => {
          if (res != null && res.length) {
            this.formData.arg2 = res.length
            res.forEach((el, index) => {
              this.parent.push(el)
            })
          } else {
            this.formData.arg2 = 0
          }
        })
      }
    },
    // 发送
    send (num) {
      // 验证
      if (this.formData.noticeName === '') {
        this._toast('请输入标题')
        return
      } else if (this.formData.noticeContent === '') {
        this._toast('请输入内容')
        return
      } else if (this.formData.noticeStudent === false) {
        this._toast('请选择发布范围')
        return
      } else if (this.selectStudent.length === 0) {
        this._toast('请选择学生')
        return
      }

      this.formData.arg1 = this.selectStudent.length
      this.formData.noticeStudent = this.formData.noticeStudent === true ? 1 : 0
      this.formData.noticeParent = this.formData.noticeParent === true ? 1 : 0
      this.formData.parentIdList = this.parent.map(el => el.parentId)
      this.formData.userIdList = this.selectStudent.map(el => el.studentId)
      this.formData.sendStatus = num
      var totalNum = this.formData.arg1 + this.formData.arg2

      this.$vux.confirm.show({
        title: '提示',
        content: num === 0 ? '保存草稿' : '确认发送?',
        onConfirm: () => {
          this.$classAjax.put(this.$URL.classNoticeUpdate, this.formData).then(res => {
            if (num === 0) {
              this.clearFormData()
              this.$router.push('/DraftList/View')
            } else {
              this.clearFormData()
              this._toast('发布成功')
              let total = this.formData.arg1 + this.formData.arg2
              this.$router.push(`/SendNotice/PublishSuccess?num=${totalNum}`)
            }
          })
        }
      })
    },
    _toast (text) {
      this.$vux.toast.show({ type: 'text', text })
    },
    // 清空提交数据
    clearFormData () {
      this.formData = {
        arg1: 0, // 学生人数
        arg2: 0, // 家长人数
        id: '',
        noticeName: '', // 通知主题
        noticeContent: '', // 通知内容
        noticeFileList: [], // 附件
        parentIdList: [],
        noticeStudent: true, // 是否通知学生0 1
        noticeParent: true, // 是否通知家长0 1
        sendStatus: 0, // 0草稿  1发布
        userIdList: [] // 学生id
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@xuhengfeng/styles-app/styles/mixin.less";
// input组
.send-notice {
  overflow-y: scroll;
  .header {
    width: 100%;
    padding: 0.3rem 0.3rem 0;
    overflow: hidden;
    box-sizing: border-box;
    background: #ffffff;
    .weui-btn {
      background: @color-theme;
    }
    .title {
      height: 0.8rem;
      line-height: 0.8rem;
      color: #333333;
      font-size: 0.32rem;
      font-weight: 700;
      font-family: "PingFang-SC";
      margin-left: 10px;
    }
    .vux-x-input,
    .vux-x-textarea {
      background: #ffffff;
      border: 1px solid #e9e9e9;
    }
  }
}
.selected-person {
  p {
    padding: 0 12px;
    height: 44px;
    line-height: 44px;
    .flex(row, space-between);
    i {
      font-size: 20px;
      color: @color-999;
    }
  }
  ul {
    padding: 12px;
    li {
      display: inline-block;
      font-size: 12px;
      padding: 0 10px;
      height: 25px;
      line-height: 25px;
      border-radius: 12px;
      background-color: @color-e3;
      color: @color-666;
      margin-right: 5px;
      margin-bottom: 5px;
      position: relative;
      .icon-close {
        position: absolute;
        right: -5px;
        top: -10px;
        font-size: 16px;
        color: @color-999;
      }
      i {
        font-size: 14px;
        color: @color-666;
      }
    }
  }
}

.groupIcon {
  margin-top: 0.25rem;
  overflow: hidden;
  > div {
    float: left;
    text-align: center;
    margin-right: 0.6rem;
    img {
      display: block;
      width: 0.64rem;
      height: 0.64rem;
      background: #fff;
      border-radius: 50%;
      margin: 0 auto;
    }
    span {
      font-size: 0.26rem;
      color: #999999;
    }
    &:nth-of-type(1) {
      img {
        margin: 0 auto 0.1rem;
      }
    }
  }
}
// 发布范围
.groupRange {
  text-align: center;
  font-size: 0.32rem;
  font-weight: 700;
  color: #333333;
  line-height: 1.18rem;
  height: 1.18rem;
  background: url("~@/images/intersperse.png") center center no-repeat;
  background-size: 35%;
}
// 学生 家长
.groupPublish {
  display: flex;
  flex-flow: row nowrap;
  height: 1.32rem;
  padding: 0 0.3rem 0.3rem;
  background: #ffffff;
  > div {
    position: relative;
    flex: 1;
    background: #cccccc;
    border-radius: 0.1rem;
    &:nth-of-type(1) {
      margin-right: 0.15rem;
      background: url("~@/images/3.png") center center;
      background-size: cover;
    }
    &:nth-of-type(2) {
      margin-left: 0.15rem;
      background: url("~@/images/4.png") center center;
      background-size: cover;
    }
    label {
      position: absolute;
      width: 90%;
      top: 0.1rem;
      left: 0;
      padding-left: 0.4rem;
      color: #ffffff;
      p:nth-of-type(1) {
        font-size: 0.4rem;
      }
      p:nth-of-type(2) {
        font-size: 0.28rem;
      }
    }
  }
  input[type="checkbox"] {
    position: absolute;
    right: 0.3rem;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 0.48rem;
    height: 0.48rem;
    background: transparent;
    -webkit-appearance: none;
    border: 2px solid #ffffff;
    border-radius: 2px;
    outline: none;
  }
  input[type="checkbox"]:checked {
    background: url("~@/images/5.png") center center;
    background-size: 120% 120%;
  }
}

.main {
  position: relative;
  overflow: hidden;
  padding: 0.3rem 0 2rem;
  background: #ffffff;
  .staff {
    position: relative;
    float: left;
    width: 1.44rem;
    height: 0.56rem;
    line-height: 0.57rem;
    border-radius: 0.56rem;
    border: 1px solid #97b0cd;
    color: #111111;
    text-align: center;
    font-size: 0.28rem;
    margin-left: 0.32rem;
    margin-bottom: 0.49rem;
    span {
      width: 80%;
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    &:nth-of-type(4n) {
      margin-right: 0;
    }
    .icon-remove {
      position: absolute;
      right: -0.18rem;
      top: -0.18rem;
      width: 0.36rem;
      height: 0.36rem;
    }
  }
  .bgColor {
    background: #d2e6fd;
  }
  .more {
    position: absolute;
    bottom: 1.4rem;
    width: 100%;
    text-align: center;
    font-size: 0.26rem;
    color: #999999;
    .lc-rt-arrow {
      position: relative;
    }
  }
}

// 按钮组
.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 1.3rem;
  background: #f6f6f7;
  > div {
    margin-top: 0.25rem;
    padding: 0 0.35rem;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    box-sizing: border-box;
    button {
      flex: 1;
      height: 0.76rem;
      line-height: 0.76rem;
      border-radius: 0.1rem;
      border: 1px solid #409eff;
      outline: none;
      &:nth-of-type(1) {
        margin: 0 0.19rem 0 0.08rem;
        color: #409eff;
        background: transparent;
      }
      &:nth-of-type(2) {
        margin: 0 0.08rem 0 0.19rem;
        background: #409eff;
        color: #ffffff;
      }
    }
  }
}
</style>
