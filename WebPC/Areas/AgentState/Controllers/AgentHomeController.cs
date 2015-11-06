using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebPC.Controllers;

namespace WebPC.Areas.AgentState.Controllers
{
    public class AgentHomeController : AgentStateBaseController
    {
        // GET: AgentHome
        public ActionResult Index()
        {
            return View();
        }
    }
}