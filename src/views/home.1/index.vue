<template>
    <div id="app">
        <!-- <img src="./images/logo.png" alt="logo" /> -->
        <span>{{msg}}</span>
        <span>{{msg}}</span>
        <span>home1111</span>

    </div>
</template>
<script>
// import Vue from "vue";

export default {
  name: "app",
  components:{

  },
  data() {
    return {
      msg: "hello vue ssss!!"
    };
  },
  methods:{
    wxcButtonClicked(){
      alert(1)
    }
  }
};
</script>
<style>
.test {
  color: #020202;
}
#app {
}
img {
  width: 100px;
}
</style>