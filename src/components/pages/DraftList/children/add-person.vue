<template>
  <!-- 添加学生 -->
  <div class="wrapbox">
    <div class="searchBox">
      <Search :placeholder="'请输入学号或姓名'" v-model="searchText"></Search>
    </div>
    <div class="personList">
      <!-- 无消息提示 -->
      <template v-if="tableData.length===0">
        <div class="no-msg-tip">
          <img :src="msgImg">
          <span>暂无学生</span>
        </div>
      </template>
      <ul>
        <li v-for="(item,index) in tableData" :key="index">
          <div @click="clickItem(item)"><input type="checkbox" v-model="item.isSelect"></div>
          <div>{{item.studentCode}}</div>
          <div>{{item.studentName}}</div>
        </li>
      </ul>
    </div>
    <div class="footer groupbtn">
      <div class="allselect" @click="allSelect()">
        <CheckIcon :value="isAllSelect">全选</CheckIcon>
      </div>
      <div class="selectNum">已选{{selectNum}}人</div>
      <div class="confirm" @click="confim()">确定</div>
    </div>
  </div>
</template>
<script>
import { Search, CheckIcon } from 'vux'
import { mapState } from 'vuex'
import msgImg from '@/images/msg.png'
export default {
  components: {
    Search,
    CheckIcon
  },
  data () {
    return {
      msgImg,
      searchText: null,
      selectNum: 0, // 选中的人数
      tableData: [], // 学生列表
      isAllSelect: false, // 是否全选
      tempStudentlist: []
    }
  },
  computed: {
    ...mapState({
      selected: state => state.selected.selected,
      // 选中的学生
      selectStudent: state => state.selectStudent,
      // 学生总人数
      studentListNum: state => state.studentListNum
    })
  },
  watch: {
    searchText: {
      handler (value) {
        this.searchText = value
        this.getStudentList()
      }
    },
    tableData: {
      handler (value) {
        this.selectNum = 0
        this.tableData.forEach(el => {
          if (el.isSelect) {
            // 选中的时候
            this.selectNum += 1
          }
        })
        // 判断是否全选
        this.isAllSelect = this.selectNum === this.tableData.length
      },
      deep: true
    },
    isAllSelect (value) {
      if (!value) {
        this.$store.dispatch('removeStudent')
      } else {
        this.$store.dispatch('getSelectStudent', this.tableData)
      }
    }
  },
  mounted () {
    this.getStudentList()
  },
  methods: {
    clickItem (item) {
      if (!item.isSelect) {
        // 判断是否已经在 临时缓存数组中
        if (this.tempStudentlist.findIndex(el => item.studentId === el.studentId) === -1) {
          this.tempStudentlist.push(item)
        }
      } else {
        // 未选中的时候
        var tagIndex = this.tempStudentlist.findIndex(el => item.studentId === el.studentId)
        this.tempStudentlist.splice(tagIndex, 1)
      }
      this.$store.dispatch('getSelectStudent', this.tempStudentlist)
    },
    // 全选是否打勾
    allSelect () {
      this.isAllSelect = !this.isAllSelect
      if (this.isAllSelect) {
        this.tableData.map(el => {
          return Object.assign(el, { isSelect: true })
        })
      } else {
        this.tableData.map(el => {
          return Object.assign(el, { isSelect: false })
        })
      }
    },
    // 获取学生列表
    getStudentList () {
      // 显示
      this.$classAjax.get(this.$URL.classNoticeListClass).then(res => {
        if (res.length === 0) {
          return this._toast('暂无数据')
        }
        this.currentClass = res[0]
        // 当前班级学生接口参数
        var params = {
          classId: this.currentClass.classId,
          className: this.currentClass.className,
          bindClassStatus: 1,
          searchText: this.searchText
        }
        this.$classAjax.get(this.$URL.classNoticeListStudent, params).then(res => {
          this.$store.dispatch('getStudentNum', res.length)
          // 给每一个对象扩展一个isSelect字段
          this.tableData = res.map(el => Object.assign(el, { isSelect: '' }))
          // 判断缓存临时选中的学生
          if (this.selectStudent && this.tableData) {
            this.selectStudent.forEach(el => {
              var tarIndex = this.tableData.findIndex(item => item.studentId === el.studentId)
              this.tableData[tarIndex].isSelect = true
            })
          }
        })
      })
    },
    // 确定选中
    confim () {
      // 缓存选中的学生
      var selectStudent = this.tableData.filter(el => el.isSelect === true)
      this.$store.dispatch('getSelectStudent', selectStudent)
      this.$router.go(-1)
    },
    _toast (text) {
      this.$vux.toast.show({ type: 'text', text })
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@xuhengfeng/styles-app/styles/mixin.less";
.wrapbox {
  min-height: 100%;
  background: #f6f6f7;
  overflow: auto;
  .searchBox {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
  }
}
// 无数据提示
.no-msg-tip {
  width: 100%;
  height: 70%;
  margin-top: 2rem;
  .flex(column);
  img {
    width: 100px;
    margin-bottom: 15px;
  }
  span {
    color: @color-999;
  }
}
.personList {
  margin: 0.88rem 0 1.15rem;
  ul {
    background: #ffffff;
    li {
      display: flex;
      flex-flow: row nowrap;
      height: 1rem;
      align-items: center;
      border-bottom: 1px solid #f2f2f2;
      div {
        &:nth-of-type(1) {
          position: relative;
          flex: 1.1rem 0 0;
          width: 100%;
          height: 100%;
        }
        &:nth-of-type(2) {
          flex: 2.2rem 0 0;
          text-align: center;
          font-size: 0.3rem;
          color: #111111;
        }
        &:nth-of-type(3) {
          flex: 1;
          font-size: 0.3rem;
          color: #111111;
        }
      }
    }
  }
}
.groupbtn {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 1.15rem;
  line-height: 1.15rem;
  background: #ffffff;
  .allselect {
    float: left;
    padding-left: 0.48rem;
    span {
      font-size: 0.3rem;
      color: #333333;
    }
  }
  .selectNum {
    float: left;
    margin-left: 1.75rem;
    margin-top: 0.35rem;
    font-size: 0.26rem;
    height: 0.6rem;
    line-height: 0.6rem;
    color: #666666;
  }
  .confirm {
    float: right;
    background: #409eff;
    border-radius: 0.1rem;
    width: 1.4rem;
    height: 0.6rem;
    line-height: 0.6rem;
    text-align: center;
    color: #ffffff;
    font-size: 0.3rem;
    margin: 0.35rem 0.35rem 0 0;
  }
}
input[type="checkbox"] {
  position: absolute;
  right: 0.3rem;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 0.34rem;
  height: 0.34rem;
  background: transparent;
  -webkit-appearance: none;
  border: 1px solid #bfbfbf;
  border-radius: 2px;
  outline: none;
}
input[type="checkbox"]:checked {
  border-color: #409eff;
  background: #409eff url("~@/images/5.png") center center;
  background-size: 120% 120%;
}
</style>
