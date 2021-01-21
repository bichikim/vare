import VueRouter, {RouteConfig} from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home'),
  },
  {
    path: '/mutation',
    name: 'Mutation',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "mutation" */ '../views/Mutation'),
  },
]

export const router = new VueRouter({
  routes,
})
