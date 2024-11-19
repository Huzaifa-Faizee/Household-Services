export default {
  template: `
  <div>
  <h1>View Services</h1>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="service in services">
            <td>{{service.name}}</td>
            <td>{{service.description}}</td>
            <td><button>Delete</button></td>
            </tr>
        </tbody>
    </table>
    <h1>Create Services</h1>
    <input type="text" name="name" v-model="name">
    <input type="text" name="desc" v-model="desc">
    <button @click="addNewService">Add</button>
  </div>
    `,
  data() {
    return {
      name: null,
      desc: null,
      services: [],
    };
  },
  async mounted() {
    const res = await fetch(location.origin + "/api/services", {
      headers: {
        // "Authentication-Token": this.$store.state.auth_token,
      },
    });
    if (res.ok) {
      let data = await res.json();
      this.services = data;
    }
  },
  methods: {
    async addNewService() {
      let serviceData = {
        name: this.name,
        desc: this.desc,
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
      }
    },
  },
};
