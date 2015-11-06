using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Bll;
using Model;
using Utility;

namespace WebPC.Controllers
{
    public class EnterpriseInfoController : BaseController
    {
        EnterpriseViewBll bll = new EnterpriseViewBll();
        EnterpriseBll ebll = new EnterpriseBll();
        /// <summary>
        /// 企业基本信息主页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            EnterpriseView model = bll.GetModelBy(LoginUser.UserBasic.EnterpriseID);
            if (model != null)
            {
                return View(model);
            }
            return View();

        }

        public ActionResult Edit(Enterprise model)
        {
            ReturnData<string> ret = new ReturnData<string>();
            Model.Enterprise check = ebll.GetModelById(model.ID);
            string img = model.EIMG;
            check.EIMG = img;
            check.TitleLogo = model.TitleLogo;
            check.Contact = model.Contact;
            check.ContactTel = model.ContactTel;
            check.AreasID = model.AreasID;
            check.Address = model.Address;
            ret = ebll.Update(check);
            if (ret.Status == true)
            {
                return Content(ret.Message);
            }
            return Content(ret.Message);
        }



    }
}