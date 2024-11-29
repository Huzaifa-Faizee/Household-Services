export default {
  template: `
    <div>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" v-if="!$store.state.loggedIn" href="#">HomeCare</a>
            <a class="navbar-brand" v-if="$store.state.loggedIn && $store.state.role == 'admin'" href="#">Admin Dashboard -  Hello {{$store.state.name}}</a>
            <a class="navbar-brand" v-if="$store.state.loggedIn && $store.state.role == 'service_provider'" href="#">Professional Dashboard -  Hello {{$store.state.name}}</a>
            <a class="navbar-brand" v-if="$store.state.loggedIn && $store.state.role == 'user'" href="#">User Dashboard -  Hello {{$store.state.name}}</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item" v-if="!$store.state.loggedIn">
                      <a class="nav-link"><router-link to='/'>Home</router-link></a>
                    </li>
                    <li class="nav-item" v-if="!$store.state.loggedIn">
                        <a class="nav-link"><router-link to='/login'>Login</router-link></a>
                    </li>
                    <li class="nav-item" v-if="!$store.state.loggedIn">
                        <a class="nav-link"><router-link to='/register'>Register</router-link></a>
                    </li>
                    <!--Admin Navbar-->
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role == 'admin'">
                        <a class="nav-link"><router-link to='/admin-home'>Home</router-link></a>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role == 'admin'">
                        <a class="nav-link"><router-link to='/services'>Services</router-link></a>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role == 'admin'">
                        <a class="nav-link"><router-link to='/users'>Users</router-link></a>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role == 'admin'">
                        <a class="nav-link"><router-link to='/professionals'>Professionals</router-link></a>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role == 'admin'">
                        <a class="nav-link"><router-link to='/admin-requests'>Requests</router-link></a>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role == 'admin'">
                        <a class="nav-link"><router-link to='/admin-search'>Search</router-link></a>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role == 'admin'">
                        <a class="nav-link"><router-link to='/admin-summary'>Summary</router-link></a>
                    </li>
                    <!--Professional Navbar-->
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role == 'service_provider'">
                        <a class="nav-link"><router-link to='/professional-home'>Home</router-link></a>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role == 'service_provider'">
                        <a class="nav-link"><router-link to='/professional-requests'>Requests</router-link></a>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role == 'service_provider'">
                        <a class="nav-link"><router-link to='/professional-summary'>Summary</router-link></a>
                    </li>
                    <!--User Navbar-->
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role == 'user'">
                        <a class="nav-link"><router-link to='/user-home'>Home</router-link></a>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role == 'user'">
                        <a class="nav-link"><router-link to='/user-requests'>Requests</router-link></a>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role == 'user'">
                        <a class="nav-link"><router-link to='/user-summary'>Summary</router-link></a>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role == 'user'">
                        <a class="nav-link"><router-link to='/user-search'>Search</router-link></a>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn">
                        <button class="btn btn-secondary" @click="logout">Logout</button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    </div>
    `,
  methods: {
    logout() {
      this.$store.commit("logout");
      this.$router.push("/");
    },
  },
};
