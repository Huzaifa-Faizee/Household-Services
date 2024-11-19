export default {
  template: `
    <div>
        <input placeholder="email"  v-model="email"/>  
        <input placeholder="password"  v-model="password"/>  
        <button class='btn btn-primary' @click="submitLogin"> Login </button>
    </div>
    `,
  data() {
    return {
      email: null,
      password: null,
    };
  },
  methods: {
    async submitLogin() {
      let submitData = {
        email: this.email,
        password: this.password,
      };
      const res = await fetch(location.origin + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      if (res.ok) {
        console.log("we are logged in");
        const data = await res.json();
        console.log(data);
        localStorage.setItem('user', JSON.stringify(data));
        this.$store.commit('setUser')
        if(data.role=="admin"){
            this.$router.push('/admin-home');
        }
      }
    },
  },
};
