export default {
    template : `
    <div>
        <router-link v-if="!$store.state.loggedIn" to='/'>Home</router-link>
        <router-link v-if="!$store.state.loggedIn" to='/login'>Login</router-link>
        <router-link v-if="!$store.state.loggedIn" to='/register'>Register</router-link>
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'admin'" to='/admin-home'>Home</router-link>
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'admin'" to='/services'>Services</router-link>
        <button class="btn btn-secondary" v-if="$store.state.loggedIn" @click="$store.commit('logout')">Logout</button>
    </div>
    `
}