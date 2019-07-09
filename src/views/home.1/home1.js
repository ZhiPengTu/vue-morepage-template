import Vue from "vue";
import App from './index.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
new Vue({
  el:"#app",
  template:'<App/>',
  components:{App}
})