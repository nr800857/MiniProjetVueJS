<template>
  <div class="RestaurantDetail">

<div class="md-layout">
      <div class="md-layout-item">
        <h1>{{restaurant.name}} <i class="el-icon-star-on" v-for="i in note" :key="i"></i></h1>
        <h2>{{restaurant.cuisine}}</h2>
        
      </div>
      <div class="md-layout-item"></div>
      <div class="md-layout-item" style="text-align: right;">
        <img src="../assets/heart-icon.png" alt="LIKED" width="30px" @click="supprimerFavoris" v-if="isFavoris">
        <md-button class="md-accent" @click="ajouterFavoris" v-else>Ajouter aux favoris</md-button>
      </div>
    </div>

  <div class="md-layout-item md-layout md-gutter">
        <div class="md-layout-item">
          <img v-bind:src="'https://loremflickr.com/1024/576/food,street,restaurant,cafe&id=' + restaurant._id" alt="photoRestaurant">
        </div>

        <div class="md-layout-item md-size-30">
          <div>
            <h2>{{restaurant.address.building}} {{restaurant.address.street}}<br>{{restaurant.borough}}, {{restaurant.address.zipcode}}</h2>
          </div>
          <div id="map">
            <l-map :center="center" :zoom="13">
              <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            </l-map>
          </div>

        </div>
      </div>
  </div>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer} from "vue2-leaflet";

export default {
  name: 'RestaurantDetails',
  components: {
    LMap,
    LTileLayer,
  
  },
  data: function () {
        return{
          id : this.$route.params.id,
          restaurant: null,
          note : 0,
          zoom: 13,
          center: null,
          url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          mapOptions: {
            zoomSnap: 0.5
          },
          showMap: true,
          favoris : [],
          isFavoris : false
          
        }
    },
  props: {
   
  },
  computed : {
      
  },
  methods : {
    ajouterFavoris() {
      this.favoris.push(this.restaurant._id);
      this.isFavoris = true;
      console.log("Ajout favoris");
      this.saveFavoris();
    },
    supprimerFavoris() {
      this.favoris.splice(this.favoris.indexOf(this.restaurant._id, 1));
      this.isFavoris = false
      console.log("Suppression favoris");
      this.saveFavoris();
    },
    saveFavoris(){
      const parse = JSON.stringify(this.favoris);
      localStorage.setItem('favoris', parse);
      console.log("Sauvegarde des favoris")
    },
    zoomUpdate(zoom) {
    this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {
      alert("Click!");
    }
  },
  mounted() {
        console.log(this.id)

        if(localStorage.getItem("favoris")){
          this.favoris = JSON.parse(localStorage.getItem("favoris"));
          if(this.favoris.indexOf(this.id) >= 0){
            this.isFavoris = true;
          }

        }

        let url = 'http://localhost:8080/api/restaurants/' + this.id;

        fetch(url, {
            method: 'get'
        }).then((response) => {
            response.json().then((res) => {
                this.restaurant = res.restaurant;
                this.note = Math.floor((this.restaurant.grades[0].score * 5)/20)
                this.center = latLng(this.restaurant.address.coord[1],this.restaurant.address.coord[0])
            });
        }).catch(function(err) { 
            console.log(err);
        });

        
      
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.RestaurantDetail {
  text-align: left;
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 5%;
  margin-top: 1%;
}

#map {
  width: 80%;
  height: 300px;
  margin: auto;
}


</style>
