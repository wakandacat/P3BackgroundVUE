import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.mount('#app');

// Add class to body after Vue instance is mounted
document.body.classList.add('bodyClass');

//TO DEPLOY TO GITHUB PAGES
//'npm run build' on main branch to update dist folder
//'git add dist -f'
//'git commit -m "message"'
//'git subtree push --prefix dist origin pages-output' to migrate dist updates to pages-output branch which will rerun github action
