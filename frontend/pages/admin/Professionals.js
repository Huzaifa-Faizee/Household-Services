export default {
  template: `
  <div class="page-body">
    <div class="page-heading">Professionals</div>
    <div class="buttons">
        <button class="button-58" @click="createCsv">Export Data</button>
    </div>
    <div class="sub-heading">New Requests</div>
    <table v-if="pending_professionals.length>0">
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
    <div v-if="pending_professionals.length==0" class="message">
        No Data here
    </div>
    <div class="sub-heading">Accepted/Active Professionals</div>
    <table v-if="accepted_professionals.length>0">
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
    <div v-if="accepted_professionals.length==0" class="message">
        No Data here
    </div>
    <div class="sub-heading">Rejected Requests</div>
    <table v-if="rejected_professionals.length>0">
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
    <div v-if="rejected_professionals.length==0" class="message">
        No Data here
    </div>
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
          if (prof.status == "waiting") {
            this.pending_professionals.push(prof);
          } else if (prof.status == "accepted") {
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
        this.initialiseVariables();
        this.getProfessionalData();
      }
    },
    async createCsv() {
      const res = await fetch(location.origin + "/create-professional-csv", {
        headers: {
          "Authentication-Token": this.$store.state.auth_token,
        },
      });
      const task_id = (await res.json()).task_id;

      const interval = setInterval(async () => {
        const res = await fetch(
          `${location.origin}/get-professional-csv/${task_id}`
        );
        if (res.ok) {
          console.log("data is ready");
          window.open(`${location.origin}/get-professional-csv/${task_id}`);
          clearInterval(interval);
        }
      }, 100);
    },
  },
};
