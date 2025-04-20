/** 4 */
import Page404 from "../components/Error/Page404";
import Home from "../components/frontend/Home/Home";
import EditProfile from "../components/frontend/Profile/EditProfile";
import Profile from "../components/frontend/Profile/Profile";

const FrontendRouteList =
[
    // Pages
    { path:'/', exact:true, name:'Home' , component:Home },
    { path:'/profile', exact:true, name:'Profile', component:Profile },
    { path:'/edit-profile/:id', exact:true, name:'EditProfile', component:EditProfile },
];

export default FrontendRouteList;
