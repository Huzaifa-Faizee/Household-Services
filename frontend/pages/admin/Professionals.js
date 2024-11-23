export default {
  template: `
  <div>
    <h1>Professionals</h1>
    <h4>New Requests</h4>
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
                <th>Accept</th>
                <th>Reject</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(prof,index) in pending_professionals">
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
            <td><button class="btn btn-success" @click="changeStatus(prof,'accepted')">Accept</button></td>
            <td><button class="btn btn-danger" @click="changeStatus(prof,'rejected')">Reject</button></td>
            </tr>
        </tbody>
    </table>
    <h4>Accepted/Active Professionals</h4>
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
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(prof,index) in accepted_professionals">
            <td>{{index+1}}</td>
            <td>{{prof.business_name}}</td>
            <td>{{prof.address}}</td>
            <td>{{prof.experience}}</td>
            <td>{{prof.date_created}}</td>
            <td>{{prof.user.name}}</td>
            <td>{{prof.user.email}}</td>
            <td>{{prof.service.name}}</td>
            <td><button class="btn btn-danger" @click="changeStatus(prof,'rejected')">Disable</button></td>
            </tr>
        </tbody>
    </table>
    <h4>Rejected Requests</h4>
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
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(prof,index) in rejected_professionals">
            <td>{{index+1}}</td>
            <td>{{prof.business_name}}</td>
            <td>{{prof.address}}</td>
            <td>{{prof.experience}}</td>
            <td>{{prof.date_created}}</td>
            <td>{{prof.user.name}}</td>
            <td>{{prof.user.email}}</td>
            <td>{{prof.service.name}}</td>
            <td><button class="btn btn-success" @click="changeStatus(prof,'accepted')">Accept</button></td>
            </tr>
        </tbody>
    </table>
  </div>
    `,
  data() {
    return {
      professionals: [],
      pending_professionals: [],
      accepted_professionals: [],
      rejected_professionals: [],
    };
  },
  mounted() {
    this.getProfessionalData();
  },
  methods: {
    initialiseVariables() {
      this.professionals = [];
      this.pending_professionals = [];
      this.accepted_professionals = [];
      this.rejected_professionals = [];
    },
    async getProfessionalData() {
      const res = await fetch(location.origin + "/api/professionals", {
        headers: {
          "Authentication-Token": this.$store.state.auth_token,
        },
      });
      if (res.ok) {
        let data = await res.json();
        this.professionals = data;
        console.log(this.professionals);

        this.professionals.forEach((prof) => {
          if ((prof.status == "waiting")) {
            prof;
            this.pending_professionals.push(prof);
          } else if ((prof.status == "accepted")) {
            this.accepted_professionals.push(prof);
          } else {
            this.rejected_professionals.push(prof);
          }
        });
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
        console.log(data);
        this.initialiseVariables();
        this.getProfessionalData();
      }
    },
  },
};
