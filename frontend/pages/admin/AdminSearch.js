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
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user,index) in users">
                        <td>{{index+1}}</td>
                        <td>{{user.name}}</td>
                        <td>{{user.email}}</td>
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
  },
};
