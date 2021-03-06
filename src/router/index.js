import Vue from 'vue'
import VueRouter from 'vue-router'
import Recipes from '../views/Recipes.vue'


Vue.use(VueRouter)

const routes = [

  {
    path: '/recipe/:recipe_slug',
    name: 'Recipe',
    component: () => import(/* webpackChunkName: "about" */ '../views/Recipe.vue')
  },
  {
    path: '/',
    name: 'Recipes',
    component: Recipes
  },
  {
    path: '/add',
    name: 'Add',
    component: () => import(/* webpackChunkName: "about" */ '../views/Add.vue')
  },

  {
    path: '/profil',
    name: 'Profil',
    component: () => import(/* webpackChunkName: "about" */ '../views/Profil.vue')
  },

  {
    path: '/add-ingredient',
    name: 'AddIng',
    component: () => import(/* webpackChunkName: "about" */ '../views/AddIng.vue')
  },
  {
    
    path: '/cart',
    name: 'Cart',
    component: () => import(/* webpackChunkName: "about" */ '../views/Cart.vue')
  },

  {
    
    path: '/weekly',
    name: 'Weekly',
    component: () => import(/* webpackChunkName: "about" */ '../views/Weekly.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
