<template>
  <div>
    <div class="content">
      <Form style="margin-bottom: 20px" :model="table.send" :label-width="80">
        <Row>
          <Col span="4">
            <FormItem label="单号">
              <Input v-model="table.send.orderNum" placeholder="请输入单号"></Input>
            </FormItem>
          </Col>
          <!--<Col span="4">-->
            <!--<FormItem label="关键字">-->
              <!--<Input v-model="table.send.keyWoed" placeholder="请输入关键字"></Input>-->
            <!--</FormItem>-->
          <!--</Col>-->
          <Col span="3">
            <FormItem label="状态">
              <Select v-model="table.send.state" @on-change="statusChange">
                <Option v-for="item in table.send.cityList" :value="item.value" :key="item.value">{{ item.label }}
                </Option>
              </Select>
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
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px;" @click="deliver(row.addressId,row.orderNum)">
            发货
          </Button>
          <!--<Button type="error" size="small">发货</Button>-->
        </template>
      </Table>
      <div style="text-align: right;margin-top: 20px">
        <Page @on-change="getPage" @on-page-size-change="getSize" :current="table.page" :page-size="table.row"
              :total="table.total" size="small" show-elevator show-total show-sizer/>
      </div>
    </div>
    <Modal
      title="发货"
      v-model="deliverShow"
      :mask-closable="false"
      :loading="loading"
      @on-ok="addDeliver"
      @on-cancel="cancel">
      <Row style="margin-bottom: 20px">
        <Col span="20" style="display: flex">
          <label style="width: 100px;line-height: 32px">快递公司:</label>
          <Select v-model="table.expressId" style="width:150px">
            <Option v-for="(item,index) in table.expressList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <Row style="margin-bottom: 20px">
        <Col span="20" style="display: flex">
          <label style="width: 100px;line-height: 32px">订单号:</label>
          <Input disabled v-model="table.orderNum" style="width: 270px"></Input>
        </Col>
      </Row>
      <Row style="margin-bottom: 20px">
        <Col span="20" style="display: flex">
          <label style="width: 100px;line-height: 32px">地址:</label>
          <div style="display: inline-block;line-height: 32px">
            <span>{{table.province}}{{table.city}}{{table.localhost}}</span>
          </div>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
  import {get, post} from '../libs/ajax'

  export default {
    name: "order",
    data() {
      return {
        table: {
          send: {
            keyWoed: '',
            orderNum: '',
            state:0,
            cityList: [
              {
                value: 0,
                label: '全部'
              },
              {
                value: 1,
                label: '已发货'
              },
              {
                value: 2,
                label: '未发货'
              },
              {
                value: 3,
                label: '已付款'
              },
            ],
          },
          columns: [
            {
              title: '单号',
              key: 'orderNum'
            },
            {
              title: '订单详情',
              key: 'orderDeil',
              width: 550,
              render: (h, params) => {
                return h('div', params.row.orderDeil.map(function (type) {
                  return h('div', {
                    style: {
                      marginTop: '5px'
                    }
                  }, [
                    h('img', {
                      attrs: {
                        src: type.image
                      },
                      class: 'spanImg'
                    }),
                    h('span', {
                      class: 'spanType1'
                    }, type.productName),
                    h('span', {
                      class: 'spanType'
                    }, type.param1),
                    h('span', {
                      class: 'spanType'
                    }, type.param2),
                    h('span', {
                      class: 'spanType'
                    }, type.quantity),
                    h('span', {
                      class: 'spanType'
                    }, type.price)
                  ]);
                }));
              }
            },
            {
              title: '商品数量',
              key: 'inventory'
            },
            {
              title: '订单金额',
              key: 'price'
            },
            {
              title: '创建时间',
              key: 'creatTime',
              render: (h, params) => {
                return h('div',
                  this.$moment(params.row.creatTime).format('YYYY-MM-DD HH:mm:ss')
                )
              }
            },
            {
              title: '状态',
              slot: 'action',
              width: 150,
              align: 'center'
            }
          ],
          data: [],
          page: 1,
          row: 10,
          total: 0,
          expressId: null,
          expressList: [],
          orderNum: null,
          status: '',
          province: '',
          city: '',
          localhost: '',
          loading:false,
        },
        deliverShow: false,
        loading: true,
      }
    },
    created() {
      this.table.page = Number(localStorage.getItem('orderPage')) || 1;
      this.table.row = Number(localStorage.getItem('orderRow')) || 1;
      this.loadData();
    },
    beforeUpdate() {
      var that = this;
      localStorage.setItem('orderPage', that.table.page);
      localStorage.setItem('orderRow', that.table.row);
    },
    beforeDestroy() {
      localStorage.setItem('orderPage', '1');
      localStorage.setItem('orderRow', '10');
    },
    methods: {
      search() {
        var that = this;
        that.table.page = 1;
        if(that.table.send.orderNum == ''){
          that.$Message.info('单号不能为空');
          return false;
        }
        var data = {
          orderNum:that.table.send.orderNum,
          page:that.table.page,
          payNo:'',
        }
        get('/order/search',data,function (res) {
          if(res.code == 200){
            that.table.data = [];
            for (let i in res.data.orderList) {
              let data = {};
              data.addressId = res.data.orderList[i].order.addressId
              data.orderNum = res.data.orderList[i].order.orderNum;
              data.orderDeil = res.data.orderList[i].orderDetails;
              data.price = res.data.orderList[i].order.payPrice;
              data.creatTime = res.data.orderList[i].order.createTime
              let num = 0;
              for (let j in res.data.orderList[i].orderDetails) {
                num += res.data.orderList[i].orderDetails[j].quantity
              }
              data.inventory = num;
              that.table.data.push(data);
            }
          }else {
            that.$Message.info(res.msg)
          }
        })
      },
      statusChange(value){
        this.table.send.state = value;
        this.table.page = 1;
        this.loadData();
      },
      deliver(addressId, orderNum) {
        var that = this;
        that.deliverShow = true;
        that.table.orderNum = orderNum;
        get('/admin/getAddress', {addressId: addressId}, function (res) {
          if (res.code == 200) {
            that.table.province = res.data.province;
            that.table.city = res.data.city;
            that.table.localhost = res.data.localhost;
          }
        })
        get('/express/all', {}, function (res) {
          if (res.code == 200) {
            for (let i in res.data) {
              let data = {};
              data.value = res.data[i].id;
              data.label = res.data[i].title;
              that.table.expressList.push(data)
            }

          }
        })
      },
      addDeliver() {
        var that = this;
        var orderNum = [];
        orderNum.push(that.table.orderNum);
        if (that.table.status == '') {
          that.$Message.info('请选择快递公司');
          setTimeout(() => {
            that.loading = false;
            that.$nextTick(() => {
              that.loading = true;
            });
          }, 1000);
          return false;
        }
        var data = {
          expressId: that.table.expressId,
          orderNum: orderNum,
          status: that.table.status
        }
        post('/order/deliver', data, function (res) {
          if (res.code == 200) {
            that.deliverShow = false;
            that.table.expressList = [];
            that.table.expressId = null;
            that.$Message.info(res.msg)
            that.loadData();
          }
        })
      },
      cancel() {

      },
      getPage(page) {
        this.table.page = page;
        this.loadData();
      },
      getSize(size) {
        this.table.row = size;
        this.loadData();
      },
      loadData() {
        var that = this;
        that.table.loading = true;
        var status;
        if(that.table.send.state == 0){
          status = ''
        }else {
          status = that.table.send.state
        }
        var data = {
          page: that.table.page,
          row: that.table.row,
          status:status,
        }
        get('/order/getAll', data, function (res) {
          if (res.code == 200) {
            that.table.loading = false;
            that.table.data = []
            for (let i in res.data.orderList) {
              let data = {};
              data.addressId = res.data.orderList[i].order.addressId
              data.orderNum = res.data.orderList[i].order.orderNum;
              data.orderDeil = res.data.orderList[i].orderDetails;
              data.price = res.data.orderList[i].order.payPrice;
              data.creatTime = res.data.orderList[i].order.createTime
              let num = 0;
              for (let j in res.data.orderList[i].orderDetails) {
                num += res.data.orderList[i].orderDetails[j].quantity
              }
              data.inventory = num;
              that.table.data.push(data);
            }
          }
        })
      }
    }
  }
</script>

<style>
  .content {
    padding: 30px 20px;
  }

  .spanImg {
    width: 45px;
    height: 45px;
    display: inline-block;
    border: 1px solid #eee;
    margin-left: 10px;
  }

  .spanType {
    display: inline-block;
    overflow: hidden;
    line-height: 45px;
    padding: 0 10px;
    border: 1px solid #eee;
    margin-left: 10px;
  }

  .spanType1 {
    width: 220px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 45px;
    margin-left: 10px;
    border: 1px solid #eee;
    padding: 0 10px;
  }
</style>
