<template>
    <div id="app">
        <!-- <img src="./images/logo.png" alt="logo" /> -->
        <span>{{msg}}</span>
        <p class="test">test tsss</p>
        <p class="test">test tsss</p>
        <span>home</span>
      
    </div>
</template>
<script>
import Vue from "vue";
import "@/asset/css/cascade.css";
export default {
  name: "app",
  components:{

  },
  data() {
    return {
      msg: "hello vue ssss!!"
    };
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