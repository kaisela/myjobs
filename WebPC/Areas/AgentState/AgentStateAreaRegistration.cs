using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebPC.Areas.AgentState
{
    public class AgentStateAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "AgentState";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "AgentState_default",
                "AgentState/{controller}/{action}/{id}",
                new { controller = "AgentHome", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}