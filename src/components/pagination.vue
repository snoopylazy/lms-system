<template>
    <div class="mt-10 flex justify-end ml-auto space-x-2" v-if="searchQuery === '' && data.length > 0">
      <Button @click="goToPage(1)" :disabled="currentPage === 1 || isLoading || !data.length" :class="[
        'p-button-outlined !px-3 !py-1.5 !font-medium',
        currentPage === 1
          ? '!cursor-not-allowed opacity-50'
          : '!cursor-pointer',
      ]" label="First" />
      <Button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1 || isLoading || !data.length" :class="[
        'p-button-outlined !px-3 !py-1.5 !font-medium',
        currentPage === 1
          ? '!cursor-not-allowed opacity-50'
          : '!cursor-pointer',
      ]" label="Previous" />
  
      <template v-for="page in displayedPages" :key="page">
        <span v-if="page === '...'" class="px-3 py-2 flex items-center !font-medium">...</span>
        <Button v-else @click="goToPage(page)" :disabled="isLoading || !data.length" :class="[
          currentPage === page
            ? 'p-button-primary !px-3 !py-1.5 !cursor-pointer !font-medium'
            : 'p-button-outlined !px-3 !py-1.5 !cursor-pointer !font-medium',
        ]" :label="page.toString()" />
      </template>
  
      <Button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages || isLoading || !data.length"
        :class="[
          'p-button-outlined !px-3 !py-1.5 !font-medium',
          currentPage === totalPages
            ? '!cursor-not-allowed opacity-50'
            : '!cursor-pointer',
        ]" label="Next" />
      <Button @click="goToPage(totalPages)" :disabled="currentPage === totalPages || isLoading || !data.length" :class="[
        'p-button-outlined !px-3 !py-1.5 !font-medium',
        currentPage === totalPages
          ? '!cursor-not-allowed opacity-50'
          : '!cursor-pointer',
      ]" label="Last" />
    </div>
  </template>
  
  <script>
  import apiURL from "@/services/apiURL";
  import socket from "@/services/socket";
  import axios from "axios";
  import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
  import { useRoute } from "vue-router";
  export default {
    props: [
      "limitedPerPage",
      "currentPage",
      "searchQuery",
      "isFilter",
      "createdBy",
    ],
    emit: [
      "onEmitDataFromPagination",
      "onEmitIsLoading",
      "onEmitCurrentPageIsLastRecord",
    ],
  
    setup(props, { emit }) {
      const route = useRoute();
      const totalPages = ref(1);
      const data = ref([]);
      const isLoading = ref(false);
      const limitedPerPage = ref(props.limitedPerPage || 1);
      const currentPage = ref(props.currentPage || 1);
      const searchQuery = ref(props.searchQuery || "");
      const populate = ref(null);
      let collectionName = "";
      const searchFieldsArray = ref(null);
      let dynamicCondition = [];
      const branchStore = useBranchStore();
      let sortOrder = "";
      let sortField = "";
  
      watch(
        () => branchStore.branchId,
        async () => {
          await fetchData();
        }
      );
  
      async function fetchData() {
        try {
          handleSetCollectionName(); // run this function to set collection name first
  
          // Escape special MongoDB characters in the search term
          let escapedSearchTerm = "";
          if (searchQuery.value) {
            escapedSearchTerm = searchQuery.value.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            );
          } else {
            escapedSearchTerm = "";
          }
          isLoading.value = true;
  
          const params = {
            collectionName: collectionName,
            pageSize: limitedPerPage.value,
            page: currentPage.value,
            searchFields: searchFieldsArray.value,
            populate: populate.value,
            searchTerm: escapedSearchTerm,
            sortField: sortField || "_id",
            sortOrder: sortOrder ? sortOrder : "asc",
            dynamicConditions: JSON.stringify(dynamicCondition),
          };
  
          console.log('Fetching data with params:', params);
          const response = await axios.get(
            `${apiURL}/pos-general/api/getPagination`,
            {
              params: params, // your query parameters
              // headers: {
              //     'Content-Type': 'application/json',
              //     'Authorization': `Bearer ${localStorage.getItem('token')}`
              // }
            }
          );
          console.log('API Response:', response.data);
  
          if (response.data.data.length > 0) {
            data.value = response.data.data;
            totalPages.value = response.data.pagination.totalPages;
          } else {
            data.value = [];
            totalPages.value = 1;
            setTimeout(() => {
              isLoading.value = false;
            }, 200);
          }
  
          setTimeout(() => {
            isLoading.value = false;
          }, 200);
  
          // console.log("data.value", data.value);
        } catch (error) {
          console.error("Error fetching data:", error);
          isLoading.value = false;
        }
      }
  
      const goToPage = async (page) => {
        currentPage.value = page;
        await fetchData();
      };
  
      const setupSocketListeners = () => {
        socket.off("dataUpdate");
        socket.off("serverLastRecordResponse");
  
        socket.on("dataUpdate", async (data) => {
          if (data.collection === collectionName) {
            console.log("Data update received:", data);
            await fetchData();
          }
        });
  
        socket.on("serverLastRecordResponse", (data) => {
          if (data.collection === collectionName) {
            goToPage(currentPage.value - 1);
          }
        });
      };
  
      onMounted(async () => {
        // await fetchUserbyID();
        await fetchData();
        setupSocketListeners();
      });
  
      onBeforeUnmount(() => {
        socket.off("dataUpdate");
        socket.off("serverLastRecordResponse");
      });
  
      watch(props, async () => {
        limitedPerPage.value = props.limitedPerPage || 1;
      });
  
      watch(limitedPerPage, async () => {
        currentPage.value = 1;
        await fetchData();
      });
  
      watch(
        isLoading,
        (newValue) => {
          emit("onEmitIsLoading", newValue);
        },
        { immediate: true }
      );
  
      // Update the watch to trigger search when searchQuery prop changes
      watch(
        () => props.searchQuery,
        async (newValue) => {
          data.value = [];
          totalPages.value = 1;
          currentPage.value = 1; // Reset to first page when search changes
          searchQuery.value = newValue;
  
          await fetchData(); // Fetch new data with search query
        },
        { immediate: true }
      );
  
      watch(
        () => props.isFilter,
        async (newValue) => {
          if (newValue === true) {
            data.value = [];
            totalPages.value = 1;
            currentPage.value = 1;
  
            dynamicCondition = [];
  
            if (props.createdBy) {
              // Add the createdBy condition
              dynamicCondition.push({
                field: "createdBy",
                operator: "==",
                value: props.createdBy,
              });
            }
  
            // Fetch data after applying the filter
            await fetchData();
          }
        },
        { immediate: true }
      );
  
      watch([data, currentPage], () => {
        if (data.value.length === 1 && currentPage.value > 1) {
          emit("onEmitCurrentPageIsLastRecord", currentPage.value);
        }
      });
  
      watch(data, () => {
        emit("onEmitDataFromPagination", data.value);
      });
  
      function handleSetCollectionName() {
  
        
        switch (route.path) {
          case "/":
            collectionName = "";
            searchFieldsArray.value = "name";
            break;
  
          
  
          // Add this default case to handle dynamic routes
          default:            
        }
      }
  
      const displayedPages = computed(() => {
        const totalPagesValue = totalPages.value;
        const currentPageValue = currentPage.value;
        const siblingCount = 1; // Number of siblings around the current page
        const maxVisiblePages = 5; // Max number of pages visible including boundaries and ellipses
  
        // Helper function to create a range of numbers
        const range = (start, end) => {
          const length = end - start + 1;
          return Array.from({ length }, (_, i) => start + i);
        };
  
        if (totalPagesValue <= maxVisiblePages) {
          // If total pages are less than or equal to max visible, show all pages
          return range(1, totalPagesValue);
        }
  
        const startPages = 1; // Always include the first page
        const endPages = totalPagesValue; // Always include the last page
  
        // Calculate siblings around the current page
        const siblingsStart = Math.max(currentPageValue - siblingCount, 2); // Minimum of 2 (to leave space for the first page)
        const siblingsEnd = Math.min(
          currentPageValue + siblingCount,
          totalPagesValue - 1
        ); // Maximum of totalPagesValue - 1 (to leave space for the last page)
  
        const shouldShowLeftEllipsis = siblingsStart > 2; // Ellipsis needed if there's a gap after the first page
        const shouldShowRightEllipsis = siblingsEnd < totalPagesValue - 1; // Ellipsis needed if there's a gap before the last page
  
        let pages = [startPages];
  
        if (shouldShowLeftEllipsis) {
          pages.push("...");
        }
  
        pages = [...pages, ...range(siblingsStart, siblingsEnd)];
  
        if (shouldShowRightEllipsis) {
          pages.push("...");
        }
  
        pages.push(endPages);
  
        return pages;
      });
  
      return {
        searchQuery,
        data,
        goToPage,
        totalPages,
        currentPage,
        displayedPages,
      };
    },
  };
  </script>
  
  <style></style>