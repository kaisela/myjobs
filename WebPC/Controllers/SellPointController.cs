using Bll;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Model;
using Utility;
using WebPC.Fillter;

namespace WebPC.Controllers
{
    [Authoriz(Authorization.GoodsEdit)]
    public class SellPointController : BaseController
    {
        // GET: SellPoint
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 获取商品列表总数
        /// </summary>
        /// <param name="GName">商品名称</param>
        /// <param name="CId">类目ID</param>
        /// <param name="IsStatus">状态（有货/停售）</param>
        /// <param name="GId">可视分组ID</param>
        /// <param name="IsSales">上/下架</param>
        /// <returns></returns>
        // [Authoriz(Authorization.GoodsView)]
        public JsonResult GetAllCount(string GName = "")
        {
            SellPointBll bll = new SellPointBll();
            return Json(bll.GetAllCount(GName, LoginUser.UserBasic.EnterpriseID), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 获取商品列表
        /// </summary>
        /// <param name="GName">商品名称</param>
        /// <param name="CId">类目ID</param>
        /// <param name="IsStatus">状态（有货/停售）</param>
        /// <param name="GId">可视分组ID</param>
        /// <param name="IsSales">上/下架</param>
        /// <param name="PageIndex">页码（从1开始）</param>
        /// <param name="PageSize">每页大小</param>
        /// <returns></returns>
        // [Authoriz(Authorization.GoodsView)]
        public JsonResult GetList(string GName = "", int PageIndex = 1, int PageSize = 10)
        {
            if (PageIndex == 0) PageIndex = 1;
            SellPointBll bll = new SellPointBll();
            return Json(bll.GetSPList(GName,LoginUser.UserBasic.EnterpriseID,PageIndex, PageSize), JsonRequestBehavior.AllowGet);
        }
         /// <summary>
        ///批量删除
        /// </summary>
        /// <param name="id">id </param>
        /// <returns></returns>
        public JsonResult DelSP(string ids)
        {
            string[] id = ids.Split(',');
            SellPointBll bll = new SellPointBll();
            return Json(bll.DelSP(id), JsonRequestBehavior.AllowGet);
        }


             /// <summary>
        /// 添加/编辑卖点
        /// </summary>
        /// <param name="id">商品id</param>
        /// <returns></returns>
        public ActionResult Operate(long id = 0)
        {
            SellPoint list = new SellPoint();
            ViewBag.sg = new List<Hashtable>();
            if (id > 0)
            {
                SellPointBll bll = new SellPointBll();
               list=bll.GetObjectById(w => w.ID == id && w.EnterpriseID==LoginUser.UserBasic.EnterpriseID);
               if (list == null)
               {
                   Response.Redirect("/Login/Index");
                   return Content("此销售卖点不存在");
               } 
               SPJoinGBBll sg = new SPJoinGBBll();
               ViewBag.sg = sg.GetSGList(id);
            }
            return View(list);
        }
        /// <summary>
        ///显示卖点详情
        /// </summary>
        /// <param name="id">商品id</param>
        /// <returns></returns>
        public ActionResult ShowSellPoint(long id = 0)
        {
            SellPoint list = new SellPoint();
            ViewBag.sg = new List<Hashtable>();
            if (id > 0)
            {
                SellPointBll bll = new SellPointBll();
                list = bll.GetObjectById(w => w.ID == id && w.EnterpriseID == LoginUser.UserBasic.EnterpriseID);
                if (list == null)
                {
                    Response.Redirect("/Login/Index");
                    return Content("此销售卖点不存在");                
                }
                SPJoinGBBll sg = new SPJoinGBBll();
                ViewBag.sg = sg.GetSGList(id, LoginUser.UserBasic.EnterpriseID);
            }
            return View(list);
        }
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult OperateSave(Model.SellPoint model)
        {
            SellPointBll bll = new SellPointBll();
            //商品
            string hidGB = Request["hidGB"];         
            if (model.ID == 0)
            {
                model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
                bll.AddSP(hidGB.Split(','), model);
            }
            else
            {
                bll.UpdateSP(hidGB.Split(','), model);
               
            }
                return Json(new ReturnData<string>()
                {
                    Status = true
                });
        }
    }
}