/** 4 */
import Dashboard from "../components/admin/Dashboard";


const AdminRouteList =
[
   //dashboard Pages
   { path:'/admin', exact:true, name:'Admin' },
   { path:'/admin/dashboard', exact:true, name:'Dashboard', component:Dashboard },
  

   // { path:'/403', exact:true, name:'Page403' , component:Page403 },
   // { path:'/404', exact:true, name:'Page404' , component:Page404 },
];

export default AdminRouteList;
