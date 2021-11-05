<template>
  <div class="Accueil">

      <div class="recherche">
        <h2 style="margin-bottom: 5%; margin-left: 20%; text-align: left;">Que voulez-vous manger ?</h2>
        <md-field>
          <label>Restaurants</label>
            <md-input @input="chercherRestaurants" type="texte" v-model="nomRechercher"></md-input>
          </md-field>

        <md-table v-model="restaurantsRecherche" v-show="show">
          <md-table-row slot="md-table-row" slot-scope="{ item }" v-on:click="$router.push('/RestaurantDetails/' + item._id)">
            <md-table-cell>{{ item.name }}</md-table-cell>
            <md-table-cell>{{ item.cuisine }}</md-table-cell>
            <md-table-cell><i class="el-icon-star-on" v-for="note in item.grades[0].score" :key="note"></i></md-table-cell>
            <md-table-cell><img src="../assets/heart-icon.png" alt="LIKED" width="10px" v-if="isFavoris(item._id)"></md-table-cell>
          </md-table-row>
        </md-table>

        <p v-show="noResult">Aucun résultat</p>
      </div>

      
      <div class="top3">
        <h2>Les mieux notés!</h2>  
        <md-card v-for="item in restaurantsTop3" :key="item" >
          <router-link :to="'/restaurantDetails/' + item._id">
            <md-card-media-cover md-text-scrim>
                <md-card-media md-ratio="16:9">
                  <img v-bind:src="'https://loremflickr.com/1024/576/food,street,restaurant,cafe&id=' + item._id" alt="Restaurant">
                </md-card-media>
        
                <md-card-area>
                  <md-card-header>
                    <span class="md-title">{{item.name}}</span>
                    <span class="md-subhead">{{item.cuisine}}</span>
                    <span class="md-subhead">{{item.note}} Étoiles</span>
                  </md-card-header>
                </md-card-area>
              </md-card-media-cover>
          </router-link>
            
          </md-card>

      </div>

    <div class="md-layout md-gutter">
    <div class="md-layout-item md-size-20"></div>
    <div class="md-layout-item">
      <md-table v-model="restaurantsAleatoire" md-card>
            <md-table-toolbar>
              <h1 class="md-title">Restaurants aux hasards</h1>
            </md-table-toolbar>
          
            <md-table-row slot="md-table-row" slot-scope="{ item }" @click="$router.push('/RestaurantDetails/' + item._id)">
              <md-table-cell md-label="Nom">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="Cuisine">{{ item.cuisine }}</md-table-cell>
              <md-table-cell md-label="Note" md-sort-by="note"><i class="el-icon-star-on" v-for="note in item.grades[0].score" :key="note"></i></md-table-cell>
              <md-table-cell><img src="../assets/heart-icon.png" alt="LIKED" width="10px" v-if="isFavoris(item._id)"></md-table-cell>
            </md-table-row>
        </md-table>
    </div>
    <div class="md-layout-item md-size-20"></div>
  </div>

  </div>
</template>

<script>
import _ from "lodash"
export default {
  name: 'Accueil',
  data: function () {
        return{
          restaurants: [],
          restaurantsAleatoire: [],
          restaurantsRecherche: [],
          restaurantsTop3: [],
          favoris : [],
          nomRechercher: '',
          show: false,
          noResult : false
        }
    },
  props: {
   
  },
  computed : {
      
  },
  mounted() {
    this.getRestaurantsFromServer();
    if(localStorage.favoris) {
      this.favoris = JSON.parse(localStorage.getItem("cats"));
    }
  },
  methods : {
    getRestaurantsFromServer() {
      let url = 'http://localhost:8080/api/restaurants?';
      url += '&pagesize=1000';
      url += '&name=' + this.nomRechercher;

      fetch(url, {
          method: 'get'
      }).then((response) => {
          response.json().then((res) => {
              this.restaurants = res.data;
              this.restaurants.forEach(element => {
                        element.grades[0].score = Math.floor((element.grades[0].score * 5)/20)
                    });
              this.randomize();
              this.restaurantsAlea();
              this.topRestaurant();
    
          });
      }).catch(function(err) {
          console.log(err);
      });
      
            
    },
    getSearchedRestaurants() {
      this.show = false;
      this.noResult=false;
      
      if(this.nomRechercher == ''){
        this.restaurantsRecherche = [];
      }
      else{
        this.show = true;
        let url = 'http://localhost:8080/api/restaurants?';
        url += 'pagesize=' + 3;
        url += '&name=' + this.nomRechercher;

        fetch(url, {
            method: 'get'
        }).then((response) => {
            response.json().then((res) => {
                this.restaurantsRecherche = res.data;
                this.restaurantsRecherche.forEach(element => {
                        element.grades[0].score = Math.floor((element.grades[0].score * 5)/20)
                    });
                if(res.data.length == 0){
                  this.show = false;
                  this.noResult = true;
                }
                
            });
        }).catch(function(err) {
            console.log(err);
        });
      }
    },
    randomize() {
        for (let i = this.restaurants.length - 1; i > 0; i--) {
          let randomIndex = Math.floor(Math.random() * i)
          let temp = this.restaurants[i]
          this.$set(this.restaurants, i, this.restaurants[randomIndex])
          this.$set(this.restaurants, randomIndex, temp)
          
        }
        
    },
    restaurantsAlea() {
      for(let i = 0; i<10 ; i++) {
        this.restaurantsAleatoire.push(this.restaurants[i]);
      }
    },
    topRestaurant(){
      let i = 0;
      let top = 0;
      while(top<3 && this.restaurants[i] != undefined){
        if(this.restaurants[i].note == 5 || this.restaurants[i].note == 4){
          this.restaurantsTop3.push(this.restaurants[i]);
          top++;
        }
        i++;
      }
    },
    isFavoris(id) {
        if(localStorage.getItem("favoris")){
            let favoris = JSON.parse(localStorage.getItem("favoris"));
            return favoris.indexOf(id) >= 0;
        }
        return false;
    },
    chercherRestaurants:  _.debounce(function(){this.getSearchedRestaurants();},300)
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


.md-field {
    width: 60%;
    margin: auto;
}

.recherche {
    padding-top: 8%;
    padding-bottom: 8%;
    margin: 2%;
    margin-left: 15%;
    margin-right: 15%;
    background-color: white;
    border-radius: 10px;
}

.top3 {
  margin-bottom: 4%;
}

.top3 .md-card {
    width: 25%;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
    border-radius: 20px;
}


</style>
