using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Bll;
using Model;

namespace WebPC.Controllers
{
    public class AgentController : BaseController
    {
        // GET: Agent
        public ActionResult Index()
        {
            ChannelGroupBll chn = new ChannelGroupBll();
            Utility.SelectLists unSel=new Utility.SelectLists();

            IList<ChannelGroup> modelList = chn.getList(LoginUser.UserBasic.EnterpriseID);
            ViewBag.ChannelGroupID = new SelectList(modelList, "ID", "GroupName");
            ViewBag.ChannelID = new SelectList(modelList, "ID", "GroupName");
            ViewBag.ChannelPush = new SelectList(modelList, "ID", "GroupName");
            ViewBag.AgentStatus = new SelectList(unSel.GetAgent(), "Value", "Text",-1);
            return View();
        }
        /// <summary>
        /// 根据条件查询代理商列表
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="agentName"></param>
        /// <param name="pId"></param>
        /// <param name="cId"></param>
        /// <param name="aId"></param>
        /// <param name="channelGroupID"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public JsonResult GetList(string agentName = "", int pId = -1, int cId = -1, int aId = -1, int ChannelID = -1, int page = 1, int pageSize = 1, int AgentStatus = -1, string rphone = "")
        {
            AgentViewBll agentBll = new AgentViewBll();
            string EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            return Json(agentBll.getAgenView(agentName, pId, cId, aId, AgentStatus, ChannelID, EnterpriseID, page, pageSize, rphone), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 代理商详情页
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Details(int AgentId) {
            AgentBll agent = new AgentBll();

            return View(agent.getAgentModel(AgentId, LoginUser.UserBasic.EnterpriseID));
        }
        /// <summary>
        /// 根据条件查询代理商总条数
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="agentName"></param>
        /// <param name="pId"></param>
        /// <param name="cId"></param>
        /// <param name="aId"></param>
        /// <param name="channelGroupID"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public JsonResult GetCount(string agentName = "", int pId = -1, int cId = -1, int aId = -1, int ChannelID = -1, int AgentStatus = -1, string rphone = "")
        {
            AgentViewBll agentBll = new AgentViewBll();
            string EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            return Json(agentBll.getAgenViewCount(agentName, pId, cId, aId, AgentStatus, ChannelID, EnterpriseID, rphone), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 新增代理商
        /// </summary>
        /// <returns></returns>
        public ActionResult Agent_Create() {
            ChannelGroupBll chn = new ChannelGroupBll();

            IList<ChannelGroup> modelList = chn.getList(LoginUser.UserBasic.EnterpriseID);
            ViewBag.ChannelGroupID = new SelectList(modelList, "ID", "GroupName");
            return View();
        }
        /// <summary>
        /// 暂停，恢复方法
        /// 负责人：xhr
        /// </summary>
        /// <param name="pd"></param>
        /// <param name="shopId"></param>
        /// <returns></returns>
        public JsonResult Pause(int pd,int shopId) {
            int statusShop, statusAgent;
            AgentBll agentBll = new AgentBll();
            if (pd == 1) {
                statusShop = 6;
                statusAgent = 3;
            }
            else if (pd == 2)
            {
                statusShop = 5;
                statusAgent = 2;
            }
            else
            {
                statusShop = 0;
                statusAgent = 0;
            }
            return Json(agentBll.Pause(statusShop, statusAgent, shopId, LoginUser.UserBasic.EnterpriseID), JsonRequestBehavior.AllowGet);

        }
        /// <summary>
        /// 删除方法
        /// 负责人：xhr
        /// </summary>
        /// <param name="pd"></param>
        /// <param name="shopId"></param>
        /// <returns></returns>
        public JsonResult Delete(int pd, int shopId)
        {
            int statusShop = 0, statusAgent = 0;
            AgentBll agentBll = new AgentBll();
            if (pd == 1)
            {
                statusShop = 6;
                statusAgent = 3;
            }
            return Json(agentBll.Pause(statusShop, statusAgent, shopId, LoginUser.UserBasic.EnterpriseID), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 批量关闭代理商
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="AgenId"></param>
        /// <returns></returns>
        public JsonResult DeleteList(string AgenId)
        {
            AgentBll agenBll = new AgentBll();
            int statusShop = 6;
            int statusAgent = 3;
            string[] AgenIdLists = AgenId.Split(',');
            return Json(agenBll.DeleteList(statusShop, statusAgent, AgenIdLists, LoginUser.UserBasic.EnterpriseID));
        }
        /// <summary>
        /// 移动到渠道分组
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="ChannelGroupID"></param>
        /// <param name="AgenId"></param>
        /// <returns></returns>
        public JsonResult MobileChannel(int ChannelGroupID, string AgenId) {
            AgentBll agenBll = new AgentBll();
            string[] AgenIdLists = AgenId.Split(',');
            return Json(agenBll.MobileChannel(ChannelGroupID, AgenIdLists, LoginUser.UserBasic.EnterpriseID));
        }
        /// <summary>
        /// 新增代理商
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public JsonResult CreateAfter(Agent model)
        {
            AgentBll agenBll = new AgentBll();
            model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            model.ContactTEL = "";
            model.ContactPhone = "";
            model.Address = "";
            model.Range = "";
            if (model.Remarks == null) {
                model.Remarks = "";
            }
            return Json(agenBll.Create(model), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 跳转修改代理商
        /// 负责人：谢海荣
        /// </summary>
        /// <param name="model">修改model实例</param>
        /// <returns></returns>
        public ActionResult Edit(AgentView model)
        {
            ChannelGroupBll chn = new ChannelGroupBll();
            IList<ChannelGroup> modelList = chn.getList(LoginUser.UserBasic.EnterpriseID);
            ViewBag.ChannelGroupID = new SelectList(modelList, "ID", "GroupName");
            return View(model);
        }
        /// <summary>
        /// 修改代理商
        /// 负责人:谢海荣
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public JsonResult EditAfter(Agent model)
        {
            AgentBll agenBll = new AgentBll();
            if (model.Remarks == null)
            {
                model.Remarks = "";
            }
            model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;

            return Json(agenBll.Edit(model));
        }
        public JsonResult getCon(string Cid) {
            if (string.IsNullOrEmpty(Cid))
            {
                return Json("");
            }
            AreasBll abll = new AreasBll();
            return Json(abll.GetArear(Convert.ToInt32(Cid)).Children);
        }
    }
}