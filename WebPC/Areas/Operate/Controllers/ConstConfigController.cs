using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Web;
using System.Web.Mvc;
using Bll;
using Model;
using WebPC.Controllers;

namespace WebPC.Areas.Operate.Controllers
{
    public class ConstConfigController : BaseController
    {
        ConstConfigBll bll=new ConstConfigBll();
        
        public ActionResult Index()
        {
            return View(bll.GetAllConfig());
        }

        [HttpPost]
        public ActionResult Add(string CKey, string CValue, string Remarks)
        {
            var count = bll.GetQueryCount(s => s.CKey == CKey);
            if (count>0)
            {
                return Content("Key不能重复！");
            }

            ConstConfig model = new ConstConfig();

            model.CKey = CKey;
            model.CValue = System.Text.Encoding.UTF8.GetBytes(CValue);
            model.Remarks = Remarks;


            bll.AddConfig(model);

            return Content("添加成功！");
        }

        [HttpPost]
        public ActionResult Edit(string CKey, string CValue, string Remarks)
        {
            //ConstConfig model = bll.GetObjectById(s => s.CKey == CKey);

            ConstConfig model = new ConstConfig();
            model.CKey = CKey;
            model.CValue = System.Text.Encoding.UTF8.GetBytes(CValue);
            model.Remarks = Remarks;
            bll.UploadConfig(model);

            return Content("修改成功！");;
        }
    }
}