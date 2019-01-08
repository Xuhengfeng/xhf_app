<template>
  <!-- 我的草稿 -->
  <div class="wrap">
    <div ref="mescroll" class="mescroll">
      <div>
        <div class="panel" v-for="(item,index) in allList" :key="index" @touchstart="isMoveFlag=true" @touchend="isMoveFlag=false">
          <div class="content-hd">
            <div class="fl"><img src="@/images/avatar2.png">{{item.createBy}}</div>
            <div class="fr">{{item.createTime | time('yyyy-MM-dd HH:mm:ss')}}<div class="dustbin fr" @click="remove(item)"></div>
            </div>
          </div>
          <div class="content-bd">
            <div class="caption">{{item.noticeName}}</div>
            <p v-html="item.noticeContent"></p>
          </div>
          <div class="content-ft lc-rt-arrow" @click="jumpDetail(item)">
            <div class="fl">查看详情</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 无消息提示 -->
    <template v-if="allList.length===0">
      <div class="no-msg-tip">
        <img :src="msgImg">
        <span>暂无草稿</span>
      </div>
    </template>
  </div>
</template>
<script>
import msgImg from '@/images/msg.png'
import msgIcon from '@/images/msg_icon.png'
export default {
  name: 'DraftListView',
  data () {
    return {
      mescroll: null, // mescroll实例对象
      isMoveFlag: false, // 判断当前滑动
      allList: [],
      msgImg,
      msgIcon,
      // 获取列表的查询参数
      query: {
        pageNum: 1,
        pageSize: 10,
        sortName: null, // 排序
        isAsc: true, // 升序、倒序
        searchText: '',
        sendStatus: 0, // 0草稿 1历史通知
        userId: '', // 用户id
        tenantId: '', // 租户id
        total: 1
      }

    }
  },
  mounted () {
    this.allList = []
    this.initMescroll()
  },
  methods: {
    jumpDetail (item) {
      var params = {
        notReadUserIdList: item.notReadUserIdList,
        readUserIdList: item.readUserIdList,
        id: item.id
      }
      this.$classAjax.post(this.$URL.classNoticeDetail, params).then(res => {
        var arr1 = res.notReadUserList.filter(el => el.userType === 1).map(el => {
          return {
            studentId: el.userId,
            studentName: el.userName,
            phone: el.phone
          }
        })
        var arr2 = res.notReadUserList.filter(el => el.userType === 2).map(el => {
          return {
            parentName: el.userName,
            parentId: el.userId,
            phone: el.phone
          }
        })
        var obj = {
          // 学生
          arr1: arr1,
          arg1: res.notReadUserList.filter(el => el.userType === 1).length,
          // 家长
          arr2: arr2,
          arg2: res.notReadUserList.filter(el => el.userType === 2).length,
          noticeName: res.noticeName,
          noticeContent: res.noticeContent,
          noticeFileList: res.noticeFileList.filter(el => el.fileUuid !== 'audio'),
          id: item.id
        }
        this.$store.dispatch('getDropItem', obj)
        !this.isMoveFlag && this.$router.push('/DraftList/edit')
      })
    },
    remove (item) {
      var arr = []
      arr[0] = item.id
      this.$vux.confirm.show({
        title: '提示',
        content: '确认删除?',
        onConfirm: () => {
          // 防止重复提交
          this.$classAjax.delete(this.$URL.classNoticeDel, arr).then(() => {
            this._toast('删除成功')
            this.allList = []
            this.upCallback({ num: 1 })
          }).finally()
        }
      })
    },
    _toast (text) {
      this.$vux.toast.show({ type: 'text', text })
    },
    // 获取列表
    upCallback (page) {
      this.query.pageNum = page.num
      this.$classAjax.get(this.$URL.classNoticeSendList, this.query).then(res => {
        this.allList = this.allList.concat(res.records)
        this.mescroll.endSuccess(res.total, res.total <= res.size * res.pages)
      })
    },
    initMescroll () {
      this.mescroll = new this.$MeScroll(this.$refs.mescroll, { // 在vue的mounted生命周期初始化mescroll,确保此处配置的ref有值
        down: {
          auto: false,
          isLock: true
        },
        up: {
          auto: true,
          callback: this.upCallback,
          isBounce: false,
          // 以下是一些常用的配置,当然不写也可以的.
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 10, // 每页数据条数
            time: null // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
          },
          loadFull: {
            use: false, // 列表数据过少,不足以滑动触发上拉加载,是否自动加载下一页,直到满屏或者无更多数据为止;默认false,因为可通过调高page.size避免这个情况
            delay: 500 // 延时执行的毫秒数; 延时是为了保证列表数据或占位的图片都已初始化完成,且下拉刷新上拉加载中区域动画已执行完毕;
          },
          htmlNodata: '<p class="upwarp-nodata">亲,没有更多数据了~</p>',
          noMoreSize: 5 // 如果列表已无数据,可设置列表总数大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@xuhengfeng/styles-app/styles/mixin.less";
.wrap {
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
}
.dustbin {
  width: 0.5rem;
  height: 0.7rem;
  background: url("~@/images/dustbin.png") center right no-repeat;
  background-size: 70%;
}
</style>
