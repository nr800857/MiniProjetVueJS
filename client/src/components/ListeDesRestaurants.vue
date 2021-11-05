<template>
  <div class="restaurants">
    

    <div class="md-layout">
        <div class="md-layout-item">
            <p id="titre">Nombre de restaurants : {{nbRestaurantsTotal}}</p>
        </div>
        <div class="md-layout-item">
        </div>
        <div class="md-layout-item">
            <p>Rechercher <input @input="chercherRestaurants" type="texte" v-model="nomRechercher"></p>
        </div>
      </div>

      <div id="ajout">
          <p>Ajouter un restaurant</p>
        <form v-on:submit.prevent="ajouterRestaurant">
            <label>
                Nom : <input name="nom" type="text" required v-model="name">
            </label>
            <label>
                Cuisine : <input name="cuisine" type="text" required v-model="cuisine">
            </label>

            <button>Ajouter</button>
        </form>
      </div>
      

    <div id="listeRestaurants">
        <md-table v-model="restaurants" md-sort="nom" md-sort-order="asc" md-card>
        <!--v-on:click="supprimerRestaurant(item)"-->
            <md-table-row slot="md-table-row" slot-scope="{ item }" @click="$router.push('/RestaurantDetails/' + item._id)">
                <md-table-cell md-label="Nom" md-sort-by="name">{{ item.name }}</md-table-cell>
                <md-table-cell md-label="Cuisine">{{ item.cuisine }}</md-table-cell>
                <md-table-cell md-label="Note" md-sort-by="note"><i class="el-icon-star-on" v-for="note in item.grades[0].score" :key="note"></i></md-table-cell>
                <md-table-cell><img src="../assets/heart-icon.png" alt="LIKED" width="10px" v-if="isFavoris(item._id)"></md-table-cell>
                <md-table-cell> <i class="el-icon-delete" @click="supprimerRestaurant(item)" @click.stop.prevent></i></md-table-cell>
            </md-table-row>
        </md-table>

        <div id="next">
            <md-button :disabled="page===0" @click="pagePrecedente()" class="md-accent">Précédent</md-button>
            <md-button :disabled="page===nbPageTotal" @click="pageSuivante()" class="md-primary">Suivant</md-button>
            <div class="slidecontainer">
                <input @change="getRestaurantsFromServer()" type="range" min="5" max="100" v-model="pageSize" step="5" class="slider" id="myRange">{{pageSize}}
            </div>
        </div>
        

    </div>
    

  </div>

  
    

</template>

<script>
import _ from "lodash"
export default {
  name: 'ListeDesRestaurants',
  data: function () {
        return{
            restaurants: [],
            name: '',
            cuisine: '',
            nbRestaurantsTotal: '',
            page : 0,
            pageSize : 10,
            nbPageTotal : 0,
            nomRechercher: '',
            active: false,
            value: null
        }},
    mounted() {
        this.getRestaurantsFromServer();
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
        ajouterRestaurant(event) {
            // eviter le comportement par defaut
        
            let form = event.target;

            // Récupération des valeurs des champs du formulaire
            // en prévision d'un envoi multipart en ajax/fetch
            let donneesFormulaire = new FormData(form);

            let url = "http://localhost:8080/api/restaurants";

            fetch(url, {
                method: "POST",
                body: donneesFormulaire
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
                    console.log(err);
            });
            this.name = "";
            this.cuisine = "";
        },
        getColor(index) {
            return (index % 2) ? 'lightBlue' : 'pink';
        },
        getRestaurantsFromServer() {
            let url = 'http://localhost:8080/api/restaurants?';
            url += 'page=' + this.page;
            url += '&pagesize=' + this.pageSize;
            url += '&name=' + this.nomRechercher;

            fetch(url, {
                method: 'get'
            }).then((response) => {
                response.json().then((res) => {
                    this.restaurants = res.data;
                    this.nbRestaurantsTotal = res.count;
                    this.nbPageTotal = Math.round(this.nbRestaurantsTotal/this.pageSize);
                    this.restaurants.forEach(element => {
                        element.grades[0].score = Math.floor((element.grades[0].score * 5)/20)
                    });
                });
            }).catch(function(err) {
                console.log(err);
            });
        },
        pagePrecedente() {
            if (this.page === 0) return;

            this.page--;
            this.getRestaurantsFromServer();
            
            
        },
        pageSuivante() {
            if (this.page === this.nbPageTotal) return;
            this.page++;
            this.getRestaurantsFromServer();
        },
        changePageSize(size) {
            this.pageSize = size ;
            this.getRestaurantsFromServer();
        },
        onConfirm () {
        this.value = 'Agreed'
      },
      isFavoris(id) {
        if(localStorage.getItem("favoris")){
            let favoris = JSON.parse(localStorage.getItem("favoris"));
            return favoris.indexOf(id) >= 0;
        }
        return false;
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

#ajout {
    margin: 2%;
}

#next {
    margin: 2%;
}


@import url("//unpkg.com/element-ui@2.15.6/lib/theme-chalk/index.css");
</style>
