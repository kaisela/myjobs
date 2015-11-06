using System.Web.Mvc;

namespace WebPC.Areas.Operate
{
    public class OperateAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Operate";
            }
        }
        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Operate_default",
                "Operate/{controller}/{action}/{id}",
                new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}