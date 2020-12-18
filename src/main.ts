import Vue from "vue";
import App from "./App.vue";
//import vuetify from "./plugins/vuetify";

import { LMap, LTileLayer, LMarker } from "vue2-leaflet";

import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";

Vue.config.productionTip = false;

Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);

new Vue({
  render: (h) => h(App)
}).$mount("#app");
