export default {
  template: `
    <div>
        <input placeholder="name"  v-model="name"/>  
        <input placeholder="email"  v-model="email"/>  
        <input placeholder="password"  v-model="password"/>  
        <button @click="submitRegister"> Register </button>
        <a> <router-link to='/registerProfessional'>Register as professional?</router-link></a>
    </div>
    `,
  data() {
    return {
      email: null,
      password: null,
      role: "user",
      name: null,
    };
  },
  methods: {

    async submitRegister() {
      let userData = {
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role,
      };
      var res = await fetch(location.origin + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        let data = await res.json();
        console.log("we are registered");
        console.log(data);
      }
    },
  },
};
