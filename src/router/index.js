import { createRouter, createWebHistory } from 'vue-router';  // Vue 3에서 사용하는 방식
import MainPage from '@/components/MainPage.vue';
import UserLogin from '@/components/UserLogin.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MainPage
  },
  {
    path: '/login',
    name: 'Login',
    component: UserLogin
  }
];

const router = createRouter({
  history: createWebHistory(),  // Vue 3에서 사용하는 방식
  routes
});

export default router;
