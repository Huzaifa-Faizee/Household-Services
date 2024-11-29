export default {
  template: `
    <div>
        <h1>Search</h1>
        <input type="text" name="search" v-model="search_value">
        <button @click="search">search</button>

        <div v-if="professionals.length>0">
            <h4>Professionals</h4>
            <table>
                <thead>
                    <tr>
                        <th>Sr No</th>
                        <th>Business Name</th>
                        <th>Address</th>
                        <th>Experience</th>
                        <th>Created Date</th>
                        <th>Owner Name</th>
                        <th>Owner Email</th>
                        <th>Service Selected</th>
                        <th>Document</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(prof,index) in professionals">
                        <td>{{index+1}}</td>
                        <td>{{prof.business_name}}</td>
                        <td>{{prof.address}}</td>
                        <td>{{prof.experience}}</td>
                        <td>{{prof.date_created}}</td>
                        <td>{{prof.user.name}}</td>
                        <td>{{prof.user.email}}</td>
                        <td>{{prof.service.name}}</td>
                        <td><a :href="'/uploads/' + prof.uploaded_file" target="_blank">
                                View Document
                            </a></td>
                        <td> {{prof.status}} </td>
                        <td>
                          <button class="btn btn-success" v-if="prof.status=='rejected' || prof.status=='waiting'" @click="changeStatus(prof,'accepted')">Accept</button>
                          <button class="btn btn-danger" v-if="prof.status=='accepted' || prof.status=='waiting'" @click="changeStatus(prof,'rejected')">Reject</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="users.length>0">
            <h4>Users</h4>
            <table> 
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
                        <td v-if="user.customer[0].status=='active'"><button class="btn btn-danger" @click="changeUserStatus(user.id,'blocked')">Block</button></td>
                        <td v-if="user.customer[0].status=='blocked'"><button class="btn btn-primary" @click="changeUserStatus(user.id,'active')">Un-Block</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>    
    `,
  data() {
    return {
      search_value: null,
      users: [],
      professionals: [],
    };
  },
  methods: {
    async search() {
      const res = await fetch(
        location.origin + "/api/admin-search/" + this.search_value,
        {
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        }
      );
      if (res.ok) {
        let data = await res.json();
        this.users=data.users
        this.professionals=data.professionals
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
        this.search();
      }
    },
    async changeStatus(professional, status) {
      let dataToPass = {
        id: professional.id,
        status: status,
      };
      const res = await fetch(location.origin + "/api/professionals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": this.$store.state.auth_token,
        },
        body: JSON.stringify(dataToPass),
      });
      if (res.ok) {
        let data = await res.json();
        this.search();
      }
    },
  },
};
