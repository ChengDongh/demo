<template>
  <div>
    <div class="content">
      <Form :model="table.send" :label-width="80">
        <Row>
          <Col span="4">
            <FormItem label="关键字">
              <Input v-model="table.send.keyWoed" placeholder="请输入关键字"></Input>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem>
              <Button type="primary" @click="search">搜索</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Table border :columns="table.columns" :loading="table.loading" :data="table.data">
        <template slot-scope="{ row, index }" slot="operation">
          <Button type="primary" size="small" style="margin-right: 5px" @click="show(row)">编辑</Button>
          <Button type="primary" size="small" @click="deleteBanner(row.id)">删除</Button>
        </template>
      </Table>
      <div style="text-align: right;margin-top: 20px">
        <Page @on-change="getPage" @on-page-size-change="getSize" :current="table.page" :page-size="table.row" :total="table.total" size="small" show-elevator show-total show-sizer />
      </div>
    </div>
  </div>
</template>

<script>
  import {get,post} from '../libs/ajax'

  export default {
    name: "bannerList",
    data() {
      return {
        table: {
          send: {
            keyWoed: ''
          },
          columns: [
            {
              title: '标题',
              key: 'title'
            },
            {
              title: '优先级',
              key: 'sortOrder'
            },
            {
              title: '跳转id',
              key: 'targetId',
            },
            {
              title: '开始时间',
              key: 'beginTime',
              render: (h,params)=>{
                return h('div',
                  this.$moment(params.row.beginTime).format('YYYY-MM-DD HH:mm:ss')
                )
              }
            },
            {
              title: '结束时间',
              key: 'endTime',
              render:(h,params) =>{
                return h('div',
                  this.$moment(params.row.beginTime).format('YYYY-MM-DD HH:mm:ss')
                )
              }
            },
            {
              title: '轮播图图片',
              key: 'img',
              render: (h, params) => {
                return h('div', {
                  style:{
                    paddingTop:'5px'
                  }
                }, [
                  h('img', {
                    attrs: {
                      src: params.row.pic
                    },
                    style: {
                      width: '145px',
                      height: '45px'
                    }
                  }),
                ]);
              }
            },
            {
              title: '操作',
              slot: 'operation',
            }
          ],
          data: [],
          loading:false,
          page:1,
          row:10,
          total:0,
        },
      }
    },
    created(){
      this.table.page = Number(localStorage.getItem('page')) || 1;
      this.table.row = Number(localStorage.getItem('row')) || 1;
      this.loadData();
    },
    beforeUpdate() {
      var that = this;
      localStorage.setItem('page',that.table.page);
      localStorage.setItem('row',that.table.row);
    },
    beforeDestroy() {
      localStorage.setItem('page', '1');
      localStorage.setItem('row', '10');
    },
    methods: {
      search() {
        // var data = {
        //   keyWoed:this.table.send.keyWoed
        // }
        // post('/login',data,function (res) {
        //   if(res.code == 200){
        //
        //   }else {
        //     this.$Message.success('This is a success tip');
        //   }
        // })
      },
      getPage(page){
        this.table.page = page;
        this.loadData();
      },
      getSize(size){
        this.table.row = size;
        this.loadData();
      },
      loadData(){
        var that = this;
        that.table.loading = true
        var data = {
          page:that.table.page,
          row:that.table.row
        }
        get('/banner/getAll',data,function (res) {
          if(res.code == 200){
            that.table.loading = false;
            that.table.total = res.data.total;
            that.table.data = res.data.list;
          }else {
            that.$Message.info(res.msg)
          }
        })
      },
      show(row){
        console.log(row.endTime)
        this.$router.push({
          path:'/addBanner',
          query:{
            id:row.id,
            pic:row.pic,
            beginTime:this.$moment(row.beginTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime:this.$moment(row.endTime).format('YYYY-MM-DD HH:mm:ss'),
            sortOrder:row.sortOrder,
            targetId:row.targetId,
            title:row.title,
          }
        })
      },
      deleteBanner(id) {
        var that = this;
        get('/banner/delete',{bannerId:id},function (res) {
          if(res.code == 200){
            that.$Message.info(res.msg);
            that.loadData();
          }
        })
      }
    }
  }
</script>

<style scoped>
  .content {
    padding: 30px 20px;
  }
</style>
