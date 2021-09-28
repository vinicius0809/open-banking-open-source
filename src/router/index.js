import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/comparison",
    name: "Comparison",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Comparison.vue"),
  },
  {
    path: "/participant/:propParticipantId?",
    name: "Participant",
    component: () => import("../views/ParticipantDetails.vue"),
  },
  {
    path: "/participant/:propParticipantId?/authorizationServer/:propAuthorizationServerId?",
    name: "AuthorizationServer",
    component: () => import("../views/AuthorizationServerDetails.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
