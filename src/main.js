import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';

Vue.use(VueRouter);

const routes = [
	{path: '/goods', component: goods},
	{path: '/seller', component: seller},
	{path: '/ratings', component: ratings}
];

const router = new VueRouter({
	routes,
	linkActiveClass: 'active'
});

const app = new Vue({
	router,
	render: h => h(App)
}).$mount('#app');
router.replace('/goods');