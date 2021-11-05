<template>
  <div id="app">
    
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <router-link to="/">
          <h1 class="md-title titre">foodvisor</h1>
        </router-link>
      </div>
      <div class="md-layout-item"></div>
      <div class="md-layout-item">
        <md-button class="md-accent" @click="$router.push('/Favoris')">Favoris</md-button>
      </div>
    </div>

    <div class="card">
      <router-link to="/restaurant">
        <md-card md-with-hover>
            <md-ripple>
                <md-card-header>
                    <div class="md-title">tous les restaurants</div>
                </md-card-header>
            </md-ripple>
        </md-card>
      </router-link>
      
    </div>
    
    <router-view></router-view> 

    <footer>
      foodvisor
    </footer>
  </div>
</template>

<script> 
 

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.titre {
  color: black;
  text-decoration: none;
  font-family: 'agraham', sans-serif;
}

.card .md-card {
    width: 20%;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
    border-radius: 20px;
}

.card .md-title {
  font-size: small;
}

footer {
  margin-top: 5%;
  font-family: 'agraham', sans-serif;
}

@import url('http://fonts.cdnfonts.com/css/agraham');
</style>
