<template>
  <div>
    <div class="content">
      <Form :model="formItem" ref="formValidate" :rules="ruleValidate" :label-width="120">
        <Row>
          <Col span="6">
            <FormItem label="标题" prop="title">
              <Input v-model="formItem.title"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <FormItem label="优先级" prop="priority">
              <Input v-model="formItem.priority"></Input>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="跳转商品id" prop="path">
              <Input v-model="formItem.path"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="5">
            <FormItem label="开始时间" prop="start">
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" :value="formItem.start" @on-change="startDate" placeholder="开始时间" style="width: 200px"></DatePicker>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="结束时间" prop="end">
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" :value="formItem.end" @on-change="endDate" placeholder="结束时间" style="width: 200px"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="4" style="width: 236px">
            <FormItem label="轮播图">
              <Upload
                ref="upload"
                :show-upload-list="false"
                name="img"
                multiple
                :format="['jpg','jpeg','png']"
                :before-upload="handleBeforeUpload"
                :on-success="bannerSuccess"
                type="drag"
                action="https://yiapi.qiqiangkeji.com/upload">
                <Button icon="ios-cloud-upload-outline">Upload files</Button>
              </Upload>
            </FormItem>
          </Col>
        </Row>
        <Row style="margin-bottom: 20px">
          <Col span="10" style="margin-left: 120px">
            <div style="width: 170px">
              <img v-if="formItem.image"
                   style="width: 240px;height: 80px;border: 1px solid #aaa;display: block"
                   :src="formItem.image" alt="">
            </div>
          </Col>
        </Row>
        <FormItem>
          <Button type="primary" @click="submit('formValidate')">提交</Button>
        </FormItem>

      </Form>
    </div>
  </div>
</template>

<script>
  import {get,post} from "../libs/ajax";

  export default {
    name: "addbanner",
    data(){
      return{
        formItem:{
          title:"",
          priority:'',
          path:'',
          start:'',
          end:'',
          image:'999',
          id:'',
          target:'',
        },
        ruleValidate: {
          title: [
            { required: true, message: '商品名不能为空', trigger: 'blur' }
          ],
          priority: [
            { required: true, message: '优先级不能为空', trigger: 'blur' }
          ],
          path: [
            { required: true, message: '跳转商品id不能为空', trigger: 'blur' }
          ],
          start: [
            { required: true, message: '开始时间不能为空', trigger: 'blur' }
          ],
          end: [
            { required: true, message: '结束不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    mounted(){
      // if(this.$route.query){
        this.formItem.id = this.$route.query.id;
        this.formItem.image = this.$route.query.pic;
        this.formItem.start = this.$route.query.beginTime;
        this.formItem.end = this.$route.query.endTime;
        this.formItem.priority = this.$route.query.sortOrder;
        this.formItem.path = this.$route.query.targetId;
        this.formItem.title = this.$route.query.title;
      // }

        // this.loadData();
    },
    methods:{
      loadData(){

      },
      startDate(date){
        this.formItem.start = date;
      },
      endDate(date){
        this.formItem.end = date
      },
      bannerSuccess(res){
        if (res.code == 0) {
          this.formItem.image = res.data.url;
        } else {
          this.$Message.info('图片上传失败，请重新上传');
        }
      },
      handleBeforeUpload(file) {
        this.formItem.image = '';
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          const file = reader.result
          return file
        }
      },
      submit(name){
        var that = this;
        that.$refs[name].validate((valid) => {
          if (valid) {
            if(that.formItem.image == undefined){
              that.$Message.info('banner图不能为空');
              return false;
            }
            var data = {
              id:that.formItem.id,
              beginTime:Date.parse(that.formItem.start),
              endTime:Date.parse(that.formItem.end),
              pic:that.formItem.image,
              sortOrder:that.formItem.priority,
              target:that.formItem.target,
              targetId:Number(that.formItem.path),
              title:that.formItem. title
            }
            post('/banner/add',data,function (res) {
              if(res.code == 200){
                that.$Message.info(res.msg);
                that.$router.push({
                  path:'/bannerList'
                })
              }else {
                that.$Message.info(res.msg)
              }
            })
          } else {
            that.$Message.error('Fail!');
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
