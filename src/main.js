import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { createPinia } from "pinia";
import "./tailwind.css";

// PrimeVue + styles
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import Aura from "@primeuix/themes/aura";
import { definePreset } from "@primeuix/themes";

// config font
import "./assets/font.css";

// config icon
import "@fortawesome/fontawesome-free/css/all.css";

import {
  Select,
  Button,
  OverlayPanel,
  Card,
  InputText,
  FloatLabel,
  DatePicker,
  Toast,
  Checkbox,
  InputNumber,
  Dialog,
  ToggleSwitch,
  Message,
  MultiSelect,
  Dropdown,
  Textarea,
  Calendar,
  Password,
} from "primevue";
import ToastService from "primevue/toastservice";

// Define your custom PrimeVue preset
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#EFF6FF", // very light blue
      100: "#DBEAFE", // soft blue tint
      200: "#BFDBFE", // light blue
      300: "#93C5FD", // softer medium blue
      400: "#60A5FA", // light vivid blue
      500: "#3B82F6", // main blue
      600: "#2563EB", // deeper blue
      700: "#1D4ED8", // dark blue
      800: "#1E40AF", // navy blue
      900: "#1E3A8A", // very dark navy
      950: "#0B1B3A", // almost black–navy
    },
    // primary: {
    //   50: "#ECFDF5", // very light mint
    //   100: "#D1FAE5", // pale green
    //   200: "#A7F3D0", // soft green
    //   300: "#6EE7B7", // light green
    //   400: "#34D399", // medium green
    //   500: "#10B981", // main green
    //   600: "#059669", // deep green
    //   700: "#047857", // darker green
    //   800: "#065F46", // dark green
    //   900: "#064E3B", // very dark green
    //   950: "#022C22", // darkest shade
    // },
  },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
// ✅ PrimeVue config must go before mount
app.use(PrimeVue, {
  theme: {
    preset: MyPreset, // Use the custom preset
    options: {
      prefix: "p",
      darkModeSelector: "light",
      cssLayer: false,
    },
  },
});

// Globle all components
app.component("Button", Button);
app.component("Select", Select);
app.component("OverlayPanel", OverlayPanel);
app.component("Card", Card);
app.component("InputText", InputText);
app.component("FloatLabel", FloatLabel);
app.component("DatePicker", DatePicker);
app.component("Calendar", Calendar);
app.component("Password", Password);
app.component("Toast", Toast);
app.component("Checkbox", Checkbox);
app.component("InputNumber", InputNumber);
app.component("Dialog", Dialog);
app.component("ToggleSwitch", ToggleSwitch);
app.component("Message", Message);
app.component("MultiSelect", MultiSelect);
app.component("Textarea", Textarea);
app.component("Dropdown", Dropdown);
app.use(PrimeVue);
app.use(ToastService);

app.mount("#app");
