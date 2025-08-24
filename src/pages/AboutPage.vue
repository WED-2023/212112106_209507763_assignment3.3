<template>
  <div class="container mt-4">
    <h1 class="center">About Goldfarb-Showgan Recipes</h1>
    <!-- <router-link class="btn btn-secondary mb-3" :to="{ name: 'main' }">Go Home</router-link> -->

    <!-- Project Overview -->
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Project Scope</h5>
        <p class="card-text">
          This repository is the client-frontend for Assignment 3.3, working together with the backend server of Assignment 3.2.
          The frontend is built using Vue.js and Bootstrap (and BootstrapVue where applicable), communicating via the defined API.
        </p>
        <p class="card-text">
          The backend (Assignment 3.2) is implemented with Node.js and Express, using MySQL as the database, and exposes endpoints as specified in the OpenAPI API document from Assignment 3.1.
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

/* Base page style */
.container {
  font-family: 'Merriweather', 'Georgia', serif;
  color: #274046;
  background: #f7fafc;
  padding-bottom: 32px;
}

h1 {
  font-family: 'Playfair Display', serif;
  font-size: 3.0rem;
  font-weight: 600;
  color: #27747f;
  letter-spacing: 1px;
  margin-bottom: 2rem;
}

.card {
  border-radius: 14px;
  box-shadow: 0 2px 14px rgba(39, 64, 70, 0.06);
  border: none;
  background: #ffffff;
}

.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  color: #27747f;
  font-weight: 600;
  margin-bottom: 0.9rem;
}

.card-text {
  font-size: 1.07rem;
  color: #274046;
  margin-bottom: 0.7rem;
  line-height: 1.7;
}

.router-link.btn {
  margin-bottom: 2rem;
  font-size: 1rem;
  border-radius: 8px;
  box-shadow: 0 0.5px 4px #cfd8dc;
  background: linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%);
  color: #274046;
  font-weight: 500;
  padding: 0.55em 1.2em;
  transition: 0.18s;
}
.router-link.btn:hover {
  background: linear-gradient(90deg, #f7cac9 0%, #cfdef3 100%);
  color: #27747f;
}

/* List group customization */
.list-group-item {
  font-size: 1.05rem;
  color: #365470;
  font-family: 'Merriweather', serif;
  background: #f2f7fa;
  border: none;
  border-left: 4px solid #b6e2e6;
  margin-bottom: 6px;
  border-radius: 4px;
  padding: 0.75em 1em;
}
.list-group-item strong {
  font-weight: 700;
  color: #27747f;
}

/* Links and code inside cards */
.card-text a {
  color: #1f66b2;
  text-decoration: underline;
  font-weight: 500;
}
.card-text code {
  font-family: 'Fira Mono', 'Consolas', monospace;
  font-size: 0.97em;
  background: #f6ffed;
  color: #157f65;
  border-radius: 4px;
  padding: 0.15em 0.45em;
}

/* Unordered list inside card */
.card ul {
  padding-left: 1.22em;
}
.card ul li {
  margin-bottom: 0.45em;
  font-size: 1.05rem;
}

/* Responsive spacing */
@media (max-width: 600px) {
  h1 {
    font-size: 1.55rem;
  }
  .card-title {
    font-size: 1.15rem;
  }
  .card-text, .list-group-item {
    font-size: 0.97rem;
  }
}
</style>