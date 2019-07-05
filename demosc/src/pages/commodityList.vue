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
          <Button type="primary" size="small" style="margin-right: 5px" @click="show(row,index)">编辑</Button>
          <Button type="primary" size="small" @click="upState(row,'onShelve')">{{row.onshelve == 2?"上架":'下架'}}</Button>
          <Button type="primary" size="small" style="margin-right: 5px" @click="upState(row,'delete')">删除</Button>
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
    name: "commodityList",
    data() {
      return {
        table: {
          send: {
            keyWoed: ''
          },
          columns: [
            {
              title: 'ID',
              key: 'id'
            },
            {
              title: '商品名称',
              key: 'title'
            },
            {
              title: '图片',
              key: 'image',
              render: (h, params) => {
                return h('div', {
                    style:{
                      paddingTop:'5px'
                    }
                }, [
                  h('img', {
                    attrs: {
                      src: params.row.image
                    },
                    style: {
                      width: '60px',
                      height: '60px'
                    }
                  }),
                ]);
              }
            },
            {
              title: '售价',
              key: 'price',
            },
            {
              title: '原价',
              key: 'prePrice',
            },
            {
              title: '排序',
              key: 'sortOrder',
            },
            {
              title: '操作',
              slot: 'operation',
            }
          ],
          data: [],
          page:1,
          row:10,
          total:0,
          loading:false,
        },
      }
    },
    created(){
      this.table.page = Number(localStorage.getItem('page')) || 1;
      this.table.row = Number(localStorage.getItem('row')) || 1;
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
    mounted(){
      this.loadData()
    },
    methods: {
      search() {
        var that = this;
        that.table.page = 1;
        var data = {
          title:this.table.send.keyWoed,
          page:that.table.page,
          categoryId:'',
        }
        get('/goods/search',data,function (res) {
          if(res.code == 200){

          }else {
            that.$Message.success(res.msg);
          }
        })
      },
      show(row,index){
        this.$router.push({
          path:'/addMerchandise',
          query:{
            id:row.id
          }
        })
      },
      upState(row,type) {
        console.log(row)
        var that = this;
        let status = 0;
        if(type == 'delete'){
          status = 0;
        }else {
          if(row.onShelve == 1){
            status = 2;
          }else {
            status = 1;
          }
        }
        var data ={
          scope:type,
          status:status,
          type:'SPU',
          id:row.id
        };
        post('/goods/deleteOrOnShelveGoods',data,function (res) {
          if(res.code == 200){
            that.loadData();
          }else {
            that.$Message.info(res.msg)
          }
        })
      },
      getPage(page){
        this.table.page = page;
        this.loadData();
      },
      getSize(row){
        this.table.row = row;
        this.loadData();
      },
      loadData(){
        var that = this;
        that.table.loading = true;
        var data = {
          page:that.table.page,
          row:that.table.row
        }
        get('/goods/getAll',data,function (res) {
          if(res.code == 200){
            that.table.loading = false;
            that.table.total = res.data.total;
            that.table.data = res.data.list;
          }else {
            that.$Message.info(res.msg)
          }
        })
      },
    }
  }
</script>

<style scoped>
  .content {
    padding: 30px 20px;
  }
</style>
