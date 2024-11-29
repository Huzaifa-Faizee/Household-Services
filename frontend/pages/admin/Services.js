export default {
  template: `
  <div>
  <h1>View Services</h1>
    <button class="btn btn-info" @click="createCsv">Get Data</button>
    <button class="btn btn-success" @click="openAddModal">Add</button>

    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Base Price</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="service in services">
            <td>{{service.name}}</td>
            <td>{{service.description}}</td>
            <td>{{service.base_price}}</td>
            <td><button @click="openEditModal(service)">Edit</button></td>
            <td><button @click="deleteService(service)">Delete</button></td>
            </tr>
        </tbody>
    </table>
     <!-- Add Modal-->
     <div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
     <div class="modal-dialog">
       <div class="modal-content">
         <div class="modal-header">
           <h5 class="modal-title" id="addModalLabel">Add Service</h5>
           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
         <div class="modal-body">
           <form>
             <div class="mb-3">
               <label for="name" class="form-label">Name:</label>
               <input type="text" v-model="name" id="name" class="form-control" required />
             </div>
             <div class="mb-3">
               <label for="desc" class="form-label">Description:</label>
               <textarea type="text" v-model="desc" id="desc" class="form-control" required />
             </div>
             <div class="mb-3">
               <label for="base-price" class="form-label">Base Price:</label>
               <input type="number" v-model="base_price" id="base-price" class="form-control" required />
             </div>
           </form>
         </div>
         <div class="modal-footer">
           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
           <button type="submit" class="btn btn-primary" @click="addNewService">Add</button>
         </div>
       </div>
     </div>
   </div>
     <!-- Edit Modal-->
     <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
     <div class="modal-dialog">
       <div class="modal-content">
         <div class="modal-header">
           <h5 class="modal-title" id="editModalLabel">Edit Service</h5>
           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
         <div class="modal-body">
           <form>
             <div class="mb-3">
               <label for="name" class="form-label">Name:</label>
               <input type="text" v-model="edit_name" id="name" class="form-control" required />
             </div>
             <div class="mb-3">
               <label for="desc" class="form-label">Description:</label>
               <textarea type="text" v-model="edit_desc" id="desc" class="form-control" required />
             </div>
             <div class="mb-3">
               <label for="base-price" class="form-label">Base Price:</label>
               <input type="number" v-model="edit_base_price" id="base-price" class="form-control" required />
             </div>
           </form>
         </div>
         <div class="modal-footer">
           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
           <button type="submit" class="btn btn-primary" @click="editService">Edit</button>
         </div>
       </div>
     </div>
   </div>

  </div>
    `,
  data() {
    return {
      name: null,
      desc: null,
      base_price: null,
      edit_name: null,
      edit_desc: null,
      edit_base_price: null,
      edit_id: null,
      services: [],
      addModal: null,
      editModal: null,
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
        console.log(this.services);
      }
    },
    openAddModal() {
      this.addModal = new bootstrap.Modal(document.getElementById("addModal"));
      this.addModal.show();
    },
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
        this.addModal.hide();
      }
    },
    openEditModal(service) {
      this.editModal = new bootstrap.Modal(
        document.getElementById("editModal")
      );
      this.edit_id = service.id;
      this.edit_name = service.name;
      this.edit_desc = service.description;
      this.edit_base_price = service.base_price;
      this.editModal.show();
    },
    async editService() {
      let serviceData = {
        id: this.edit_id,
        name: this.edit_name,
        desc: this.edit_desc,
        base_price: this.edit_base_price,
      };
      const res = await fetch(location.origin + "/api/services", {
        method: "PUT",
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
        this.editModal.hide();
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
      this.edit_name = null;
      this.edit_desc = null;
      this.edit_base_price = null;
    },
    async createCsv() {
      const res = await fetch(location.origin + "/create-service-csv", {
        headers: {
          "Authentication-Token": this.$store.state.auth_token,
        },
      });
      const task_id = (await res.json()).task_id;

      const interval = setInterval(async () => {
        const res = await fetch(
          `${location.origin}/get-service-csv/${task_id}`
        );
        if (res.ok) {
          console.log("data is ready");
          window.open(`${location.origin}/get-service-csv/${task_id}`);
          clearInterval(interval);
        }
      }, 100);
    },
  },
};
