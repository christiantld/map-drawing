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
      <div v-for="(item, index) in areas" :key="index">
        <p>{{ item }}</p>
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
      layers: [
        {
          id: 0,
          name: "Restaurants",
          active: false,
          features: [
            {
              id: 0,
              name: "Bogart's Smokehouse",
              type: "marker",
              coords: [38.6109607, -90.2050322],
            },
            {
              id: 1,
              name: "Pappy's Smokehouse",
              type: "marker",
              coords: [38.6350008, -90.2261532],
            },
            {
              id: 2,
              name: "Broadway Oyster Bar",
              type: "marker",
              coords: [38.6188362, -90.1947098],
            },
            {
              id: 3,
              name: "Charlie Gitto's On the Hill",
              type: "marker",
              coords: [38.617972, -90.2756436],
            },
            {
              id: 4,
              name: "Sugarfire",
              type: "marker",
              coords: [38.6304077, -90.1916921],
            },
            {
              id: 5,
              name: "The Shaved Duck",
              type: "marker",
              coords: [38.6036282, -90.2381407],
            },
            {
              id: 6,
              name: "Mango Restaurant",
              type: "marker",
              coords: [38.6313642, -90.1961267],
            },
            {
              id: 7,
              name: "Zia's Restaurant",
              type: "marker",
              coords: [38.6157376, -90.27716],
            },
            {
              id: 8,
              name: "Anthonio's Taverna",
              type: "marker",
              coords: [38.6143846, -90.280048],
            },
          ],
        },
        {
          id: 1,
          name: "City/County Boundaries",
          active: false,
          features: [
            {
              id: 0,
              name: "City of St. Louis",
              type: "polygon",
              coords: [
                [38.770547, -90.168056],
                [38.753816, -90.177326],
                [38.74739, -90.183849],
                [38.731456, -90.206337],
                [38.719805, -90.212002],
                [38.706142, -90.210629],
                [38.692879, -90.202217],
                [38.68015, -90.189857],
                [38.665139, -90.182991],
                [38.646774, -90.179729],
                [38.630818, -90.179214],
                [38.615663, -90.183849],
                [38.601713, -90.190201],
                [38.587759, -90.20462],
                [38.577427, -90.219212],
                [38.56414, -90.232258],
                [38.545615, -90.248566],
                [38.53165, -90.257664],
                [38.538901, -90.270023],
                [38.548702, -90.273113],
                [38.561053, -90.294399],
                [38.574072, -90.309334],
                [38.596346, -90.32032],
                [38.614054, -90.314827],
                [38.632159, -90.304527],
                [38.651198, -90.302296],
                [38.664067, -90.293713],
                [38.683768, -90.278263],
                [38.70065, -90.265388],
                [38.717662, -90.253887],
                [38.722349, -90.238266],
                [38.729715, -90.221272],
                [38.742302, -90.203934],
                [38.754886, -90.191746],
                [38.764792, -90.184021],
                [38.77135, -90.183334],
              ],
            },
            {
              id: 1,
              name: "St. Louis County",
              type: "polygon",
              coords: [
                [38.771216, -90.169601],
                [38.78674, -90.144196],
                [38.799049, -90.124283],
                [38.813496, -90.11879],
                [38.82901, -90.141449],
                [38.827405, -90.170975],
                [38.821521, -90.186081],
                [38.824731, -90.20462],
                [38.850938, -90.257492],
                [38.863771, -90.271912],
                [38.888361, -90.294571],
                [38.892102, -90.32753],
                [38.873929, -90.343323],
                [38.856285, -90.342636],
                [38.833289, -90.352936],
                [38.821521, -90.374908],
                [38.82794, -90.413361],
                [38.828475, -90.441513],
                [38.788345, -90.477905],
                [38.763186, -90.484772],
                [38.740695, -90.510178],
                [38.726233, -90.535583],
                [38.705339, -90.532837],
                [38.686046, -90.53833],
                [38.679614, -90.587769],
                [38.682294, -90.606308],
                [38.679614, -90.617981],
                [38.683902, -90.64682],
                [38.684438, -90.661926],
                [38.672645, -90.676346],
                [38.658169, -90.683899],
                [38.645299, -90.704498],
                [38.640473, -90.731277],
                [38.468106, -90.735397],
                [38.481545, -90.726471],
                [38.477782, -90.717545],
                [38.471331, -90.712738],
                [38.471869, -90.696945],
                [38.463267, -90.692139],
                [38.453051, -90.684586],
                [38.44606, -90.683899],
                [38.446598, -90.669479],
                [38.454126, -90.65506],
                [38.466493, -90.65918],
                [38.48047, -90.65918],
                [38.488532, -90.650253],
                [38.483695, -90.633087],
                [38.474557, -90.624161],
                [38.472406, -90.611115],
                [38.485845, -90.598755],
                [38.502505, -90.592575],
                [38.503042, -90.407181],
                [38.492294, -90.406494],
                [38.484232, -90.409241],
                [38.47832, -90.416107],
                [38.472406, -90.422287],
                [38.465418, -90.422287],
                [38.454664, -90.413361],
                [38.454664, -90.401688],
                [38.458428, -90.392761],
                [38.4509, -90.390015],
                [38.452513, -90.374908],
                [38.457353, -90.348129],
                [38.451438, -90.33783],
                [38.439069, -90.340576],
                [38.428849, -90.346069],
                [38.418628, -90.347443],
                [38.408406, -90.347443],
                [38.396568, -90.345383],
                [38.391186, -90.336456],
                [38.414862, -90.311737],
                [38.424546, -90.293198],
                [38.453051, -90.282898],
                [38.492832, -90.273972],
                [38.510565, -90.268135],
                [38.531516, -90.258522],
                [38.537693, -90.270538],
                [38.544138, -90.272598],
                [38.55273, -90.272598],
                [38.55971, -90.293541],
                [38.568032, -90.304871],
                [38.577695, -90.31105],
                [38.586552, -90.314827],
                [38.597285, -90.319977],
                [38.609896, -90.311737],
                [38.635646, -90.305557],
                [38.649321, -90.301437],
                [38.701856, -90.264702],
                [38.714447, -90.255089],
                [38.721144, -90.249939],
                [38.724358, -90.237579],
                [38.727572, -90.227623],
                [38.734536, -90.21492],
                [38.740963, -90.20462],
                [38.747925, -90.198097],
                [38.756225, -90.189514],
                [38.763721, -90.185051],
                [38.771752, -90.184708],
              ],
            },
          ],
        },
      ],
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
      this.map = L.map("map").setView([38.63, -90.23], 10);
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
              color: "#97009c",
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

      this.map.on("draw:created", function (e) {
        const type = e.layerType,
          layer = e.layer;
        console.log(layer.getLatLngs());
        if (type === "marker") {
          layer.bindPopup("A popup!");
        }

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