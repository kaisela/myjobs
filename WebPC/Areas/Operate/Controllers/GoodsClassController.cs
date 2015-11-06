using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Bll;
using Model;
using WebPC.Controllers;
namespace WebPC.Areas.Operate.Controllers
{
    public class GoodsClassController : BaseController
    {
        GoodsClassBll bll = new GoodsClassBll();
        // GET: Operate/GoodsCategory
        public ActionResult Index()
        {
            ViewBag.List = bll.GetAllList();
            return View();
        }

        public ActionResult Add()
        {
            ViewBag.Parentid = bll.getPidList(0);
            return View();
        }

        [HttpPost]
        public int Add(GoodsClass model)
        {
            return bll.Add(model);
        }

        public string Edit(int ID,string CName)
        {
            return bll.Edit(ID,CName);
        }

        public ActionResult Merge(int ID,string CName,string Parentid)
        {
            ViewBag.CName = CName;
            ViewBag.pid = Parentid;
            ViewBag.list=  bll.GetAllListExceptSelf(ID);
            return View();
        }

        [HttpPost]
        public string Merge(int ID,  int Parentid,int MergeID)
        {
            return bll.Merge(ID, Parentid, MergeID);
        }

        /// <summary>
        /// 移动类目
        /// </summary>
        /// <param name="baseId">被移的类目ID</param>
        /// <param name="baseOrder">被移的类目排序</param>
        /// <param name="toId">被交换的类目ID,</param>
        /// <param name="toOrder">被交换的类目排序</param>
        /// <returns>json</returns>
        public string Move(int baseId, int baseSorting, int toId, int toSorting)
        {
            return bll.Move(baseId, baseSorting, toId, toSorting);
        }

        public JsonResult getPidList(int pid)
        {
            return Json(bll.getPidList(pid),JsonRequestBehavior.AllowGet);
        }

    }
}