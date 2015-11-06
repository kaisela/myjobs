using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebPC.Controllers;

namespace WebPC.Areas.Operate.Controllers
{
    public class HomeController : BaseController
    {
        // GET: Operate/Home
        public ActionResult Index()
        {
            return View();
        }
    }
}