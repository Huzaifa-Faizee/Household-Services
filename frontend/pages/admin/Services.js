export default {
  template: `
  <div>
  <h1>View Services</h1>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Base Price</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="service in services">
            <td>{{service.name}}</td>
            <td>{{service.description}}</td>
            <td>{{service.base_price}}</td>
            <td><button @click="deleteService(service)">Delete</button></td>
            </tr>
        </tbody>
    </table>
    <h1>Create Services</h1>
    <input type="text" name="name" v-model="name">
    <input type="text" name="desc" v-model="desc">
    <input type="number" name="base-price" v-model="base_price">
    <button @click="addNewService">Add</button>
  </div>
    `,
  data() {
    return {
      name: null,
      desc: null,
      base_price: null,
      services: [],
    };
  },
  mounted() {
    this.getServices();
  },
  methods: {
    async addNewService() {
      let serviceData = {
        name: this.name,
        desc: this.desc,
        base_price: this.base_price,
      };
      const res = await fetch(location.origin + "/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": this.$store.state.auth_token,
        },
        body: JSON.stringify(serviceData),
      });
      if (res.ok) {
        let data = await res.json();
        console.log(data);
        this.getServices();
        this.initialiseVariables();
      }
    },
    async getServices() {
      const res = await fetch(location.origin + "/api/services", {
        headers: {
          // "Authentication-Token": this.$store.state.auth_token,
        },
      });
      if (res.ok) {
        let data = await res.json();
        this.services = data;
        console.log(this.services);
      }
    },
    async deleteService(service) {
      let serviceData = {
        id: service.id,
      };
      console.log(serviceData);

      const res = await fetch(location.origin + "/api/services", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": this.$store.state.auth_token,
        },
        body: JSON.stringify(serviceData),
      });
      if (res.ok) {
        let data = await res.json();
        console.log(data);
        this.getServices();
      }
    },
    initialiseVariables() {
      this.name = null;
      this.desc = null;
      this.base_price = null;
    },
  },
};
