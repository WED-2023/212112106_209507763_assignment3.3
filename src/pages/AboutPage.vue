<template>
  <div class="container mt-4">
    <h1>About This Project</h1>
    <router-link class="btn btn-secondary mb-3" :to="{ name: 'main' }">Go Home</router-link>

    <!-- Project Overview -->
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Project Scope</h5>
        <p class="card-text">
          This repository is the client-frontend for Assignment 3.3, working together with the backend server of Assignment 3.2.
          The frontend is built using Vue.js and Bootstrap (and BootstrapVue where applicable), communicating via the defined API.
        </p>
        <p class="card-text">
          The backend (Assignment 3.2) is implemented with Node.js and Express, using MySQL as the database, and exposes endpoints as specified in the API document from Assignment 3.1.
        </p>
      </div>
    </div>

    <!-- Team Members -->
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Team Members</h5>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <strong>Abed Showgan</strong> — ID: 212112106
          </li>
          <li class="list-group-item">
            <strong>Michael Goldfrab</strong> — ID: 209507763
          </li>
        </ul>
      </div>
    </div>

    <!-- Contact & Sensitive Info Note -->
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Contact & Environment Variables</h5>
        <p class="card-text">
          NOTE: We did not upload our <code>.env</code> file or any sensitive keys here. If you need access or have questions, please contact us at
          <a href="mailto:showganabed@gmail.com">showganabed@gmail.com</a>.
        </p>
      </div>
    </div>

    <!-- Assignment Phases Overview -->
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Assignment Phases (Course: Internet Development 2025)</h5>
        <p class="card-text">
          The project comprises three stages:
        </p>
        <ul>
          <li>
            <strong>Assignment 3.1: API Specification</strong><br />
            Define the “contract” between client and server: the resources exposed, how to access them, request/response formats, and responsibilities of frontend vs. backend. Document any changes made during implementation.
          </li>
          <li class="mt-2">
            <strong>Assignment 3.2: Backend Implementation</strong><br />
            Build the server using Node.js and Express, with MySQL for data storage. Implement endpoints as per the API spec. Integrate any external recipe APIs as required.
          </li>
          <li class="mt-2">
            <strong>Assignment 3.3: Frontend Implementation</strong><br />
            Build the client using Vue.js. Consume the backend API, present UI for recipes (search, view, create, favorites, etc.), handle authentication/session, and follow the API contract.
          </li>
        </ul>
        <p class="mt-3">
          General guidelines:
        </p>
        <ul>
          <li>Follow course best practices for security, performance, and storage.</li>
          <li>For any requirement without explicit instructions, make informed design decisions and be ready to justify them.</li>
          <li>Document changes to the API or architecture as the project evolves.</li>
        </ul>
      </div>
    </div>

    <!-- Technologies Used -->
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Technologies</h5>
        <p class="card-text mb-1"><strong>Frontend:</strong> Vue.js, Vue Router, axios, Bootstrap5, BootstrapVue (where applicable), Vuelidate for form validation.</p>
        <p class="card-text mb-1"><strong>Backend:</strong> Node.js, Express, MySQL, external recipe APIs.</p>
        <p class="card-text"><strong>Others:</strong> Session handling with express-session or similar, CORS configuration, environment variables in <code>.env</code>.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
};
</script>

<style scoped>
/* You can add custom styling here if needed */
</style>