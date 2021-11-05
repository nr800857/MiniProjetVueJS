<template>
  <div class="favoris">
    
    

    <div class="md-layout">
        <div class="md-layout-item">
            <p id="titre">Nombre de restaurants : {{nbRestaurantsTotal}}</p>
        </div>
        <div class="md-layout-item">
        </div>
        <div class="md-layout-item">
        </div>
      </div>

      <div id="listeRestaurants">
        <md-table v-model="restaurants" md-sort="nom" md-sort-order="asc" md-card>
        <!--v-on:click="supprimerRestaurant(item)"-->
        <md-table-row slot="md-table-row" slot-scope="{ item }" @click="$router.push('/RestaurantDetails/' + item._id)">
          <md-table-cell md-label="Nom" md-sort-by="name">{{ item.name }}</md-table-cell>
          <md-table-cell md-label="Cuisine">{{ item.cuisine }}</md-table-cell>
          <md-table-cell md-label="Note" md-sort-by="note"><i class="el-icon-star-on" v-for="note in item.note" :key="note"></i></md-table-cell>
          <md-table-cell><img src="../assets/heart-icon.png" alt="LIKED" width="10px"></md-table-cell>
          <md-table-cell> <i class="el-icon-delete" v-on:click="supprimerRestaurant(item)"></i></md-table-cell>
        </md-table-row>
      </md-table>

    </div>
    

  </div>
</template>

<script>
import _ from "lodash"
export default {
  name: 'Favoris',
  data: function () {
        return{
            restaurants: [],
            favoris: [],
            nbRestaurantsTotal: 0,
            nomRechercher: '',
            value: null
        }},
    mounted() {
        this.getRestaurantsFavoris();
    },
    methods: {
        supprimerRestaurant(r) {
            let url = "http://localhost:8080/api/restaurants/" + r._id ;

            fetch(url, {
                method: "DELETE",
            })
            .then((responseJSON) => {
                responseJSON.json()
                    .then((res) => {
                        // Maintenant res est un vrai objet JavaScript
                        console.log(res);
                        this.getRestaurantsFromServer();
                    });
                })
                .catch(function (err) {
                    console.log(err)
            });
        },
        getRestaurantsFromServer(id) {
            let url = 'http://localhost:8080/api/restaurants/' + id;
            
            fetch(url, {
                method: 'get'
            }).then((response) => {
                response.json().then((res) => {
                    this.restaurants.push(res.restaurant);
                    console.log(res.restaurant)
                    this.nbRestaurantsTotal++;
                
                });
            }).catch(function(err) {
                console.log(err);
            });
        },
        getRestaurantsFavoris(){
            if(localStorage.getItem("favoris")){
                this.favoris = JSON.parse(localStorage.getItem("favoris"));
                console.log(this.favoris)
                for(let i = 0; i<this.favoris.length ; i++){
                    this.getRestaurantsFromServer(this.favoris[i]);
                }
            }
        },
        chercherRestaurants:  _.debounce(function(){this.getRestaurantsFromServer();},300)
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

#listeRestaurants{
    width: 80%;
    margin: auto;
}

md-dialog /deep/.md-dialog-container {
    max-width: 768px;
  }

@import url("//unpkg.com/element-ui@2.15.6/lib/theme-chalk/index.css");
</style>
