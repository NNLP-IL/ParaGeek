import Vue from 'vue'
import App from './App.vue'

import BootstrapVue from 'bootstrap-vue'
import DownloadData from 'v-download'
import selection from 'vue-text-selection'
import JsonViewer from 'vue-json-viewer'
import svg from 'svg-progress-bar'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import ajax from "vuejs-ajax"
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueSimpleAlert from "vue-simple-alert";

Vue.use(ajax);
Vue.use(BootstrapVue);
Vue.use(DownloadData);
Vue.directive('selection', selection);
Vue.use(JsonViewer);
Vue.use(svg);
Vue.use(VueAxios, axios);
Vue.use(VueSimpleAlert);
Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead)

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    directives: {selection}
}).$mount('#app')


