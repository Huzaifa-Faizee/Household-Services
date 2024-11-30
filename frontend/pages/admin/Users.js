export default {
  template: `
  <div class="page-body">
  <div class="page-heading">Users</div>
  <div class="buttons">
      <button class="button-58" @click="createCsv">Export Data</button>
  </div>
  <table v-if="users.length>0">
      <thead>
          <tr>
              <th>Sr No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
          </tr>
      </thead>
      <tbody>
          <tr v-for="(user,index) in users">
              <td>{{index+1}}</td>
              <td>{{user.name}}</td>
              <td>{{user.email}}</td>
              <td v-if="user.customer[0].status=='active'"><button class="btn btn-danger"
                      @click="changeUserStatus(user.id,'blocked')">Block</button></td>
              <td v-if="user.customer[0].status=='blocked'"><button class="btn btn-primary"
                      @click="changeUserStatus(user.id,'active')">Un-Block</button></td>
          </tr>
      </tbody>
  </table>
  <div class="message" v-if="users.length==0">
      No Users Yet
  </div>
</div>
`,
  data() {
    return {
      users: [],
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      const res = await fetch(location.origin + "/api/users", {
        headers: {
          "Authentication-Token": this.$store.state.auth_token,
        },
      });
      if (res.ok) {
        let data = await res.json();
        this.users = data;
        console.log(this.users);
      }
    },
    async changeUserStatus(userId, status) {
      const user_data = {
        user_id: userId,
        status: status,
      };
      console.log("User Data", user_data);

      const res = await fetch(location.origin + "/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": this.$store.state.auth_token,
        },
        body: JSON.stringify(user_data),
      });
      if (res.ok) {
        let data = await res.json();
        console.log(data);
        this.getUsers();
      }
    },
    async createCsv() {
      const res = await fetch(location.origin + "/create-customer-csv", {
        headers: {
          "Authentication-Token": this.$store.state.auth_token,
        },
      });
      const task_id = (await res.json()).task_id;

      const interval = setInterval(async () => {
        const res = await fetch(
          `${location.origin}/get-customer-csv/${task_id}`
        );
        if (res.ok) {
          console.log("data is ready");
          window.open(`${location.origin}/get-customer-csv/${task_id}`);
          clearInterval(interval);
        }
      }, 100);
    },
  },
};
