<template>
  <div>
    <div style="overflow-y: auto;height: 100vh">
      <div class="content">
        <Form ref="formValidate" :rules="ruleValidate" :model="formItem.productSpu" :label-width="120">
          <Row>
            <Col span="6">
              <FormItem label="商品名称" prop="title">
                <Input v-model="formItem.productSpu.title"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="3">
              <FormItem label="原价" prop="prePrice">
                <Input type="number" v-model="formItem.productSpu.prePrice"></Input>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem label="现价" prop="price">
                <Input type="number" v-model="formItem.productSpu.price"></Input>
              </FormItem>
            </Col>
            <!--<Col span="3">-->
              <!--<FormItem label="上/下架">-->
                <!--<Select v-model="formItem.productSpu.onShelve">-->
                  <!--<Option :value="1">上架</Option>-->
                  <!--<Option :value="2">下架</Option>-->
                <!--</Select>-->
              <!--</FormItem>-->
            <!--</Col>-->
          </Row>
          <Row>
            <Col span="4">
              <FormItem label="排序" prop="sortOrder">
                <Input v-model="formItem.productSpu.sortOrder"></Input>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem label="分类" prop="categoryId">
                <Select @on-change="category" :label-in-value="true" v-model="formItem.productSpu.categoryId">
                  <Option v-for="item in formItem.categoryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem label="描述" prop="spec">
                <Input v-model="formItem.productSpu.spec" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="4">
              <FormItem label="参数一" prop="param1">
                <Input v-model="formItem.productSpu.param1" @on-change="change_type('param1')"></Input>
              </FormItem>
            </Col>
            <Col span="2" style="margin-left: 20px">
              <Button type="primary" @click="type1_show = true">添加</Button>
            </Col>
          </Row>
          <Row style="margin-left: 120px;margin-bottom: 20px">
            <Col span="2" style="margin-right: 10px" v-for="(item,index) in formItem.param1s" :key="index">
              <div style="display: flex">
                <Input style="width: 100px" :value="item.title" disabled></Input>
                <Icon type="ios-trash-outline" @click="delete_type1(index,item.id)" size="24"/>
                <Icon type="ios-construct" @click="type1Box(index)" size="24"/>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span="4">
              <FormItem label="参数二(选填)">
                <Input v-model="formItem.productSpu.param2" @on-change="change_type('param2')"></Input>
              </FormItem>
            </Col>
            <Col span="2" style="margin-left: 20px">
              <Button type="primary" @click="type2Box">添加</Button>
            </Col>
          </Row>
          <Row style="margin-left: 120px;margin-bottom: 20px">
            <Col span="2" style="margin-right: 10px" v-for="(item,index) in formItem.param2s" :key="index">
              <div style="display: flex">
                <Input style="width: 100px" :value="item.title" disabled></Input>
                <Icon type="ios-trash-outline" @click="delete_type2(index,item.id)" size="24"/>
              </div>
            </Col>
          </Row>
          <Table style="margin-bottom: 20px" border :columns="formItem.columns" :data="formItem.sku"></Table>
          <Row>
            <Col span="6" style="width: 256px">
              <FormItem label="方图(300px*300px)" :label-width="140" class="lab labImg">
                <Upload
                  ref="upload"
                  :show-upload-list="false"
                  name="img"
                  multiple
                  :format="['jpg','jpeg','png']"
                  :before-upload="handleBeforeUpload"
                  :on-success="masterSuccess"
                  type="drag"
                  action="https://yiapi.qiqiangkeji.com/upload">
                  <Button icon="ios-cloud-upload-outline">Upload files</Button>
                </Upload>
                <Row style="margin-bottom: 20px">
                  <Col span="10" style="margin-top: 20px">
                    <div style="width: 190px">
                      <img v-if="formItem.productSpu.image"
                           style="width: 80px;height: 80px;border: 1px solid #aaa;display: block"
                           :src="formItem.productSpu.image" alt="">
                    </div>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span="10">
              <FormItem label="产品轮播图" class="lab labImgB">
                <div style="display: flex;justify-content: space-between">
                  <div class="banner">
                    <div v-for="(item,index) in formItem.productSpu.imageBanner" :key="index">
                      <img :src="item" :class="{ active:formItem.currentBanner == index}" @click="moveImg(index,'banner')"
                           alt="">
                    </div>
                  </div>
                  <div class="banner_cont" style="margin-left: 20px">
                    <Upload
                      style="width: 101px"
                      ref="upload"
                      :show-upload-list="false"
                      name="img"
                      multiple
                      :format="['jpg','jpeg','png']"
                      :before-upload="handleBeforeUpload"
                      :on-success="bannerSuccess"
                      type="drag"
                      action="https://yiapi.qiqiangkeji.com/upload">
                      <Button icon="ios-cloud-upload-outline">添加图片</Button>
                    </Upload>
                    <Button icon="ios-arrow-up" @click="zIndexUp('banner')">上移</Button>
                    <Button icon="ios-arrow-down" @click="zIndexDown('banner')">下移</Button>
                    <Button icon="ios-trash-outline" @click="deleteImg('banner')">删除</Button>
                  </div>
                </div>

              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem label="产品图" class="lab labImgX">
                <div style="display: flex;justify-content: space-between">
                  <div class="banner">
                    <div v-for="(item,index) in formItem.productSpu.images" :key="index">
                      <img :src="item" :class="{ active:formItem.currentImg == index}" @click="moveImg(index,'img')" alt="">
                    </div>
                  </div>
                  <div class="banner_cont" style="margin-left: 20px">
                    <Upload
                      style="width: 101px"
                      ref="upload"
                      :show-upload-list="false"
                      name="img"
                      multiple
                      :format="['jpg','jpeg','png']"
                      :before-upload="handleBeforeUpload"
                      :on-success="productSuccess"
                      type="drag"
                      action="https://yiapi.qiqiangkeji.com/upload">
                      <Button icon="ios-cloud-upload-outline">添加图片</Button>
                    </Upload>
                    <Button icon="ios-arrow-up" @click="zIndexUp('img')">上移</Button>
                    <Button icon="ios-arrow-down" @click="zIndexDown('img')">下移</Button>
                    <Button icon="ios-trash-outline" @click="deleteImg('img')">删除</Button>
                  </div>
                </div>
              </FormItem>
            </Col>
          </Row>
          <FormItem>
            <Button type="primary" @click="submit('formValidate')">提交</Button>
          </FormItem>

        </Form>
      </div>
      <Modal
        title="输出参数"
        v-model="type1_show"
        :mask-closable="false"
        :loading="loading"
        @on-ok="addType"
        @on-cancel="cancelType('type1')">
        <Row style="margin-bottom: 20px">
          <Col span="10" style="display: flex">
            <label style="width: 100px;line-height: 32px" for="parameter">参数</label>
            <Input id="parameter" style="width: 170px" v-model="formItem.param1List.title"></Input>
          </Col>
        </Row>
        <Row style="margin-bottom: 20px">
          <Col span="10" style="display: flex">
            <label style="width: 100px;line-height: 32px">上传图片</label>
            <Upload
              ref="upload"
              :show-upload-list="false"
              name="img"
              multiple
              :format="['jpg','jpeg','png']"
              :before-upload="handleBeforeUpload"
              :on-success="handleSuccess"
              type="drag"
              action="https://yiapi.qiqiangkeji.com/upload">
              <Button icon="ios-cloud-upload-outline">Upload files</Button>
            </Upload>
          </Col>
        </Row>
        <Row>
          <Col span="10" style="display: flex">
            <label style="width: 100px;line-height: 32px">图片</label>
            <div style="width: 170px">
              <img v-if="formItem.param1List.image"
                   style="width: 50px;height: 50px;border: 1px solid #aaa;display: block"
                   :src="formItem.param1List.image" alt="">
            </div>
          </Col>
        </Row>
      </Modal>
      <Modal
        title="输出参数"
        v-model="type2_show"
        :mask-closable="false"
        @on-ok="addType2"

        @on-cancel="cancelType('type2')">
        <Row style="margin-bottom: 20px">
          <Col span="10" style="display: flex">
            <label style="width: 100px;line-height: 32px" for="parameter2">参数</label>
            <Input id="parameter2" style="width: 170px" v-model="formItem.param2List.title"></Input>
          </Col>
        </Row>
      </Modal>
      <Modal
        title="Sku参数"
        v-model="skuShow"
        :mask-closable="false"
        @on-ok="addSku">
        <Row style="margin-bottom: 20px">
          <Col span="10" style="display: flex">
            <label style="width: 100px;line-height: 32px">参数一</label>
            <Input style="width: 170px" disabled v-model="formItem.skuTable.param1"></Input>
          </Col>
        </Row>
        <Row style="margin-bottom: 20px">
          <Col span="10" style="display: flex">
            <label style="width: 100px;line-height: 32px">参数二</label>
            <Input style="width: 170px" disabled v-model="formItem.skuTable.param2"></Input>
          </Col>
        </Row>
        <Row style="margin-bottom: 20px">
          <Col span="10" style="display: flex">
            <label style="width: 100px;line-height: 32px">原价</label>
            <Input style="width: 170px" v-model="formItem.skuTable.prePrice"></Input>
          </Col>
        </Row>
        <Row style="margin-bottom: 20px">
          <Col span="10" style="display: flex">
            <label style="width: 100px;line-height: 32px">现价</label>
            <Input style="width: 170px" v-model="formItem.skuTable.price"></Input>
          </Col>
        </Row>
        <Row style="margin-bottom: 20px">
          <Col span="10" style="display: flex">
            <label style="width: 100px;line-height: 32px">库存</label>
            <Input style="width: 170px" v-model="formItem.skuTable.inventory"></Input>
          </Col>
        </Row>
      </Modal>
    </div>
  </div>
