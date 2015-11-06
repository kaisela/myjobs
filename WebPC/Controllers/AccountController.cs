using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace WebPC.Controllers
{
    public class AccountController : BaseController
    {
        // GET: Account
        public ActionResult AccountManage()
        {
            return View();
        }
    }
}