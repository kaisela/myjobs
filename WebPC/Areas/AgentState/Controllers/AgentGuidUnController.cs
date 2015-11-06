using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Bll;
using Model;
using WebPC.Controllers;

namespace WebPC.Areas.AgentState.Controllers
{
    public class AgentGuidUnController : AgentStateBaseController
    {
        // GET: AgentState/AgentGuidUn
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 导购列表
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="guidName">导购名称</param>
        /// <param name="ShopInfoID"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public JsonResult GetList(string guidName="",string ShopName="", string ShopInfoID="",int pageIndex=1,int pageSize=1)
        {
            GuidUnBll guBll = new GuidUnBll();

            return Json(guBll.GetList(guidName, ShopName, AgentLoginUser.UserBasic.EnterpriseID, ShopInfoID, AgentLoginUser.RoleID, pageIndex, pageSize), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 导购数量
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="guidName">导购名称</param>
        /// <param name="ShopInfoID"></param>
        /// <returns></returns>
        public JsonResult GetCount(string guidName = "", string ShopName = "", string ShopInfoID = "")
        {
            GuidUnBll guBll = new GuidUnBll();

            return Json(guBll.GetCount(guidName, ShopName, AgentLoginUser.UserBasic.EnterpriseID, ShopInfoID, AgentLoginUser.RoleID), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 新增导购
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="model">导购实例</param>
        /// <returns>返回新增导购视图</returns>
        public ActionResult Create(int ShopInfoID)
        {
            Utility.SelectLists unSel = new Utility.SelectLists();
            ViewBag.GuidType = new SelectList(unSel.GetGuidType(), "Value", "Text",-1);
            ViewBag.ShopInfoID = ShopInfoID;
            return View();
        }
       /// <summary>
       /// 新增导购
       /// 负责人：谢海荣
       /// </summary>
       /// <returns></returns>
       [HttpPost]
        public JsonResult Create(GuidUn model) {
            GuidUnBll guBll = new GuidUnBll();

            model.AgentID = (uint)AgentLoginUser.RoleID;
            model.EnterpriseID = AgentLoginUser.UserBasic.EnterpriseID;
            model.ContactPhone = "0";
            model.AddTime = DateTime.Now;
            model.Status = 1;
            return Json(guBll.DelCreateGuid(model), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 修改导购视图
        /// 负责人：谢海荣
        /// </summary>
        /// <returns></returns>
       public ActionResult Update(GuidUn model)
       {
           Utility.SelectLists unSel = new Utility.SelectLists();
           ViewBag.GuidType = new SelectList(unSel.GetGuidType(), "Value", "Text");
           ViewBag.GuidID = model.ID;
           return View(model);
       }
        /// <summary>
        /// 修改导购
        /// 负责人：谢海荣
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult UpdateAfter(GuidUn model)
        {
            GuidUnBll guBll = new GuidUnBll();

            return Json(guBll.DelCreateGuid(model));
        }
        /// <summary>
        /// 暂停，关闭导购
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="ID"></param>
        /// <param name="pd"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Operation(int ID,int pd)
        {
            int status;
            if (pd == 1)
            {
                status = 2;
            }
            else if (pd == 2)
            {
                status = 0;
            }
            else
            {
                status = 3;
            }
            GuidUnBll guBll = new GuidUnBll();

            return Json(guBll.Delete(ID, status));
        }
        /// <summary>
        /// 批量删除导购
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="ID"></param>
        /// <param name="pd"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult BatchOperation(string ID, int pd)
        {
            int status;
            if (pd == 1)
            {
                status = 2;
            }
            else
            {
                status = 3;
            }
            GuidUnBll guBll = new GuidUnBll();
            string[] IDs = ID.Split(',');
            return Json(guBll.Delete(IDs, status));
        }
        /// <summary>
        /// 导购详情
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="GuidId">导购ID</param>
        /// <returns></returns>
        public ActionResult Details(int GuidId)
        {
            GuidUnBll gbll = new GuidUnBll();
            string EnterpriseID = AgentLoginUser.UserBasic.EnterpriseID;

            if (gbll.GetModelCount(GuidId, EnterpriseID) == 0)
            {
                return Content("<script>alert('不存在此导购');history.go(-1)</script>");
            }
            else
            {
                return View(gbll.GetModel(GuidId, EnterpriseID));
            }
        }
    }
}