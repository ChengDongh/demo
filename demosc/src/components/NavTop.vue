<template>
  <div class="header">
    <Breadcrumb>
      <BreadcrumbItem :to="{ path: '/manage' }">首页</BreadcrumbItem>
      <BreadcrumbItem v-for="(item, index) in $route.meta" :key="index">{{item}}</BreadcrumbItem>
    </Breadcrumb>
    <Dropdown @on-click="changeMenu">
      <a href="javascript:void(0)">
        <img
          style="display: block;width: 40px;height: 40px;border-radius: 50%;margin-top: 10px;border: 1px solid #aaa;margin-right: 10px"
          src="../assets/avator.jpg" alt="">
      </a>
      <DropdownMenu slot="list">
        <DropdownItem name="index">首页</DropdownItem>
        <DropdownItem name="out">退出</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  import {get, post} from '../libs/ajax'

  export default {
    name: "NavTop",
    data() {
      return {}
    },
    methods: {
      changeMenu(name) {
        var that = this;
        if (name == 'index') {
          this.$router.push('/manage');
        } else {
          get('/admin/login/out', {},
            function (res) {
              if (res.code == 200) {
                localStorage.removeItem('token');
                that.$router.push({
                  path: '/'
                })
              }
            }
          )
          // $myajax('/admin/login/out','GET' ,{}).then(function (res) {
          //   if(res.code == 200){
          //     localStorage.removeItem('token');
          //     that.$router.push({
          //       path:'/'
          //     })
          //   }
          // })
        }
      },
    }
  }
</script>

<style scoped>
  .header {
    padding: 0 20px;
    height: 60px;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    background-color: #eff2f7;
  }
</style>
