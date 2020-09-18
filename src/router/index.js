import Vue from 'vue'
import VueRouter from 'vue-router'


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
    component: () => import(/* webpackChunkName: "about" */ '../views/Recipes.vue')
  },
  {
    path: '/add',
    name: 'Add',
    component: () => import(/* webpackChunkName: "about" */ '../views/Add.vue')
  },

  {
    path: '/add-ingredient',
    name: 'AddIng',
    component: () => import(/* webpackChunkName: "about" */ '../views/AddIng.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
