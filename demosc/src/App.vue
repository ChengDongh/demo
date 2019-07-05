<template>
    <div id="app">
      <router-view/>
    </div>
</template>

<script>

  export default {
  name: 'App',
  watch:{
    '$route':'change_path'
  },

  methods:{
    change_path(){
      var adminId = localStorage.getItem('token')?localStorage.getItem('token'):'';
      if(adminId == ''){
        this.$router.push({
          path:'/'
        })
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