</template>

<script>
  import {get,post} from '../libs/ajax'

  export default {
    name: "addMerchandise",
    data() {
      return {
        loading:true,
        formItem: {
          productSpu:{
            id:'',
            bizPrice:0,
            title: '',
            providerId:1,
            sortOrder:'',
            prePrice:'',
            price:'',
            spec:'',
            image:'',
            imageBanner: [],
            createTime:'',
            images: [],
            brandTitle:'',
            limitAmount:'',
            couponPrice:0,
            unit:"",
            category:'',
            categoryId:'',
            recommend:'',
            inventory:'',
            nowNumber:'',
            onShelve:1,
            note:'',
            param1:'',
            param2:'',
            favoriteNumber:'',
            freight:0,
            freightType:0,
            removeFlag:false,
          },
          // zIndex_index_B: null,
          currentBanner: -1,
          // zIndex_index_I: null,
          currentImg: -1,
          param1s: [],
          param1List: {
            title: '',
            image: '',
          },
          param2s: [],
          param2List: {
            title: '',
          },
          columns: [
            {
              title: '参数一',
              key: 'param1',
            },
            {
              title: '参数二',
              key: 'param2',
            },
            {
              title: '原价',
              key: 'prePrice'
            },
            {
              title: '现价',
              key: 'price'
            },
            {
              title: '库存',
              key: 'inventory'
            },
            {
              title: '操作',
              key: 'action',
              width: 200,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.skuShows(params)
                      }
                    }
                  }, '编辑'), h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.skuUp(params,'delete')
                      }
                    }
                  }, '删除'),
                ]);
              }
            }
          ],
          sku: [],
          productBadge: {
            beginTime: "",
            createTime: "",
            endTime: "",
            id: 0,
            spuId: 0,
            title: "",
            updateTime: ""
          },
          skuNum:null,
          skuTable: {
            param1:'',
            param2:'',
            prePrice: '',
            price: '',
            inventory: '',
          },
          categoryList: [

          ],
        },
        type1_show_num:null,
        type1_show: false,
        type2_show: false,
        skuShow:false,
        ruleValidate: {
          title: [
            { required: true, message: '商品名不能为空', trigger: 'blur' }
          ],
          prePrice: [
            { required: true, message: '原价不能为空', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '现价不能为空', trigger: 'blur' }
          ],
          sortOrder: [
            { required: true, message: '排序不能为空', trigger: 'blur' }
          ],
          categoryId: [
            { required: true, message: '分类不能为空', trigger: 'blur' }
          ],
          spec: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          param1: [
            { required: true, message: '参数不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    created() {
      this.formItem.productSpu.id = this.$route.query.id?this.$route.query.id:'';
      if(this.formItem.productSpu.id){
        this.loadData();
      }
      this.getCategory();
    },
    methods: {
      loadData(){
        var that = this;
        get('/goods/details',{spuId:that.formItem.productSpu.id},function (res) {
          if(res.code == 200){
            that.formItem.productSpu.id = res.data.productSpu.id;
            that.formItem.productSpu.title = res.data.productSpu.title;
            that.formItem.productSpu.sortOrder = res.data.productSpu.sortOrder;
            that.formItem.productSpu.prePrice = res.data.productSpu.prePrice;
            that.formItem.productSpu.spec = res.data.productSpu.spec;
            that.formItem.productSpu.price = res.data.productSpu.price;
            that.formItem.productSpu.image = res.data.productSpu.image;
            that.formItem.productSpu.onShelve = res.data.productSpu.onshelve;
            that.formItem.productSpu.param1 = res.data.productSpu.param1;
            that.formItem.productSpu.param2 = res.data.productSpu.param2;
            that.formItem.productSpu.category = res.data.productSpu.category;
            that.formItem.productSpu.categoryId = res.data.productSpu.categoryId;
            that.formItem.param1s = res.data.param1s;
            that.formItem.param2s = res.data.param2s;
            that.formItem.sku = res.data.productSku;
            that.formItem.productSpu.imageBanner = res.data.productSpu.imageBanner.split(',');
            that.formItem.productSpu.images = res.data.productSpu.images.split(',');
            that.formItem.columns[0].title = res.data.productSpu.param1?res.data.productSpu.param1:'参数一';
            that.formItem.columns[1].title = res.data.productSpu.param2?res.data.productSpu.param2:'参数二';
          }else {
            that.$Message.info(res.msg)
          }
        })
      },
      getCategory(){
        var that = this;
        get('/category/getCategory',{},
          function (res) {
            if(res.code == 200){
                  var category = [];
                  for(let i of res.data){
                    category.push({
                      value:i.id,
                      label:i.title
                    })
                  }
                  that.formItem.categoryList = category;
                }else {
                  that.$Message.info(res.msg)
                }
          }
        )
      },
      skuUp(params,type){
        var that = this;
        let status = 0;
        var types = type;
        if(type == 'delete'){
          status = 0;
        }else {
          if(params.row.onShelve == 1){
            status = 2;
          }else {
            status = 1;
          }
        }
        if(params.row.id){
          var data ={
            scope:type,
            status:status,
            type:'SKU',
            id:params.row.id
          };
          post('/goods/deleteOrOnShelveGoods',data,function (res) {
            if(res.code == 200){
              if(types == 'delete'){
                that.loadData();
              }
            }else {
              that.$Message.info(res.msg)
            }
          })
        }else {
          that.formItem.sku.splice(params.row._index,1);
          var param2Num = that.formItem.sku.map(function (item) {
            return item.param2
          }).indexOf(params.row.param2)
          var param1Num = that.formItem.sku.map(function (item) {
            return item.param1
          }).indexOf(params.row.param1)
          if(param1Num == -1){
            for(let i in that.formItem.param1s){
              if(that.formItem.param1s[i].title == params.row.param1){
                that.formItem.param1s.splice(i,1)
              }
            }
          }
          if(param2Num == -1){
            for(let i in that.formItem.param2s){
              if(that.formItem.param2s[i].title == params.row.param2){
                that.formItem.param2s.splice(i,1)
              }
            }
          }
        }
      },
      submit(name){
        var that = this;
        that.$refs[name].validate((valid) => {
          if (valid) {
            if(that.formItem.productSpu.spec.trim() == ''){
              that.$Message.info('描述不能为空');
              return false;
            }else if(that.formItem.sku.length<=0){
              that.$Message.info('sku不能为空');
              return false;
            }else if(that.formItem.sku.length>0){
              for(let i in that.formItem.sku){
                if(that.formItem.productSpu.param1 !='' && that.formItem.sku[i].param1 ==''){
                  that.$Message.info('参数一不能为空');
                  return false;
                }else if(that.formItem.productSpu.param2 !='' && that.formItem.sku[i].param2 ==''){
                  that.$Message.info('参数二不能为空');
                  return false;
                }else if(that.formItem.sku[i].prePrice == ''){
                  that.$Message.info('原价不能为空');
                  return false;
                }else if(that.formItem.sku[i].price == ''){
                  that.$Message.info('现价不能为空');
                  return false;
                }else if(that.formItem.sku[i].inventory == ''){
                  that.$Message.info('库存不能为空');
                  return false;
                }
              }
            }else if(that.formItem.productSpu.param1.trim() == ''){
              that.$Message.info('参数一不能为空');
              return false;
            }else if(that.formItem.productSpu.image.trim() == ''){
              that.$Message.info('主图不能为空');
              return false;
            }else if(that.formItem.productSpu.imageBanner.length<=0){
              that.$Message.info('banner图不能为空');
              return false;
            }else if(that.formItem.productSpu.images.length<=0){
              this.$Message.info('详情图不能为空');
              return false;
            }
            var imageBanner = '';
            var images = '';
            for(let i in that.formItem.productSpu.images){
              imageBanner += that.formItem.productSpu.imageBanner[i] + ','
            }
            for(let i in that.formItem.productSpu.images){
              images += that.formItem.productSpu.images[i] + ','
            }
            imageBanner = imageBanner.substr(0, imageBanner.length - 1);
            images = images.substr(0, images.length - 1);
            that.formItem.productSpu.imageBanner = imageBanner;
            that.formItem.productSpu.images = images;
            var data = {
              productSpu:that.formItem.productSpu,
              skuList:that.formItem.sku,
              param1s:that.formItem.param1s,
              param2s:that.formItem.param2s,
              productBadge:that.formItem.productBadge,
            };
            console.log(JSON.stringify(data))
            post('/goods/addOrUpdataGoods',data,
              function (res) {
                that.formItem.productSpu.imageBanner = [];
                that.formItem.productSpu.images = [];
                if(res.code == 200){
                  that.$router.push({
                    path:'/commodityList'
                  })
                }else {
                  that.$Message.info(res.msg)
                }
              }
            )
          } else {
            that.$Message.error('Fail!');
          }
        })

      },
      category(val){
        this.formItem.productSpu.category = val.label;
      },
      change_type(type) {
        for (let i in this.formItem.columns) {
          if (this.formItem.columns[i].key == type) {
            if (type == 'param1') {
              if (this.formItem.productSpu.param1 != '') {
                this.formItem.columns[i].title = this.formItem.productSpu.param1
              } else {
                this.formItem.columns[i].title = '参数一'
              }
            } else {
              if (this.formItem.productSpu.param2 != '') {
                this.formItem.columns[i].title = this.formItem.productSpu.param2
              } else {
                this.formItem.columns[i].title = '参数二'
              }
            }
          } else {
          }
        }
      },
      type1Box(index) {
        this.type1_show = true;
        this.type1_show_num = index;
        this.formItem.param1List.image = this.formItem.param1s[index].image;
        this.formItem.param1List.title = this.formItem.param1s[index].title;
      },
      // moveBanner(index) {
      //   this.formItem.currentBanner = index;
      //   this.formItem.zIndex_index_B = index;
      // },
      moveImg(index,type) {
        if(type=='banner'){
          this.formItem.currentBanner = index;
        }else {
          this.formItem.currentImg = index;
        }
      },
      //下移
      zIndexDown(type) {
        let i;
        if (type == 'banner') {
          i = this.formItem.currentBanner;
          if(i == -1){
            return;
          }
          if(i != (this.formItem.productSpu.imageBanner.length-1)){
            var t = this.formItem.productSpu.imageBanner[i + 1]
            this.$set(this.formItem.productSpu.imageBanner,i + 1,this.formItem.productSpu.imageBanner[i])
            this.$set(this.formItem.productSpu.imageBanner,i,t)
            this.formItem.currentBanner = i + 1
          }
          // if (this.formItem.zIndex_index_B + 1 != this.formItem.productSpu.imageBanner.length && this.formItem.productSpu.imageBanner.length > 0) {
          //   this.formItem.productSpu.imageBanner[this.formItem.zIndex_index_B] = this.formItem.productSpu.imageBanner.splice(this.formItem.zIndex_index_B + 1, 1, this.formItem.productSpu.imageBanner[this.formItem.zIndex_index_B])[0];
          //   this.formItem.zIndex_index_B = this.formItem.zIndex_index_B + 1
          //   this.formItem.currentBanner = this.formItem.zIndex_index_B;
          // }
        } else {
          i = this.formItem.currentImg;
          if(i == -1){
            return;
          }
          if(i != (this.formItem.productSpu.images.length-1)){
            var t = this.formItem.productSpu.images[i + 1]
            this.$set(this.formItem.productSpu.images,i + 1,this.formItem.productSpu.images[i])
            this.$set(this.formItem.productSpu.images,i,t)
            this.formItem.currentImg = i + 1
          }
          // if (this.formItem.zIndex_index_I + 1 != this.formItem.productSpu.images.length && this.formItem.productSpu.images.length > 0) {
          //   this.formItem.productSpu.images[this.formItem.zIndex_index_I] = this.formItem.productSpu.images.splice(this.formItem.zIndex_index_I + 1, 1, this.formItem.productSpu.images[this.formItem.zIndex_index_I])[0];
          //   this.formItem.zIndex_index_I = this.formItem.zIndex_index_I + 1
          //   this.formItem.currentImg = this.formItem.zIndex_index_I;
          // }
        }
      },
      //上移
      zIndexUp(type) {
        let i;
        if (type == 'banner') {
          i = this.formItem.currentBanner;
          if(i != 0){
            var t = this.formItem.productSpu.imageBanner[i - 1]
            this.$set(this.formItem.productSpu.imageBanner,i - 1,this.formItem.productSpu.imageBanner[i])
            this.$set(this.formItem.productSpu.imageBanner,i,t)
            this.formItem.currentBanner = i - 1
          }
          // if (this.formItem.zIndex_index_B != 0) {
          //   this.formItem.productSpu.imageBanner[this.formItem.zIndex_index_B] = this.formItem.productSpu.imageBanner.splice(this.formItem.zIndex_index_B - 1, 1, this.formItem.productSpu.imageBanner[this.formItem.zIndex_index_B])[0];
          //   this.formItem.zIndex_index_B = this.formItem.zIndex_index_B - 1
          //   this.formItem.currentBanner = this.formItem.zIndex_index_B;
          // }
        } else {
          i = this.formItem.currentImg;
          if(i != 0){
            var t = this.formItem.productSpu.images[i - 1]
            this.$set(this.formItem.productSpu.images,i - 1,this.formItem.productSpu.images[i])
            this.$set(this.formItem.productSpu.images,i,t)
            this.formItem.currentImg = i - 1
          }
          // if (this.formItem.zIndex_index_I != 0) {
          //   this.formItem.productSpu.images[this.formItem.zIndex_index_I] = this.formItem.productSpu.images.splice(this.formItem.zIndex_index_I - 1, 1, this.formItem.productSpu.images[this.formItem.zIndex_index_I])[0];
          //   this.formItem.zIndex_index_I = this.formItem.zIndex_index_I - 1
          //   this.formItem.currentImg = this.formItem.zIndex_index_I;
          // }
        }
      },
      deleteImg(type) {
        if (type == 'banner') {
          this.formItem.productSpu.imageBanner.splice(this.formItem.currentBanner, 1);
          this.formItem.currentBanner = -1;
        } else {
          this.formItem.productSpu.images.splice(this.formItem.currentImg, 1);
          this.formItem.currentImg = -1;
        }
      },
      //  上传图片
      handleSuccess(res) {
        if (res.code == 0) {
          this.formItem.param1List.image = res.data.url
        } else {
          this.$Message.info('图片上传失败，请重新上传');
        }
      },
      masterSuccess(res){
        if (res.code == 0) {
          this.formItem.productSpu.image = res.data.url;
        } else {
          this.$Message.info('图片上传失败，请重新上传');
        }
      },
      productSuccess(res){
        if (res.code == 0) {
          this.formItem.productSpu.images.push(res.data.url);
        } else {
          this.$Message.info('图片上传失败，请重新上传');
        }
      },
      bannerSuccess(res){
        if (res.code == 0) {
          this.formItem.productSpu.imageBanner.push(res.data.url);
        } else {
          this.$Message.info('图片上传失败，请重新上传');
        }
      },
      handleBeforeUpload(file) {
        this.formItem.param1List.image = '';
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          const file = reader.result
          return file
        }
      },
      //  添加参数一
      addType() {
        var that = this;
        if(that.formItem.productSpu.param1 == ''){
          that.$Message.info('请填写参数一');
          return false;
        }
        var param1List = {};
        param1List.title = that.formItem.param1List.title;
        param1List.image = that.formItem.param1List.image;
        if(param1List.title == '' || param1List.image == ''){
          that.$Message.info('请输入参数或上传图片');
          setTimeout(() => {
            that.loading = false;
            that.$nextTick(() => {
              that.loading = true;
            });
          }, 1000);
          return false;
        }
        if(that.type1_show_num !=null){
          that.formItem.param1s[that.type1_show_num] = param1List;
        }else {
          if(that.formItem.param1s.length == 0){
            that.formItem.param1s.push(param1List);
          }else {
            var tap = 0;
            for(var i=0;i< this.formItem.param1s.length;i++){
              if(that.formItem.param1s[i].title == param1List.title){
                tap = 1;
                break;
              }
            }
            if(tap == 1){
              that.$Message.info('参数重复');
            }else {
              that.formItem.param1s.push(param1List);
            }
          }
          that.typeTable();
        }
        this.type1_show_num = null;
        this.formItem.param1List.title = '';
        this.formItem.param1List.image = '';
        param1List = {}
        that.type1_show = false;
      },
      //添加参数二
      addType2() {
        if(this.formItem.productSpu.param2 == ''){
          this.$Message.info('请填写参数二');
          return false;
        }
        var param2List = {};
        param2List.title = this.formItem.param2List.title;
        if(this.formItem.param2s.length>0){
          let tap =0;
          for(let i in this.formItem.param2s){
            if(this.formItem.param2s[i].title == param2List.title){
              tap = 1;
              break;
            }
          }
          if(tap == 1){
            this.$Message.info('参数重复');
            return false;
          }else {
            this.formItem.param2s.push(param2List);
          }
        }else {
          this.formItem.param2s.push(param2List);
        }
        this.typeTable()
        this.formItem.param2List.title = '';
      },
      //sku展示
      typeTable() {
        let skus = this.formItem.sku;
        this.formItem.sku = [];
        for (let i of this.formItem.param1s) {
          if (this.formItem.param2s.length > 0) {
            for (let j of this.formItem.param2s) {
              this.formItem.sku.push({
                param1: i.title,
                param2: j.title,
                prePrice: '',
                price: '',
                inventory: '',
              })
            }
          } else {
            this.formItem.sku.push({
              param1: i.title,
              param2: '',
              prePrice: '',
              price: '',
              inventory: '',
            })
          }
        }
        for(let k of skus){
          for(let i of this.formItem.sku){
            if(k.param1 == i.param1){
              if(!k.param2 || k.param2 == i.param2 || (k.param2 && !i.param2)) {
                i.prePrice = k.prePrice;
                i.price = k.price;
                i.inventory = k.inventory;
              }
            }
          }
        }
      },
      //编辑sku
      skuShows(data) {
        this.skuShow = true;
        this.formItem.skuNum = data.index;
        this.formItem.skuTable.param1 = data.row.param1;
        this.formItem.skuTable.param2 = data.row.param2;
        this.formItem.skuTable.prePrice = data.row.prePrice;
        this.formItem.skuTable.price = data.row.price;
        this.formItem.skuTable.inventory = data.row.inventory;
      },
      addSku(){
        this.formItem.sku[this.formItem.skuNum].prePrice = this.formItem.skuTable.prePrice;
        this.formItem.sku[this.formItem.skuNum].price = this.formItem.skuTable.price;
        this.formItem.sku[this.formItem.skuNum].inventory = this.formItem.skuTable.inventory;
      },
      cancelType(type) {
        if(type == 'type1'){
          this.formItem.param1List.title = '';
          this.formItem.param1List.image = '';
        }else if(type == 'type2'){
          this.formItem.param2List.title = '';
        }
      },
      //删除参数一
      delete_type1(index,id) {
        if(id){
          get('/goods/deleteParam',{id:id,type:'param1'},function (res) {
            if(res){

            }
          })
        }else {
          this.formItem.param1s.splice(index,1);
          if(this.formItem.param1s.length<=0){
            this.formItem.param2s = [];
          }
          this.typeTable();
        }
        if(this.formItem.param1s.length<=0){
          this.formItem.productSpu.param1 = '';
          this.formItem.columns[0].title = '参数一'
        }
      },
      //删除参数二
      delete_type2(index,id){
        if(id){
          get('/goods/deleteParam',{id:id,type:'param2'},function (res) {
            if(res){

            }
          })
        }else {
          this.formItem.param2s.splice(index,1);
          this.typeTable()
        }
        if(this.formItem.param2s.length<=0){
          this.formItem.productSpu.param2 = '';
          this.formItem.columns[1].title = '参数二'
        }
      },
      type2Box() {
        if (this.formItem.param1s.length > 0) {
          this.type2_show = true
        } else {
          this.$Message.info('请先填写参数一');
        }
      },
    }
  }
</script>

<style scoped>
  .content {
    padding: 30px 20px;
  }

  .banner {
    border: 1px solid #aaa;
    height: 500px;
    width: 600px;
    overflow-y: auto;
  }

  .banner img {
    width: 100%;
    display: block;
    padding: 5px 10px;
  }
  .active {
    border: 2px solid red;
  }
  .lab{
    position: relative;
  }
  .labImg:before,.labImgB:before,.labImgX:before{
    margin-right: 4px;
    content: "*";
    font-family: SimSun;
    font-size: 12px;
    color: #f60;
    position: absolute;
  }
  .labImg:before{
    top: 7px;
    left: 15px;
  }
  .labImgB:before{
    top: 7px;
    left: 35px;
  }
  .labImgX:before{
    top: 7px;
    left: 60px;
  }
</style>
