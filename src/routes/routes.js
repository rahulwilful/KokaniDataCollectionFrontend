import DashboardLayout from "../layout/DashboardLayout.vue";
import Default from "../views/Default.vue";
import LoginView from "../views/Login.vue";
// GeneralViews
import NotFound from "../pages/NotFoundPage.vue";

// Admin pages
import Overview from "src/pages/Overview.vue";
import UserProfile from "src/pages/UserProfile.vue";
import TableList from "src/pages/TableList.vue";
import Typography from "src/pages/Typography.vue";
import Icons from "src/pages/Icons.vue";
import Maps from "src/pages/Maps.vue";
import Upgrade from "src/pages/Upgrade.vue";

import Login from "../pages/Login.vue";
import Signup from "../pages/Signup.vue";
import Home from "../pages/Home.vue";

import Dashboard from "../pages/Dashboard.vue";
import Users from "../pages/Users.vue";
import cretaeUser from "../pages/CreateUser.vue";
import changePassword from "../pages/changePassword.vue";
import editUser from "../pages/EditUser.vue";
import viewUser from "../pages/ViewUser.vue";
import TranslatedSentences from "../pages/TranslatedSentences.vue";
import MangageTranslators from "../pages/ManageTranslators.vue";
import AddTranslator from "../pages/AddTranslator.vue";
import EditTranslator from "../pages/EditTranslator.vue";
import SentencesByTranslator from "../pages/SentencesByTranslator.vue";
import SentenceById from "../pages/SentenceById.vue";
import NewTranslators from "../pages/NewTranslators.vue";
import StoppedTranslators from "../pages/StoppedTranslators.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/login",
  },
  {
    path: "/",
    component: DashboardLayout,
    children: [
      {
        path: "/dashboard",
        component: Dashboard,
      },
      {
        path: "/edit-translator/:id",
        name: "MangageTranslators",
        component: EditTranslator,
        props: true,
      },
      {
        path: "/new-translators",
        component: NewTranslators,
      },
      {
        path: "/stopped-translators",
        component: StoppedTranslators,
      },
      {
        path: "/sentence/:id",
        name: "TranslatedSentences",
        component: SentenceById,
        props: true,
      },
      {
        path: "/sentences-by-translator/:id",
        name: "MangageTranslators",
        component: SentencesByTranslator,
        props: true,
      },

      {
        path: "/add-translator",
        component: AddTranslator,
      },
      {
        path: "/manage-traslators",
        component: MangageTranslators,
      },
      {
        path: "/translated-sentences",
        component: TranslatedSentences,
      },
      {
        path: "/admin/user",
        component: UserProfile,
      },
      {
        path: "/users",
        component: Users,
      },
      {
        path: "/user/create",
        component: cretaeUser,
      },
      {
        path: "/user/change/password/:id",
        component: changePassword,
      },
      {
        path: "/user/edit/:id",
        component: editUser,
      },
      {
        path: "/user/view/:id",
        component: viewUser,
      },
    ],
  },
  {
    path: "/",
    component: Default,
    children: [
      {
        path: "/home",
        component: Home,
      },
    ],
  },
  {
    path: "/",
    component: LoginView,
    children: [
      {
        path: "/login",
        component: Login,
      },
    ],
  },

  { path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
