<script setup>
import { onMounted, ref, watchEffect } from "vue";
import DefaultImage from "../assets/default-profile.jpg";
import API_CALL from "../helper/API";
import { AVATAR_URL } from "../helper/constant";

// defineProps({
//   msg: String,
// });

const contactData = ref([]);
const typeContact = ref([]);
const name = ref("");
const phone = ref("");
const type = ref("");
const address = ref("");
const email = ref("");
const images = ref(null);
const filter = ref("");
const search = ref("");
const updateId = ref("");
const jsonFile = ref(null);

const resetValues = () => {
  name.value = "";
  phone.value = "";
  type.value = "";
  address.value = "";
  email.value = "";
  images.value = null;
  jsonFile.value = null;
  updateId.value = "";
};

const getDataContact = async () => {
  try {
    const result = await API_CALL.get("/addressbook", {
      params: {
        type: filter.value,
        query: search.value,
      },
    });

    contactData.value = result.data.result;
  } catch (error) {
    console.log(error);
  }
};

const getDataType = async () => {
  try {
    const result = await API_CALL.get("/type");
    typeContact.value = result.data.result;
  } catch (error) {
    console.log(error);
  }
};

const handleSubmit = async () => {
  try {
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("phone", phone.value);
    formData.append("type", type.value);
    formData.append("email", email.value);
    formData.append("address", address.value);
    if (images.value && typeof images.value != "string") {
      formData.append("images", images.value);
    }
    if (updateId.value) {
      const result = await API_CALL.post(`/addressbook/update/${updateId.value}`, formData);
    } else {
      const result = await API_CALL.post("/addressbook/create", formData);
    }
    alert("Success submit data");
    resetValues();
    getDataContact();
  } catch (error) {
    alert("Fail submit data");
  }
};

const handleDelete = async (id) => {
  try {
    const result = await API_CALL.delete(`/addressbook/delete/${id}`);
    alert("Delete success");
    getDataContact();
  } catch (error) {
    alert("Fail delete data");
  }
};

const getUpdateData = async (id) => {
  try {
    const result = await API_CALL.get(`/addressbook/${id}`);
    console.log(result.data);
    name.value = result.data.result.name;
    phone.value = result.data.result.phone;
    type.value = result.data.result.type;
    email.value = result.data.result.email;
    address.value = result.data.result.address;
    images.value = result.data.result.images;
    updateId.value = result.data.result.id;
    console.log(result.data.result.images);
  } catch (error) {
    console.log(error);
  }
};

const handleImport = async () => {
  try {
    const formData = new FormData();
    formData.append("addressJSON", jsonFile.value);
    const result = await API_CALL.post(`/addressbook/json-file`, formData);
    alert("Success import json");
    resetValues();
    getDataContact();
  } catch (error) {
    console.log(error);
    alert("Failed import json");
  }
};

onMounted(() => {
  getDataContact();
  getDataType();
});

watchEffect(() => {
  getDataContact();
});
</script>

