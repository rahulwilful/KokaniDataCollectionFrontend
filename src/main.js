/*!

 =========================================================
 * Vue Light Bootstrap Dashboard - v2.1.0 (Bootstrap 4)
 =========================================================

 * Product Page: http://www.creative-tim.com/product/light-bootstrap-dashboard
 * Copyright 2023 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard/blob/master/LICENSE.md)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";

// LightBootstrap plugin
import LightBootstrap from "./light-bootstrap-main";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
  faUserSecret,
  faPencil,
  faTrash,
  faEye,
  faEyeSlash,
  faCheck,
  faXmark,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(
  faUserSecret,
  faPencil,
  faTrash,
  faEye,
  faEyeSlash,
  faCheck,
  faXmark,
  faHeart
);

// router setup
import routes from "./routes/routes";

import "./registerServiceWorker";
import JwPagination from "jw-vue-pagination";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import { BSpinner } from "bootstrap-vue";

import Pie from "vue-graph/src/components/pie.js";
import Bar from "vue-graph/src/components/bar";

Vue.component(Pie.name, Pie);
Vue.component(Bar.name, Bar);
// plugin setup
Vue.use(VueRouter);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("jw-pagination", JwPagination);
Vue.component("b-spinner", BSpinner);
Vue.use(LightBootstrap);

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

// configure router
const router = new VueRouter({
  mode: "history",
  routes, // short for routes: routes
  linkActiveClass: "nav-item active",
  scrollBehavior: (to) => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(App),
  router,
});
