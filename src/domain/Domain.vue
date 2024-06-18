<template>
    <div class="animate-fade-up animate-once animate-ease-in-out">
      <div class="max-w-xl mx-auto bg-white rounded-lg ">
        <h1 class="text-3xl font-semibold text-center py-6">Domain Checker</h1>
  
        <form @submit.prevent="checkDomain" class="px-6 py-4">
          <div class="flex items-center gap-2">
            <input v-model="domain" placeholder="Enter domain"
                   class="border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1">
            <button type="submit"
                    class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              Check Domain
            </button>
          </div>
        </form>
  
        <div v-if="domainDetails" class="bg-white rounded-lg p-6 mt-6">
          <h2 class="text-xl font-semibold mb-4">Domain Information</h2>
          <div class="space-y-4">
            <p><strong>Domain:</strong> {{ domainDetails.domain }}</p>
            <p><strong>Top Level Domain (TLD):</strong> {{ domainDetails.tld }}</p>
            <p><strong>Valid:</strong> {{ domainDetails.valid ? 'Yes' : 'No' }}</p>
            <p><strong>Available:</strong> {{ domainDetails.available ? 'Yes' : 'No' }}</p>
            <p><strong>Registrar:</strong> {{ domainDetails.registrar }}</p>
            <p><strong>Created At:</strong> {{ domainDetails.created_at }}</p>
            <p><strong>Updated At:</strong> {{ domainDetails.updated_at }}</p>
            <p><strong>Expires At:</strong> {{ domainDetails.expires_at }}</p>
            <p><strong>Whois Server:</strong> <a :href="domainDetails.whois" target="_blank">{{ domainDetails.whois }}</a></p>
          </div>
        </div>
  
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6" role="alert">
          {{ error }}
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import axios from 'axios';
  
  interface DomainDetails {
    domain: string;
    tld: string;
    valid: boolean;
    available: boolean;
    registrar: string;
    created_at: string;
    updated_at: string;
    expires_at: string;
    whois: string;
  }
  
  export default defineComponent({
    data() {
      return {
        domain: '',
        domainDetails: null as DomainDetails | null,
        error: null as string | null
      };
    },
    methods: {
      async checkDomain() {
        const options = {
          method: 'GET',
          url: 'https://domain-checker7.p.rapidapi.com/whois',
          params: {
            domain: this.domain
          },
          headers: {
            'x-rapidapi-key': 'faa271f72fmshfe9df8831015cddp121d98jsn308069e51507',
            'x-rapidapi-host': 'domain-checker7.p.rapidapi.com'
          }
        };
  
        try {
          const response = await axios.request(options);
          this.domainDetails = response.data;
          this.error = null;
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            this.error = `Error fetching data: ${error.response?.data.message ?? error.message}`;
          } else {
            this.error = 'An unexpected error occurred';
          }
          console.error(error);
        }
      }
    }
  });
  </script>
