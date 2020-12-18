<template>
  <div class="row">
    <div class="col-md-9">
      <div id="map" class="map"></div>
    </div>
    <div class="col-md-3">
      <div class="form-check" v-for="layer in layers" :key="layer.id">
        <label class="form-check-label">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="layer.active"
            @change="layerChanged(layer.id, layer.active)"
          />
          {{ layer.name }}
        </label>
      </div>
      <div v-for="(item, index) in areas" :key="'id' + index">
        <p>Area {{ index }}</p>
        <div v-for="(is, index) in item" :key="'_id' + index">
          <div v-for="(i, index) in is" :key="'_id_' + index">
            <p>Latitude: {{ i.lat }}</p>
            <p>Longitude: {{ i.lng }}</p>
            <br />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import L, { Icon } from "leaflet";
import "leaflet-draw";

export default {
  name: "Map",
  data() {
    return {
      areas: [],
      geolocation: [],
      map: null,
      tileLayer: null,
      drawItems: null,
      drawControl: null,
      layers: [],
    };
  },
  created() {
    this.getUserGeolocation();
  },
  mounted() {
    this.initMap();
    this.initLayers();
    delete Icon.Default.prototype._getIconUrl;
    Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });
  },
  methods: {
    randomColor() {
      return "#" + (((1 << 24) * Math.random()) | 0).toString(16);
    },

    async getUserGeolocation() {
      if (navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition((position) => {
          this.geolocation[0] = position.coords.latitude;
          this.geolocation[1] = position.coords.longitude;
        });
        console.log(this.geolocation);
        return this.geolocation;
      }
      return false;
    },
    async initMap() {
      const center = await [-15.8138368, -47.9920128];
      console.log("center", center);
      this.map = L.map("map").setView(center, 13);
      this.tileLayer = L.tileLayer(
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
        {
          maxZoom: 18,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
        }
      );
      this.tileLayer.addTo(this.map);
      this.drawnItems = new L.FeatureGroup();
      this.map.addLayer(this.drawnItems);
      const drawPluginOptions = {
        position: "topright",
        draw: {
          polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
              color: "#e1e100", // Color the shape will turn when intersects
              message: "<strong>Oh snap!<strong> you can't draw that!", // Message that will show when intersect
            },
            shapeOptions: {
              color: this.randomColor(),
            },
          },
          // disable toolbar item by setting it to false
          polyline: false,
          circle: false, // Turns off this drawing tool
          rectangle: false,
          marker: false,
        },
        edit: {
          featureGroup: this.drawnItems, //REQUIRED!!
          remove: true,
          edit: true,
        },
      };

      this.drawControl = new L.Control.Draw(drawPluginOptions);
      this.map.addControl(this.drawControl);

      const editableLayers = new L.FeatureGroup();
      this.map.addLayer(editableLayers);
      //const vm = this;

      this.map.on("draw:created", (e) => {
        const layer = e.layer;
        const coords = layer.getLatLngs();
        this.areas = [...this.areas, coords];

        this.drawnItems.addLayer(layer);
        editableLayers.addLayer(layer);
      });
    },

    initLayers() {
      this.layers.forEach((layer) => {
        const markerFeatures = layer.features.filter(
          (feature) => feature.type === "marker"
        );
        const polygonFeatures = layer.features.filter(
          (feature) => feature.type === "polygon"
        );

        markerFeatures.forEach((feature) => {
          feature.leafletObject = L.marker(feature.coords).bindPopup(
            feature.name
          );
        });

        polygonFeatures.forEach((feature) => {
          feature.leafletObject = L.polygon(feature.coords).bindPopup(
            feature.name
          );
        });
      });
    },
    layerChanged(layerId, active) {
      const layer = this.layers.find((layer) => layer.id === layerId);
      layer.features.forEach((feature) => {
        if (active) {
          feature.leafletObject.addTo(this.map);
        } else {
          feature.leafletObject.removeFrom(this.map);
        }
      });
    },
  },
};
</script>
<style>
.map {
  height: 600px;
}
</style>