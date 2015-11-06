using Bll;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Utility;

namespace WebPC.Areas.AgentState.Controllers
{
    public class AgentPurchaseGoodsController : AgentStateBaseController
    {
        // GET: AgentState/AgentPurchaseGoods
        public ActionResult Index()
        {
            //商品类目(一级)
            GoodsClassBll gcbll = new GoodsClassBll();
            ViewBag.gClass = gcbll.GetGCList(0);
            return View();
        }

        /// <summary>
        /// <auth>徐柳</auth>
        /// 根据一级获取二级类目
        /// </summary>
        /// <param name="bid">父id</param>
        /// <returns></returns>
        public JsonResult GetGCList(int pid)
        {
            GoodsClassBll bll = new GoodsClassBll();
            return Json(bll.GetGCList(pid), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 获取商品列表总数
        /// </summary>
        /// <param name="GName">商品名称</param>
        /// <param name="CId">类目ID</param>
        /// <param name="PCId">一级类目ID</param>
        /// <param name="isSelect">是否选购：0：未选购，1：已选购</param>
        /// <returns></returns>
        public JsonResult GetAllCount(string GName="", int CId=0, int PCId=0, int IsSelect=0)
        {
            int cgid = 0;
            GoodsBasicBll bll = new GoodsBasicBll();
            return Json(bll.GetAllCountByAgent(GName, CId, PCId, AgentLoginUser.UserBasic.EnterpriseID, AgentLoginUser.RoleID, IsSelect, cgid), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 获取商品列表
        /// </summary>
        /// <param name="GName">商品名称</param>
        /// <param name="CId">类目ID</param>
        /// <param name="PCId">一级类目ID</param>
        /// <param name="isSelect">是否选购：0：未选购，1：已选购</param>
        /// <param name="PageIndex">页码（从1开始）</param>
        /// <param name="PageSize">每页大小</param>
        /// <returns></returns>
        public JsonResult GetList(string GName = "", int CId = 0, int PCId = 0, int IsSelect = 0, int PageIndex = 1, int PageSize = 10)
        {
            int cgid = 0;
            if (PageIndex == 0) PageIndex = 1;
            GoodsBasicBll bll = new GoodsBasicBll();
            return Json(bll.GetGBListByAgent(GName, CId, PCId, AgentLoginUser.UserBasic.EnterpriseID, AgentLoginUser.RoleID, IsSelect, cgid, PageIndex, PageSize), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 预览商品二维码
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public FileContentResult ReadByte(string id)
        {
            if (id != "")
            {
                string path = Server.MapPath("~/Files/QRcodeImage");
                string url = AgentLoginUser.UserBasic.EnterpriseID +"."+ ConstConfigBll.GetConfigByKey("domian");
                string showUrl = url + "/GoodsInfo/Index/" + id;
                byte[] img = ImageHelper.GetShowImgUrl(showUrl);
                string contentType = MimeMapping.GetMimeMapping("*.jpg");
                return File(img, contentType);
            }
            else
            {
                return null;
            }           
        }
        /// <summary>
        /// 代理商采购商品
        /// </summary>
        /// <param name="gbid"></param>
        /// <returns></returns>
        public JsonResult AddGoodsByGoodsBasic(string gbid)
        {
            if (gbid != "")
            {
                GoodsAgentBll bll = new GoodsAgentBll();
                bll.AddGoodsByGoodsBasic(gbid, AgentLoginUser.RoleID);
            }
            return Json(new ReturnData<string>()
                {
                    Status = true
                },JsonRequestBehavior.AllowGet);
        }
    }
}