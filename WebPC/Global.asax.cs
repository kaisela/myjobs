//using MongoDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Utility;

namespace WebPC
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            //MongoDbFactiory.start();
            AuthorizationGroup.setGroupList();

        }
        //protected void Session_Start(object sender, EventArgs e)
        //{
        //    Response.Cookies["LoginUser"].Domain = "myUser.com";

        //}
        //protected void Session_End(object sender, EventArgs e)
        //{

        //}
        protected void Application_Error(object sender, EventArgs e)
        {


            Exception ex = Server.GetLastError();
            ReturnData<string> ret = new ReturnData<string>();

            //if (HttpContext.Current.Server.GetLastError() is HttpRequestValidationException)
            //{
            //    ret.Status = false;
            //    ret.Message = "您输入的有危险HTML字符!";
            //    throw new Exception(ret.GetJson());
            //}
        }
    }
    
}
