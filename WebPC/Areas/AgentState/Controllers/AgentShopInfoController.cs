using Bll;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebPC.Areas.AgentState.Controllers
{
    public class AgentShopInfoController : AgentStateBaseController
    {
        // GET: AgentState/AgentShopInfo
        public ActionResult Index()
        {
            Utility.SelectLists unSel = new Utility.SelectLists();
            ViewBag.ShopInfoStatus = new SelectList(unSel.GetAgent_ShopInfo(), "Value", "Text", -1);
            return View();
        }
        /// <summary>
        /// 代理商门店列表
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="shopName"></param>
        /// <param name="pId"></param>
        /// <param name="cId"></param>
        /// <param name="aId"></param>
        /// <param name="ChannelID"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="ShopInfoStatus"></param>
        /// <param name="rphone"></param>
        /// <returns></returns>
        public JsonResult GetList(string shopName = "", int pId = -1, int cId = -1, int aId = -1, int ChannelID = -1, int page = 1, int pageSize = 1, int ShopInfoStatus = -1, string rphone = "")
        {
            ShopInfoViewBll shopBll = new ShopInfoViewBll();
            string EnterpriseID = AgentLoginUser.UserBasic.EnterpriseID;
            return Json(shopBll.GetList(shopName, pId, cId, aId, ChannelID, page, pageSize, ShopInfoStatus, 2, EnterpriseID, 3, rphone, AgentLoginUser.RoleID), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 代理商门店数量
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="shopName"></param>
        /// <param name="pId"></param>
        /// <param name="cId"></param>
        /// <param name="aId"></param>
        /// <param name="ChannelID"></param>
        /// <param name="ShopInfoStatus"></param>
        /// <param name="rphone"></param>
        /// <returns></returns>
        public JsonResult GetListCount(string shopName = "", int pId = -1, int cId = -1, int aId = -1, int ChannelID = -1, int ShopInfoStatus = -1, string rphone = "")
        {
            ShopInfoViewBll shopBll = new ShopInfoViewBll();
            string EnterpriseID = AgentLoginUser.UserBasic.EnterpriseID;
            return Json(shopBll.GetListCount(shopName, pId, cId, aId, ChannelID, ShopInfoStatus, 2, EnterpriseID, 3, rphone, AgentLoginUser.RoleID), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 暂停，恢复
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="shopIdList"></param>
        /// <param name="Pd"></param>
        /// <returns></returns>
        public JsonResult Edit(int shopId, int Pd)
        {
            ShopInfoBll shopBll = new ShopInfoBll();
            int status1, status2;
            if (Pd == 1)
            {
                status1 = 2;
                status2 = 5;
            }
            else
            {
                status1 = 0;
                status2 = 0;
            }

            return Json(shopBll.Pause(status1, status2, shopId));
        }
        /// <summary>
        /// 门店编辑页面
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="model">直营店实例</param>
        /// <returns></returns>
        public ActionResult Update(int ID)
        {
            ShopInfoBll bll = new ShopInfoBll();
            return View(bll.GetModel(ID, AgentLoginUser.UserBasic.EnterpriseID, AgentLoginUser.RoleID));
        }
        /// <summary>
        /// 修改实体店
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="model">实体店model</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult UpdateAfter(ShopInfo model)
        {
            ShopInfoBll shopBll = new ShopInfoBll();
            model.EnterpriseID = AgentLoginUser.UserBasic.EnterpriseID;
            return Json(shopBll.Update(model));
        }
        /// <summary>
        /// 关闭代理商门店
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="shopId">直营店ID</param>
        /// <returns></returns>
        public JsonResult Delete(int shopId)
        {
            ShopInfoBll shopBll = new ShopInfoBll();
            int status1 = 3;
            int status2 = 6;
            return Json(shopBll.Pause(status1, status2, shopId));
        }
        /// <summary>
        /// 批量关闭直营店
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="shopIdList">直营店ID集合</param>
        /// <returns></returns>
        public JsonResult PauseDelete(string shopIdList)
        {
            ShopInfoBll shopBll = new ShopInfoBll();
            string[] shopIdLists = shopIdList.Split(',');
            int statusGuid = 3;
            int status = 6;
            return Json(shopBll.PauseDele(statusGuid, status, shopIdLists));
        }
        /// <summary>
        /// 弹出新增门店窗口
        /// 负责人：谢海荣
        /// </summary>
        /// <returns></returns>
        public ActionResult Create()
        {
            AreasBll abll = new AreasBll();
           // ViewBag.Province = new SelectList(abll.GetAll(), "ID", "AName");
            return View();
        }
        /// <summary>
        /// 新增门店
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult CreateAfter(ShopInfo model)
        {
            Utility.ReturnData<string> returnData = new Utility.ReturnData<string>();
            ShopInfoBll shopBll = new ShopInfoBll();
            //UserPC _model = CacheHelp.Get("user") as UserPC;
            model.Relation = 2;
            model.ContactPhone = "";
            model.Address = "";
            model.Range = "";
            model.shopIMG = "";
            model.WeixinMPID = 0;
            model.Remarks = "";
            model.AgentID = AgentLoginUser.RoleID;
            model.ContactTEL = "";
            model.Status = 1;
            model.ChannelGroupID = 0;
            model.ProvinceID = model.ProvinceID;
            model.CityID = model.CityID;
            model.CountyID = model.CountyID;
            model.EnterpriseID = AgentLoginUser.UserBasic.EnterpriseID;
            returnData = shopBll.Create(model);
            return Json(returnData);
        }
        /// <summary>
        /// 代理商门店详情页
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="model">model</param>
        /// <returns></returns>
        public ActionResult Details(int ShopId)
        {
            ShopInfoBll bll = new ShopInfoBll();
            int GetCount = Convert.ToInt32(bll.GetModeltCount(ShopId, AgentLoginUser.UserBasic.EnterpriseID, AgentLoginUser.RoleID));

            if (GetCount == 0)
            {
                return Content("<script>alert('不存在此门店信息！');history.go(-1)</script>");
            }
            else
            {
                ShopInfoView model = new ShopInfoView();
                model = bll.GetModel(ShopId, AgentLoginUser.UserBasic.EnterpriseID, AgentLoginUser.RoleID);
                return View(model);
            }
        }
    }
}