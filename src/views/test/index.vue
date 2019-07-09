<template>
    <div id="app">
        <!-- <img src="./images/logo.png" alt="logo" /> -->
        <span>{{msg}}</span>
        <p class="test">test tsss</p>
        <p class="test">test</p>
        <hello></hello>
        <div class="flex-wrap-row">
          <div class="flex-item">ss</div>
          <div class="flex-item flex-seft">ss</div>
          <div class="flex-item">ss</div>
        </div>
        <div class="flex-wrap-column">
          <div class="flex-item">ss</div>
          <div class="flex-item">ss</div>
        </div>
        <div class="flex-wrap-column">
          <div class="flex-item">ss</div>
          <div class="flex-item">ss</div>
        </div>
        <div class="flex-wrap-column">
          <div class="flex-item">ss</div>
          <div class="flex-item">ss</div>
        </div>
    </div>
</template>
<script>
// import Vue from "vue";
import hello from "./commonents/hellow"
export default {
  name: "app",
  components:{
    hello
  },
  data() {
    return {
      msg: "hello vue ssss!!"
    };
  }
};
</script>
<style scope>
.test {
  color: #020202;
}

.flex-wrap-column{
  /* display: flex; */
  width: 750px;
  height: 100px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.flex-wrap-row{
  width: 750px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  background-color: yellowgreen;
  height: 200px;
}
.flex-seft{
  align-self:flex-end;
}
.flex-item{
  width: 100px;
  height: 100px;
  margin:0;
  font-size: 30px;
  background: red;
}

</style>