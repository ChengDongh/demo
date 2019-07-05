<template>
  <div class="login_box">
    <div class="from">
      <div style="padding-bottom: 20px;font-size: 18px">后台管理系统</div>
      <Form :model="formItem" :label-width="80">
        <FormItem label="账号:">
          <Input v-model="formItem.userName" placeholder="输入用户名"></Input>
        </FormItem>
        <FormItem label="密码:">
          <Input type="password" v-model="formItem.password" placeholder="输入密码"></Input>
        </FormItem>
        <Button type="primary" @click="submit">登 录</Button>
      </Form>
    </div>
  </div>
</template>

<script>
  import {get,post} from '../libs/ajax'
  // import {hex_md5} from '../libs/md5'
  export default {
    name: "login",
    data() {
      return {
        formItem: {
          userName: '',
          password: ''
        }
      }
    },
    created() {
      var name = localStorage.getItem('username')?localStorage.getItem('username'):"";
      if (name) {
        this.formItem.userName = name
      }
    },
    methods: {
      submit() {
        var that = this;
        that.formItem.userName = that.formItem.userName.trim()
        if (!that.formItem.userName) {
          that.$Message.info('请输入用户名');
          return false
        }
        if (!that.formItem.password) {
          that.$Message.info('请输入密码');
          return false
        }
        var password = that.formItem.password.trim()
        var username = that.formItem.userName
        var data = {
          userName: username,
          password: password
        }
        post('/admin/login',data,
          function (res) {
            if(res.code == 200){
              localStorage.setItem('username', res.data.userName);
              if(res.token){
                localStorage.setItem('token',res.token)
              } else {
                localStorage.setItem('token','')
              }
              that.$router.push({
                path:'/manage'
              })
            }else {
              that.$Message.info(res.msg)
            }
          }
        )
        // post("/admin/login", "POST", data).then(function (res) {
        //   if(res.code == 200){
        //     localStorage.setItem('username', res.data.userName);
        //     if(res.token){
        //       localStorage.setItem('token',res.token)
        //     } else {
        //       localStorage.setItem('token','')
        //     }
        //     that.$router.push({
        //       path:'/manage'
        //     })
        //   }else {
        //     that.$Message.info(res.msg)
        //   }
        // })
      }
    }
  }
</script>

<style scoped>
  .login_box {
    background: white;
    width: 100%;
    height: 100vh;
    /*position: relative;*/
  }

  .from {
    width: 400px;
    height: 400px;
    /*padding: 60px 10px 80px 20px;*/
    padding: 60px 15px;
    background: rgb(255, 255, 255);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.17);
    border: 1px solid #E9E9E9;
    text-align: center;
    margin: 0 auto;
    margin-top: 150px;
    border-radius: 10px;
  }

  .ivu-form-item {
    padding-right: 35px !important;
  }
</style>
