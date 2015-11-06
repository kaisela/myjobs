using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Bll;
using Model;

namespace WebPC.Controllers
{
    public class EnterpriseLockController : BaseController
    {
        // GET: EnterpriseLock
        public ActionResult Index()
        {
            EnterpriseBll bll=new EnterpriseBll();

            Enterprise model = bll.GetModelById(LoginUser.UserBasic.EnterpriseID);

            return View(model);
        }
    }
}