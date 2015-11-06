using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Bll;
using Utility;
using System.Collections;
using Model;
using WebPC.Fillter;
using Newtonsoft.Json;
using System.Text;
using WebPC.Controllers;

namespace WebPC.Areas.AgentState.Controllers
{
    public class AgentGoodsController : AgentStateBaseController
    {
        // GET: AgentState/AgentGoods
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 获取商品列表总数
        /// </summary>
        /// <param name="GName">商品名称</param>
        /// <param name="AId">代理商ID</param>
        /// <param name="IsSales">上/下架</param>
        /// <returns></returns>
        public JsonResult GetAllCount(string GName = "", int IsSales = 0)
        {
            GoodsAgentBll bll = new GoodsAgentBll();
            return Json(bll.GetAllCount(GName, AgentLoginUser.UserBasic.EnterpriseID, AgentLoginUser.RoleID, IsSales), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 获取商品列表
        /// </summary>
        /// <param name="GName">商品名称</param>
        /// <param name="AId">代理商ID</param>
        /// <param name="IsSales">上/下架</param>
        /// <param name="PageIndex">页码（从1开始）</param>
        /// <param name="PageSize">每页大小</param>
        /// <returns></returns>
        public JsonResult GetList(string GName = "", int IsSales = 0, int PageIndex = 1, int PageSize = 10)
        {
            if (PageIndex == 0) PageIndex = 1;
            GoodsAgentBll bll = new GoodsAgentBll();
            return Json(bll.GetGBList(GName, AgentLoginUser.UserBasic.EnterpriseID, AgentLoginUser.RoleID, IsSales, PageIndex, PageSize), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        ///单个/ 批量删除商品（逻辑）
        /// </summary>
        /// <param name="gbids">代理商商品id  以,分割</param>
        /// <returns></returns>
        public JsonResult UpdateStatus(string agids)
        {
            string[] agid = agids.Split(',');
            GoodsAgentBll bll = new GoodsAgentBll();
            return Json(bll.UpdateStatus(1, agid), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        ///批量上/下架
        /// </summary>
        /// <param name="status">上/下架</param>
        /// <param name="gbids">商品id  以,分割</param>
        /// <returns></returns>
        public JsonResult UpdateIsSale(int isSale, string gbids)
        {
            string[] gbid = gbids.Split(',');
            GoodsAgentBll bll = new GoodsAgentBll();
            return Json(bll.UpdateIsSale(isSale, gbid), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        ///上/下移
        /// </summary>
        /// <param name="gbid">商品id</param>
        /// <param name="sorting">当前排序位</param>
        /// <returns></returns>
        public JsonResult UpdateSorting(long sorting, long nextSorting)
        {
            GoodsAgentBll bll = new GoodsAgentBll();
            return Json(bll.UpdateSorting(sorting, nextSorting), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 修改单个商品
        /// </summary>
        /// <param name="gaid"></param>
        /// <param name="ptype"></param>
        /// <param name="price"></param>
        /// <param name="pMin"></param>
        /// <param name="pMax"></param>
        /// <returns></returns>
        public ActionResult EditGoodsAgent(long gaid)
        {
            GoodsAgentBll gabll=new GoodsAgentBll();
            var ga=gabll.GetArray(w=>w.ID==gaid,x=>new {x.GoodsBasicID,x.Price,x.RType});
            GoodsBasicBll bll = new GoodsBasicBll();
            var gb=bll.GetArray(w=>w.ID==ga[0].GoodsBasicID,x=>new {x.MaxPrice,x.MinPrice});
            GCSnapshotBll gcsbll = new GCSnapshotBll();
            var ges = gcsbll.GetArray(w => w.GoodsAgentID == gaid && w.Status == 0, x => new { x.AContent });
            ViewBag.gaid = gaid;
            ViewBag.ptype = ga[0].RType;
            ViewBag.price =ga[0].Price;
            ViewBag.pMin = gb[0].MinPrice;
            ViewBag.pMax =gb[0].MaxPrice;
            ViewBag.content = (ges.Count()<1) ? "" : ges[0].AContent;
            return View();
        }
        /// <summary>
        /// 修改价格与商品详情
        /// </summary>
        /// <param name="id"></param>
        /// <param name="price"></param>
        /// <param name="eContent"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateInput(false)]
        public JsonResult UpdateGoods(long hidid = 0, string txtPrice = "", string EContentEditor = "")
        {
            GoodsAgentBll bll = new GoodsAgentBll();
            bll.UpdateGoods(hidid, (txtPrice=="")?0:Convert.ToDecimal(txtPrice), EContentEditor);
            return Json(new ReturnData<string>()
            {
                Status = true,
                Data =hidid+","+txtPrice
            });
        }
        /// <summary>
        ///批量修改商品
        /// </summary>
        /// <param name="gaid"></param>
        /// <param name="ptype"></param>
        /// <param name="price"></param>
        /// <param name="pMin"></param>
        /// <param name="pMax"></param>
        /// <returns></returns>
        public ActionResult EditBatchGoodsAgent(string ids="",int isSale=0)
        {
            ViewBag.gaids = ids;
            ViewBag.isSales = new SelectList(SelectLists.GetGBIsSales(), "Value", "Text", isSale);
            return View();
        }
        /// <summary>
        /// 修改价格与商品详情
        /// </summary>
        /// <param name="id"></param>
        /// <param name="price"></param>
        /// <param name="eContent"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateInput(false)]
        public JsonResult UpdateBatchGoods(string hidids = "", string percent = "", int isSales=0, string EContentEditor = "")
        {
            GoodsAgentBll bll = new GoodsAgentBll();
            bll.UpdateBatchGoods(hidids, (percent == "") ? 0 : Convert.ToDouble(percent), isSales, EContentEditor);
            return Json(new ReturnData<string>()
            {
                Status = true,
                Data = ""
            });
        }
    }
}