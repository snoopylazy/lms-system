// stores/branch.js
import { defineStore } from 'pinia';

export const useBranchStore = defineStore('branch', {
  state: () => ({
    // branchId: null,
    userId: null,
    // branchName: null,

    // ✅ New invoice state
    // invoice: null,
  }),

  actions: {
    // Branch Actions
    // setBranchId(id) {
    //   this.branchId = id;
    // },
    setUserId(id) {
      this.userId = id;
    },
    // setBranchName(name) {
    //   this.branchName = name;
    // },
    // clearBranchId() {
    //   this.branchId = null;
    // },
    clearUserId() {
      this.userId = null;
    },
    // clearBranchName() {
    //   this.branchName = null;
    // },

    // ✅ Invoice Actions
    // setInvoice(data) {
    //   this.invoice = data;
    //   // Sync to localStorage so another screen (customer) sees update
    //   localStorage.setItem('latestInvoice', JSON.stringify(data));
    // },

    // clearInvoice() {
    //   this.invoice = null;
    //   localStorage.removeItem('latestInvoice');
    // },
  },

  getters: {
    // getBranchId: (state) => state.branchId,
    getUserId: (state) => state.userId,
    // getBranchName: (state) => state.branchName,

    // ✅ Invoice Getter
    // getInvoice: (state) => state.invoice,
  },

  persist: true,
});
