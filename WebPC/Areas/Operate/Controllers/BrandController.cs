using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Model;
using Bll;
using Utility;
using WebPC.Controllers;
namespace WebPC.Areas.Operate.Controllers
{
    public class BrandController : BaseController
    {
        BrandBll bll = new BrandBll();
        // GET: Operate/Brand
        public ActionResult Index(string type, string EName = "", string BName = "", int pageIndex = 1, int pageSize = 10, int GoodsClassID = -1)
        {
            if (Request.IsAjaxRequest())
            {
                if (type.Equals("data"))
                {
                    return Json(bll.GetBrandIndexList(EName, BName, pageIndex, pageSize, GoodsClassID), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(bll.GetCount(EName, BName, GoodsClassID), JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return View();
            }
        }

        public ActionResult Add()
        {

            ViewBag.Enterprise = new EnterpriseBll().getIDAndEName();
            return View();
        }

        [HttpPost]
        public string Add(Brand model)
        {
            if (ModelState.IsValid) { }
            model.BIMG = model.BIMG.TrimEnd("_1".ToCharArray());
            model.AddTime = DateTime.Now;
           BrandBll bll = new BrandBll();
           return bll.Add(model, Request["CIds[]"]);
        }

        public ActionResult Edit(int ID)
        {
           BrandBll bll = new BrandBll();
            ViewBag.Enterprise = new EnterpriseBll().getIDAndEName();
            ViewBag.htBrandGC = bll.GetBrandGC(ID);
            Brand model = bll.GetByID(ID);
            ViewBag.BIMG = ImageHelper.GetImgUrl(model.BIMG);
            return View(model);
        }

        [HttpPost]
        public ActionResult Edit(Brand model)
        {
            //这样如果不行,还是写具体点更新那几个字段把
            if (model.BIMG!=null&&model.BIMG != "")
            {
                model.BIMG = model.BIMG.TrimEnd("_1".ToCharArray());
            }
           

            return Json(new BrandBll().UpdateBrand(model, Request["CIds[]"]));
        }

        public string Forbid(int ID)
        {
            return bll.UpdateStatus(ID,1);
        }

        public string Resume(int ID)
        {
            return bll.UpdateStatus(ID, 0);
        }

        public ActionResult Merge(int ID,string BName)
        {
            BrandBll bll = new BrandBll();
            ViewBag.BrandList = bll.GetEBListExceptSelf(ID,bll.GetByID(ID).EnterpriseID);
            return View();
        }

        [HttpPost]
        public ActionResult Merge(int ID, int NewID)
        {
            BrandBll bll = new BrandBll();
            return Json(bll.Merge(ID,NewID));
        }
    }
}