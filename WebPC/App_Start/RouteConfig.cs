using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace WebPC
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //routes.MapRoute(
            //      "ImageFile1",
            //      "ImageFile/{param}/jpg",
            //      new { controller = "ImageFile", action = "ShowImage", id = UrlParameter.Optional },
            //      new { param = @"([\w\W]*)" }
            //  );

         //   routes.MapRoute(
         //       "login",
         //       "Login/{param}/",
         //       new { controller = "Login", action = "Index", id = UrlParameter.Optional }
         //      , new { param = @"([\w\W]*)" }
         //  );
         //   routes.MapRoute(
         //      "logina",
         //      "Login/{param}/Login",
         //      new { controller = "Login", action = "Login", id = UrlParameter.Optional }
         //     , new { param = @"([\w\W]*)" }
         // );
         //   routes.MapRoute(
         //     "loginout",
         //     "Login/{param}/{action}",
         //     new { controller = "Login", id = UrlParameter.Optional }
         //    , new { param = @"([\w\W]*)" }
         //);

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Login", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
