import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import VueRouter from 'vue-router'
import 'leaflet/dist/leaflet.css';
import ListeDesRestaurants from './components/ListeDesRestaurants.vue'
import RestaurantDetails from './components/RestaurantDetails.vue'
import Accueil from './components/Accueil.vue'
import Favoris from './components/Favoris.vue'

Vue.use(VueMaterial) 
Vue.use(VueRouter)

const router = new VueRouter ({
   routes : [ 
      {
        path: '/',
        component: Accueil 
      },
      {
        path: '/accueil',
        component: Accueil 
      },
      {
        path: '/restaurant',
        component: ListeDesRestaurants  
      },
      {
        path: '/restaurantDetails/:id',
        component: RestaurantDetails 
      },
      {
        path: '/favoris',
        component: Favoris 
      }
   ],
   mode : 'history'
}) 

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')