<template>
  <div class="container">
    <div class="wrapper">
      <div class="form">
        <div class="two-row-form">
          <div class="form-group">
            <label>Name</label>
            <input
              type="text"
              @change="
                (e) => {
                  name = e.target.value;
                }
              "
              :value="name"
            />
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input
              type="number"
              @change="
                (e) => {
                  phone = e.target.value;
                }
              "
              :value="phone"
            />
          </div>
        </div>

        <div class="two-row-form">
          <div class="form-group">
            <label>Type</label>
            <select
              v-model="type"
              @change="
                (e) => {
                  type = e.target.value;
                }
              "
            >
              <option value="">--Select Type--</option>
              <option v-for="(type, index) in typeContact" :value="type" :key="type">
                {{ type }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              v-model="email"
              @change="
                (e) => {
                  email = e.target.value;
                }
              "
            />
          </div>
        </div>

        <div class="form-group">
          <label>Address</label>
          <input
            type="text"
            v-model="address"
            @change="
              (e) => {
                address = e.target.value;
              }
            "
          />
        </div>
        <div class="form-group">
          <label>Images</label>
          <label
            for="images"
            style="font-size: large; border: 1px dashed; padding: 0.25rem; border-radius: 10px"
            >{{ images ? (images?.name ? images.name : images) : "Select Images" }}</label
          >
          <input
            id="images"
            type="file"
            style="display: none"
            accept=".jpg,.png,.jpeg"
            @change="
              (e) => {
                images = e.target.files[0];
              }
            "
          />
        </div>
        <div style="display: flex; gap: 1rem">
          <button style="background-color: red" @click="resetValues">Cancel</button>
          <button style="background-color: yellowgreen" @click="handleSubmit">Submit</button>
        </div>
      </div>
      <div class="table-container">
        <div class="form-group" style="color: whitesmoke; margin-bottom: 1rem">
          <label>JSON File</label>
          <label
            for="jsonFile"
            style="font-size: large; border: 1px dashed; padding: 0.25rem; border-radius: 10px"
            >{{ jsonFile ? jsonFile.name : "Select JSON File" }}</label
          >
          <input
            id="jsonFile"
            type="file"
            style="display: none"
            accept=".json"
            @change="
              (e) => {
                jsonFile = e.target.files[0];
              }
            "
          />
        </div>
        <button style="margin-bottom: 1rem" @click="handleImport">Import JSON</button>
        <div class="form-action-table">
          <div class="form-group">
            <label>Filter</label>
            <select
              v-model="filter"
              @change="
                (e) => {
                  filter = e.target.value;
                }
              "
            >
              <option value="">--Select Type--</option>
              <option v-for="(type, index) in typeContact" :value="type">{{ type }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Search</label>
            <input
              v-model="search"
              type="search"
              @change="
                (e) => {
                  search = e.target.value;
                }
              "
            />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(contact, index) in contactData" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <span style="display: flex; gap: 4px; align-items: center">
                  <img
                    style="width: 30px; aspect-ratio: 1/1; object-fit: cover; border-radius: 100%"
                    :src="`${contact.images ? `${AVATAR_URL}/${contact.images}` : DefaultImage}`"
                    :alt="contact.images"
                  />{{ contact.name }}
                </span>
              </td>
              <td>{{ contact.phone }}</td>
              <td>{{ contact.type }}</td>
              <td>
                <span
                  style="
                    color: greenyellow;
                    font-weight: 600;
                    margin-right: 0.25rem;
                    cursor: pointer;
                  "
                  @click="getUpdateData(contact.id)"
                  >Edit</span
                >
                <span
                  style="color: red; font-weight: 600; cursor: pointer"
                  @click="handleDelete(contact.id)"
                  >Delete</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  padding: 0.5rem;
  overflow: auto;
}
.wrapper {
  margin: auto;
}

.form {
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  gap: 0.5rem;
  border-radius: 10px;
  border: 1px solid black;
  width: 100%;
  background-color: rgb(51, 51, 51);
  color: whitesmoke;
  margin-bottom: 10px;
}

.two-row-form {
  display: flex;
  gap: 0.5rem;
}

.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.form-group > label {
  font-size: x-small;
  font-weight: bold;
}

.form-group > input,
select {
  border-radius: 8px;
  padding: 0.25rem;
  border: 1.5px solid whitesmoke;
}

.table-container {
  padding: 0.75rem;
  background-color: rgb(51, 51, 51);
  border-radius: 10px;
}

.table-container > table {
  min-width: 100%;
  color: whitesmoke;
  font-size: small;
  border-collapse: collapse;
}

td {
  border: 1px solid whitesmoke;
  padding: 0.25rem;
  text-align: center;
}
th {
  border: 1px solid whitesmoke;
}

.form-action-table {
  display: flex;
  justify-content: space-between;
  color: whitesmoke;
  margin-bottom: 10px;
  gap: 2rem;
}

.form-action-table > input,
select {
  border-radius: 8px;
  padding: 0.25rem;
  border: 1.5px solid whitesmoke;
}

button {
  padding: 0.75rem;
  background-color: whitesmoke;
  border-radius: 10px;
  font-size: medium;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}
</style>
