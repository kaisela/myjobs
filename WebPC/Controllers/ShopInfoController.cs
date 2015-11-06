using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Bll;
using Model;
using WebPC.Fillter;
using Utility;
using Newtonsoft.Json;

namespace WebPC.Controllers
{
    public class ShopInfoController : BaseController
    {
        // GET: ShopInfo
        /// <summary>
        /// 直营店视图
        /// 负责人：谢海荣
        /// </summary>
        /// <returns></returns>
        public ActionResult Enterprise_Index(string shopNameValue="")
        {
            AreasBll abll = new AreasBll();
            ChannelGroupBll chn = new ChannelGroupBll();
            Utility.SelectLists unSel = new Utility.SelectLists();
            IList<ChannelGroup> modelList = chn.getList(LoginUser.UserBasic.EnterpriseID);

            ViewBag.shopName = shopNameValue;
            ViewBag.ChannelGroupID = new SelectList(modelList, "ID", "GroupName");
            ViewBag.ChannelID = new SelectList(modelList, "ID", "GroupName");
            ViewBag.ChannelPush = new SelectList(modelList, "ID", "GroupName");
            ViewBag.ShopInfoStatus = new SelectList(unSel.GetShopInfo(), "Value", "Text", -1);
            return View();
        }
        /// <summary>
        /// 渲染直营店新增视图
        /// 负责人：谢海荣
        /// </summary>
        /// <returns></returns>
        public ActionResult Enterprise_Create() {
            ChannelGroupBll chn = new ChannelGroupBll();

            IList<ChannelGroup> modelList = chn.getList(LoginUser.UserBasic.EnterpriseID);
            ViewBag.ChannelGroupID = new SelectList(modelList, "ID", "GroupName");
            return View();
        }
        /// <summary>
        /// 代理商门店管理
        /// 负责人：代理商列表
        /// </summary>
        /// <returns></returns>
        public ActionResult Agent_Index(int ID =0)
        {
            AreasBll abll = new AreasBll();
            ChannelGroupBll chn = new ChannelGroupBll();

            IList<ChannelGroup> modelList = chn.getList(LoginUser.UserBasic.EnterpriseID);

            ViewBag.ID = ID;

            ViewBag.ChannelGroupID = new SelectList(modelList, "ID", "GroupName");
            ViewBag.ChannelID = new SelectList(modelList, "ID", "GroupName");
            ViewBag.ChannelPush = new SelectList(modelList, "ID", "GroupName");

            return View();
        }
        /// <summary>
        /// 直营店分页查询
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="shopName">门店名称</param>
        /// <param name="pId"></param>
        /// <param name="cId"></param>
        /// <param name="aId"></param>
        /// <param name="channelGroupID"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public JsonResult GetList(string shopName = "", int pId = -1, int cId = -1, int aId = -1, int ChannelID = -1, int page = 1, int pageSize = 1, int ShopInfoStatus = -1, string rphone = "")
        {
            ShopInfoViewBll shopBll = new ShopInfoViewBll();
            string EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            return Json(shopBll.GetList(shopName, pId, cId, aId, ChannelID, page, pageSize, ShopInfoStatus, 1, EnterpriseID, 3, rphone, 0), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 代理商门店显示
        /// 负责人：xhr
        /// </summary>
        /// <param name="shopName"></param>
        /// <param name="pId"></param>
        /// <param name="cId"></param>
        /// <param name="aId"></param>
        /// <param name="channelGroupID"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="status"></param>
        /// <param name="statusXs"></param>
        /// <returns></returns>
        public JsonResult AgentGetList(string shopName = "", int pId = -1, int cId = -1, int aId = -1, int channelGroupID = -1, int page = 1, int pageSize = 1, int status = -1, int statusXs = 1, string rphone = "", int AgentID = 0)
        {
            ShopInfoViewBll shopBll = new ShopInfoViewBll();
            string EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            return Json(shopBll.GetList(shopName, pId, cId, aId, channelGroupID, page, pageSize, status, 2, EnterpriseID, statusXs, rphone, AgentID), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 代理商门店数量
        /// 负责人：xhr
        /// </summary>
        /// <param name="shopName"></param>
        /// <param name="pId"></param>
        /// <param name="cId"></param>
        /// <param name="aId"></param>
        /// <param name="channelGroupID"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="status"></param>
        /// <param name="statusXs"></param>
        /// <returns></returns>
        public JsonResult AgentGetListCount(string shopName = "", int pId = -1, int cId = -1, int aId = -1, int channelGroupID = -1, int page = 1, int pageSize = 1, int status = -1, int statusXs = 1, string rphone = "", int AgentID = 0)
        {
            ShopInfoViewBll shopBll = new ShopInfoViewBll();
            string EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            return Json(shopBll.GetListCount(shopName, pId, cId, aId, channelGroupID, status, 2, EnterpriseID, statusXs, rphone, AgentID), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 根据条件统计直营店条数
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="shopName"></param>
        /// <param name="pId"></param>
        /// <param name="cId"></param>
        /// <param name="aId"></param>
        /// <param name="channelGroupID"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public JsonResult GetListCount(string shopName = "", int pId = -1, int cId = -1, int aId = -1, int ChannelID = -1, int ShopInfoStatus = -1, string rphone = "")
        {
            ShopInfoViewBll shopBll = new ShopInfoViewBll();
            string EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            return Json(shopBll.GetListCount(shopName, pId, cId, aId, ChannelID, ShopInfoStatus, 1, EnterpriseID, 3, rphone, 0), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 暂停，关闭
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="shopIdList"></param>
        /// <param name="Pd"></param>
        /// <returns></returns>
        [Authoriz(Authorization.ChnClose)]
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
        /// 审核门店
        /// </summary>
        /// <param name="Remarks">审核备注</param>
        /// <param name="ShopId">门店ID</param>
        /// <returns></returns>
         public JsonResult ToExamine(string Remarks, int ShopId,int pd)
         {
             ShopInfoBll shopBll = new ShopInfoBll();

             int status;
             if (pd == 1)
             {
                 status = 2;
             }
             else
             {
                 status = 4;
             }
             return Json(shopBll.ToExamine(status, Remarks, ShopId));
         }
        /// <summary>
        /// 关闭直营店
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="shopId">直营店ID</param>
        /// <returns></returns>
        [Authoriz(Authorization.ChnDel)]
        public JsonResult Delete(int shopId)
        {
            ShopInfoBll shopBll = new ShopInfoBll();
            int status1 = 3;
            int status2 = 6;
            return Json(shopBll.Pause(status1, status2, shopId));
        }
        /// <summary>
        /// 批量移动到渠道分组
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="ChannelId">渠道分组ID</param>
        /// <param name="shopIdList">实体店ID集合</param>
        /// <returns></returns>
        public JsonResult MobileShop(int ChannelId, string shopIdList)
        {
            ShopInfoBll shopBll = new ShopInfoBll();
            string[] shopIdLists = shopIdList.Split(',');
            return Json(shopBll.Pause(ChannelId, shopIdLists));
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
        /// 直营店编辑页面
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="model">直营店实例</param>
        /// <returns></returns>
        public ActionResult Update(ShopInfoView model)
        {
            ChannelGroupBll chn = new ChannelGroupBll();
            ViewBag.ChannelGroupID = new SelectList(chn.getList(LoginUser.UserBasic.EnterpriseID), "ID", "GroupName");
            return View(model);
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
            model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            return Json(shopBll.Update(model));
        }
        /// <summary>
        /// 门店编辑页面
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public ActionResult EditAgentShop(ShopInfoView model)
        {
            return View(model);
        }
        /// <summary>
        /// 门店编辑确认页
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult EditAgentShopAfter(ShopInfo model)
        {
            ShopInfoBll shopBll = new ShopInfoBll();
            model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            return Json(shopBll.Update(model));
        }

        public ActionResult Create()
        {
            AreasBll abll = new AreasBll();
            ViewBag.Province = new SelectList(abll.GetAll(), "ID", "AName");
            return View();
        }

        // [Authoriz(Authorization.ChnEdit)]
        [HttpPost]
        public JsonResult CreateAfter(ShopInfo model)
        {
            Utility.ReturnData<string> returnData = new Utility.ReturnData<string>();
            ShopInfoBll shopBll = new ShopInfoBll();
            UserPC _model = CacheHelp.Get("user") as UserPC;
            model.Relation = 1;
            model.ContactPhone = "";
            model.Address = "";
            model.Range = "";
            model.shopIMG = "";
            model.WeixinMPID = 0;
            model.Remarks = "";
            model.AgentID = 0;
            model.ContactTEL = "";
            model.Status = 2;
            model.ProvinceID = model.ProvinceID;
            model.CityID = model.CityID;
            model.CountyID = model.CountyID;
            model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            returnData = shopBll.Create(model);
            return Json(returnData);
        }

        /// <summary>
        /// 用于输入框实体店名称关键字搜索
        /// 竺杨平添加
        /// </summary>
        /// <param name="q">关键字</param>
        /// <param name="limit">取前第几行</param>
        /// <param name="status">实体店状态</param>
        /// <returns></returns>
        public ActionResult GetShopName(string q, int limit = 20, int status = 0)
        {
            ShopInfoBll objShopInfoBll = new ShopInfoBll();
            return Content(JsonConvert.SerializeObject(objShopInfoBll.GetShopName(q, limit, status)));
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
            if (Convert.ToInt32(bll.GetModeltCount(ShopId, "e0001")) == 0)
            {
                return Content("<script>alert('不存在此门店');history.go(-1)</script>");
            }
            else {
                return View(bll.GetModel(ShopId, LoginUser.UserBasic.EnterpriseID));
            }
        }
        /// <summary>
        /// 代理商门店新增
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public ActionResult Agent_Create(string AgentName, int AgentID)
        {
            ViewBag.AgentName = AgentName;
            ViewBag.AgentID = AgentID;
            return View();
        }
        /// <summary>
        /// 代理商门店新增之后
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Agent_CreateAfter(ShopInfo model)
        {
            ShopInfoBll bll = new ShopInfoBll();

            model.Relation = 2;
            model.ContactPhone = "";
            model.Address = "";
            model.Range = "";
            model.shopIMG = "";
            model.WeixinMPID = 0;
            model.Remarks = "";
            model.ContactTEL = "";
            model.Status = 1;
            model.ProvinceID = model.ProvinceID;
            model.CityID = model.CityID;
            model.CountyID = model.CountyID;
            model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;

            return Json(bll.Create(model));
        }
        /// <summary>
        /// 代理商门店导入
        /// </summary>
        /// <returns></returns>
        public ActionResult Introduction()
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();

            dic.Add("渠道ID", "Id");
            dic.Add("渠道类型（必填）", "Type");
            dic.Add("渠道或者门店名称（必填）", "Name");
            dic.Add("所属代理商（必填）", "AgentID");
            dic.Add("所属省（必填）", "ProvinceID");
            dic.Add("所属市（必填）", "CityID");
            dic.Add("所属区/县（必填）", "CountryID");
            dic.Add("联系人（必填）", "Contact");
            dic.Add("注册手机号码（必填）", "Tel");
            System.Data.DataTable dt = null;

            System.Data.DataTable newDt = new ShopInfoBll().InsertShopInfoFromExcel(LoginUser.UserBasic.EnterpriseID, dt);

            long timer = DateTime.Now.Ticks;
            if (dt.Rows.Count > 0)
            {
                Session["loadFile"] = newDt;
                return Content(new { status = false }.GetJson());
            }
            return Content(new { status = true }.GetJson());
        }
    }
}