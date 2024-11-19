export default {
  template: `
    <div>
        <input placeholder="email"  v-model="email"/>  
        <input placeholder="password"  v-model="password"/>  
        <select name="role" v-model="role" @change="onRoleChange">
            <option value="user">User</option>
            <option value="service_provider">Service Provider</option>
        </select>
        <div v-if="role=='service_provider'">
          <select name="service" v-model="service_id">
            <option v-for="service in services" value="serv.id">{{service.name}}</option>
          </select>
        </div>
        <button @click="submitLogin"> Register </button>

    </div>
    `,
  data() {
    return {
      email: null,
      password: null,
      role: null,
      services: [],
      service_id:null,
    };
  },
  methods: {
    async onRoleChange() {
      if (this.role == "service_provider") {
        const res = await fetch(location.origin + "/api/services", {
          headers: {
            // "Authentication-Token": this.$store.state.auth_token,
          },
        });
        if (res.ok) {
          let data = await res.json();
          this.services = data;
        }else{
          console.log("Not ok");
        }
      }
    },

    async submitLogin() {
      let userData = {
        email: this.email,
        password: this.password,
        role: this.role,
      };
      const res = await fetch(location.origin + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        let data = await res.json();
        console.log("we are register");
        console.log(data);
      }
    },
  },
};
