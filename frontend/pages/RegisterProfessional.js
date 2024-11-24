export default {
  template: `
  <div>
    <h4>Resgister as professional</h4>
    <input placeholder="name"  v-model="name"/>  
    <input placeholder="email"  v-model="email"/>  
    <input placeholder="password"  v-model="password"/>
    <select name="service" v-model="service_data">
        <option v-for="service in services" :value="service">{{service.name}}</option>
    </select>
    <input placeholder="business_name"  v-model="business_name"/>  
    <input placeholder="experience"  v-model="experience"/>  
    <input placeholder="address"  v-model="address"/>  
    <input type="file" @change="onFileChange" />
    <button @click="submitRegister"> Register </button>
  </div>
    `,
  data() {
    return {
      email: null,
      password: null,
      role: "service_provider",
      services: [],
      service_data: null,
      experience: null,
      name: null,
      business_name: null,
      experience: null,
      address: null,
      selectedFile: null,
    };
  },
  mounted() {
    this.getServices();
  },
  methods: {
    async getServices() {
      const res = await fetch(location.origin + "/api/services", {
        headers: {
          // "Authentication-Token": this.$store.state.auth_token,
        },
      });
      if (res.ok) {
        let data = await res.json();
        this.services = data;
      } else {
        console.log("Not ok");
      }
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async submitRegister() {
      const formData = new FormData();
      formData.append("name", this.name);
      formData.append("email", this.email);
      formData.append("password", this.password);
      formData.append("role", this.role);
      formData.append("service_id", this.service_data.id);
      formData.append("price", this.service_data.base_price);
      formData.append("business_name", this.business_name);
      formData.append("experience", this.experience);
      formData.append("address", this.address);
      if (this.selectedFile) {
        formData.append("file", this.selectedFile); // Append the file
      }
      var res = await fetch(location.origin + "/registerProfessional", {
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: formData,
      });
      if (res.ok) {
        let data = await res.json();
        console.log("we are registered");
        console.log(data);
      }
    },
    async submitRegister2() {
      let userData = {
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role,
        service_id: this.service_id,
        business_name: this.business_name,
        experience: this.experience,
        address: this.address,
      };
      var res = await fetch(location.origin + "/registerProfessional", {
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
