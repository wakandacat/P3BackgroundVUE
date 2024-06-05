import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.mount('#app');

// Add class to body after Vue instance is mounted
document.body.classList.add('bodyClass');
