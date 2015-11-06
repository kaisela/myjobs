using Bll;
using Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Utility;
using WebPC.Fillter;

namespace WebPC.Controllers
{
    /// <summary>
    /// 负责人：竺杨平
    /// </summary>
    public class WeixinMPController : BaseController
    {
        [Authoriz(Authorization.HNYSJYView)]
        public ActionResult Index()
        {
            return View();
        }

        [Authoriz(Authorization.HNYSJYView)]
        public ActionResult WeixinMPList(string keywords)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            WeixinMPBll bll = new WeixinMPBll();
            var data = bll.GetAllList(keywords, LoginUser.UserBasic.EnterpriseID);
            return View(data);
        }

        [Authoriz(Authorization.HNYSJYView)]
        public ActionResult WeixinMPProvinceDetail(int WeixinMPID = 0, int ProvoiceID = 0)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            ShopInfoBll objShopInfoBll = new ShopInfoBll();
            var data = objShopInfoBll.GetShopCityCountOfProvince(WeixinMPID, ProvoiceID, LoginUser.UserBasic.EnterpriseID);
            return View(data);
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult CreateOfFirst()
        {
            return View();
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        [HttpPost]
        public ActionResult CreateOfFirst(WeixinMP Model)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            WeixinMPBll bll = new WeixinMPBll();
            //当前的企业信息是保存在登录Userlid
            Model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            return Content(bll.AddOfFirst(Model));
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult CreateOfSecond()
        {
            return View();
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        [HttpPost]
        public ActionResult CreateOfSecond(WeixinMP Model)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            WeixinMPBll bll = new WeixinMPBll();
            //当前的企业信息是保存在登录Userlid
            Model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            return Content(bll.AddOfSecond(Model));
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult CreateOfSecondSuccess(int id)
        {
            ViewBag.MPurl = ConstConfigBll.GetConfigByKey("MPurl");
            WeixinMPBll bll = new WeixinMPBll();
            return View(bll.GetByIDOfSample(id, LoginUser.UserBasic.EnterpriseID));
        }

        [Authoriz(Authorization.HNYSJYDel)]
        public ActionResult GetShopRelation(int id)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            WeixinMPBll bll = new WeixinMPBll();
            return Content(bll.GetShopRelation(id, LoginUser.UserBasic.EnterpriseID));
        }

        [Authoriz(Authorization.HNYSJYDel)]
        public ActionResult Delete(int id)
        {
            WeixinMPBll bll = new WeixinMPBll();
            return Content(bll.Delete(id, LoginUser.UserBasic.EnterpriseID));
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult EditOfFirst(int id)
        {
            WeixinMPBll bll = new WeixinMPBll();
            return View(bll.GetByIDOfSample(id, LoginUser.UserBasic.EnterpriseID));
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        [HttpPost]
        public ActionResult EditOfFirst(WeixinMP Model)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            WeixinMPBll bll = new WeixinMPBll();
            //当前的企业信息是保存在登录Userlid
            Model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            return Content(bll.UpdateOfFirst(Model));
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult EditOfSecond(int id)
        {
            WeixinMPBll bll = new WeixinMPBll();
            return View(bll.GetByIDOfSample(id, LoginUser.UserBasic.EnterpriseID));
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        [HttpPost]
        public ActionResult EditOfSecond(WeixinMP Model)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            WeixinMPBll bll = new WeixinMPBll();
            //当前的企业信息是保存在登录Userlid
            Model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            return Content(bll.UpdateOfSecond(Model));
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult EditOfSecondSuccess(int id)
        {
            ViewBag.MPurl = ConstConfigBll.GetConfigByKey("MPurl");
            WeixinMPBll bll = new WeixinMPBll();
            return View(bll.GetByIDOfSample(id, LoginUser.UserBasic.EnterpriseID));
        }

        /// <summary>
        /// 获取可分配的数量
        /// </summary>
        /// <param name="ID"></param>
        /// <param name="EnterpriseID"></param>
        /// <returns></returns>
        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult GetQRNumCan(int ID)
        {
            WeixinMPBll objWeixinMPBll = new WeixinMPBll();
            return Content(objWeixinMPBll.GetQRNumCan(ID, LoginUser.UserBasic.EnterpriseID).ToString());
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult BindEnterpriseShop(int id)
        {
            ViewBag.WeixinMPID = id.ToString();
            return View();
        }

        /// <summary>
        /// 获取没有分配过的直营店总数
        /// </summary>
        /// <returns></returns>
        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult GetNotWeixinMPTotal()
        {
            ShopInfoBll objShopInfoBll = new ShopInfoBll();
            return Content(objShopInfoBll.GetNotWeixinMPEnterpriseShopTotal(LoginUser.UserBasic.EnterpriseID).ToString());
        }

        /// <summary>
        /// 获取没有分配过的直营店
        /// </summary>
        /// <returns></returns>
        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult GetNotWeixinMP(int pageIndex, int pageSize)
        {
            ShopInfoBll objShopInfoBll = new ShopInfoBll();
            return Content(JsonConvert.SerializeObject(objShopInfoBll.GetNotWeixinMPEnterpriseShop(pageIndex, pageSize, LoginUser.UserBasic.EnterpriseID)));
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult BindAgent(int id)
        {
            ViewBag.WeixinMPID = id.ToString();
            return View();
        }

        ///// <summary>
        ///// 获取没有分配过的代理商总数
        ///// </summary>
        ///// <returns></returns>
        //[Authoriz(Authorization.HNYSJYEdit)]
        //public ActionResult GetNotWeixinMPAgentTotal()
        //{
        //    AgentBll objAgentBll = new AgentBll();
        //    return Content(objAgentBll.GetNotWeixinMPEnterpriseShopTotal(LoginUser.UserBasic.EnterpriseID).ToString());
        //}

        ///// <summary>
        ///// 获取没有分配过的代理商
        ///// </summary>
        ///// <returns></returns>
        //[Authoriz(Authorization.HNYSJYEdit)]
        //public ActionResult GetNotWeixinMPAgent(int pageIndex, int pageSize)
        //{
        //    AgentBll objAgentBll = new AgentBll();
        //    return Content(JsonConvert.SerializeObject(objAgentBll.GetNotWeixinMPEnterpriseShop(pageIndex, pageSize, LoginUser.UserBasic.EnterpriseID)));
        //}

        [Authoriz(Authorization.HNYSJYView)]
        public ActionResult Details(int id)
        {
            WeixinMPBll objWeixinMPBll = new WeixinMPBll();
            var model = objWeixinMPBll.GetByID(id, LoginUser.UserBasic.EnterpriseID);
            return View(model);
        }

        [Authoriz(Authorization.HNYSJYView)]
        public ActionResult DetailsGetTotal(int id)
        {
            ShopInfoBll objShopInfoBll = new ShopInfoBll();
            return Content(objShopInfoBll.GetWeixinMPShopTotal(id, LoginUser.UserBasic.EnterpriseID).ToString());
        }

        [Authoriz(Authorization.HNYSJYView)]
        public ActionResult DetailsGetDataPager(int pageIndex, int pageSize, int id)
        {
            ShopInfoBll objShopInfoBll = new ShopInfoBll();
            return Content(JsonConvert.SerializeObject(objShopInfoBll.GetWeixinMPShop(pageIndex, pageSize, id,
                LoginUser.UserBasic.EnterpriseID)));
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult EditShopQRNum(int id)
        {
            ShopInfoBll objShopInfoBll = new ShopInfoBll();
            var model = objShopInfoBll.GetByID(id, LoginUser.UserBasic.EnterpriseID);
            return View(model);
        }

        /// <summary>
        /// 修改渠道可分配二维数
        /// action 如果出现相同名称的 必须要用GET POST请求区分
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [Authoriz(Authorization.HNYSJYEdit)]
        [HttpPost]
        public ActionResult EditShopQRNum(Model.ShopInfo model)
        {
            WeixinMPBll objWeixinMPBll = new WeixinMPBll();
            return Content(objWeixinMPBll.EditShopQRNum(model, LoginUser.UserBasic.EnterpriseID));
        }

        /// <summary>
        /// 修改直营店二维码
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult EditShopQRNumBatch(int id, string shopID)
        {
            ShopInfoBll objShopInfoBll = new ShopInfoBll();
            var model = objShopInfoBll.GetNotWeixinMPListByIDStr(shopID, LoginUser.UserBasic.EnterpriseID);
            WeixinMPBll objWeixinMPBll = new WeixinMPBll();
            //总可分配数
            ViewBag.Total = objWeixinMPBll.GetQRNumCan(id, LoginUser.UserBasic.EnterpriseID);
            //当前微信公众号ID
            ViewBag.WeixinMPID = id;
            return View(model);
        }

        /// <summary>
        /// 修改直营店二维码
        /// action 如果出现相同名称的 必须要用GET POST请求区分
        /// 多个model提交 只能用string[] ID来分别获取
        /// </summary>
        /// <param name="ID"></param>
        /// <param name="QRNum"></param>
        /// <param name="WeixinMPID"></param>
        /// <returns></returns>
        [Authoriz(Authorization.HNYSJYEdit)]
        [HttpPost]
        public ActionResult EditShopQRNumBatch(int[] ID, int[] QRNum, int WeixinMPID)
        {
            WeixinMPBll objWeixinMPBll = new WeixinMPBll();
            return Content(objWeixinMPBll.EditShopQRNumBatch(ID, QRNum, WeixinMPID, LoginUser.UserBasic.EnterpriseID));
        }
    }
}