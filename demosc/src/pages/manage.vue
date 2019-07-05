<template>
  <div>
    <Row>
      <Col span="4">
        <Menu style="height: 100vh" width="auto" @on-open-change="openChange" @on-select="clickName"
              :open-names="openNames" :active-name="activeName" :theme="theme2" accordion>
          <MenuItem name="manage" to="/manage">
            <Icon type="md-menu"/>
            首页
          </MenuItem>
          <Submenu name="CommodityManagement">
            <template slot="title">
              <Icon type="ios-paper"/>
              商品管理
            </template>
            <MenuItem name="commodityList" to="/commodityList">商品列表</MenuItem>
            <MenuItem name="addMerchandise" to="/addMerchandise">添加商品</MenuItem>
          </Submenu>
          <Submenu name="2">
            <template slot="title">
              <Icon type="ios-people"/>
              订单管理
            </template>
            <MenuItem name="order" to="/order">订单列表</MenuItem>
            <MenuItem name="2-2">活跃用户</MenuItem>
          </Submenu>
          <Submenu name="banner">
            <template slot="title">
              <Icon type="ios-people"/>
              banner图管理
            </template>
            <MenuItem name="bannerList" to="/bannerList">banner图列表</MenuItem>
            <MenuItem name="addBanner" to="/addBanner">添加banner图</MenuItem>
          </Submenu>
          <MenuItem name="navigation" to="/navigation">
            <Icon type="md-menu"/>
            导航分类管理
          </MenuItem>
        </Menu>
      </Col>
      <Col span="20">
        <NavTop></NavTop>
        <router-view></router-view>
      </Col>
    </Row>
  </div>
</template>
<script>
  import NavTop from '@/components/NavTop'

  export default {
    components: {
      NavTop
    },
    data() {
      return {
        theme2: 'dark',
        openNames: [],
      }
    },
    computed: {
      activeName: function () {
        return this.$route.path.replace('/', '')
      }
    },
    created() {
      if (localStorage.getItem('submenu')) {
        this.openNames = [];
        var submenu = localStorage.getItem('submenu')
        this.openNames.push(submenu);
      }
    },
    methods: {
      openChange(name) {
        if (name.length > 0) {
          localStorage.setItem('submenu', name);
        }
      },
      clickName(name) {
        if (name == 'manage' || name == 'navigation') {
          localStorage.setItem('submenu', []);
        }
      }
    }
  }
</script>
