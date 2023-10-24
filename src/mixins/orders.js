import axios from '@/axios.js'
import store from "@/store";

export const sharedMethodMixin = {
  methods: {
    async usersMixin(baseUrl, queryParams) {
      try {
        const response = await axios.get(baseUrl, {
          params: queryParams,
          headers: {
            Accept: "application/json",
            Authorization: store.getters.activeToken,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
        return null;
      }
    },
  },
};
