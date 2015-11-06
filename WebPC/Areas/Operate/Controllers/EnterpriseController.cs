using Bll;
using Model;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Web.Mvc;
using Utility;
using WebPC.Controllers;
using WebPC.Fillter;
//using WebPC.Fillter;
namespace WebPC.Areas.Operate.Controllers
{
    public class EnterpriseController : BaseController
    {
        EnterpriseBll bll = new EnterpriseBll();
        // GET: Enterprise
        public ActionResult Index(string Name)
        {

            IList<Enterprise> list = bll.list(Name);
            ViewBag.List = list;

            return View();
        }


        public ActionResult Add()
        {
            ViewBag.ISLockChannel = new SelectLists().GetCustomSelect("0:锁定,1:不锁定");
            ViewBag.YesNo = new SelectLists().GetCustomSelect("0:是,1:否");
            ViewBag.ISPrice = new SelectLists().GetCustomSelect("0:开,1:关");
            return View();
        }

        //[Error(true)]
        [HttpPost]
        public string Add(Enterprise Model)
        {
            Model.Addtime = DateTime.Now;
            Model.EIMG = Model.EIMG.TrimEnd("_1".ToCharArray());
            EnterpriseBll bll = new EnterpriseBll();

            return bll.Add(Model);
        }

        public ActionResult Edit()
        {
            return View();
        }

        public string Pause(Enterprise Model)
        {
            Model.Status = 1;
            return bll.UpdateStatus(Model);

        }

        public string Close(Enterprise Model)
        {
            Model.Status = 2;
            return bll.UpdateStatus(Model);
        }

        public string Resume(Enterprise Model)
        {
            Model.Status = 0;
            return bll.UpdateStatus(Model);
        }

        [Authoriz(Authorization.HNYSJYView)]
        public ActionResult Details(string id)
        {
            ViewBag.EnterpriseID = id;
            return View();
        }

        #region 微信业务

        [Authoriz(Authorization.HNYSJYView)]
        public ActionResult WeixinMPList(string keywords, string EnterpriseID)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            WeixinMPBll bll = new WeixinMPBll();
            var data = bll.GetAllList(keywords, EnterpriseID);
            return View(data);
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult Create(string EnterpriseID)
        {
            ViewBag.EnterpriseID = EnterpriseID;
            return View();
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        [HttpPost]
        public ActionResult Create(WeixinMP Model)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            WeixinMPBll bll = new WeixinMPBll();
            return Content(bll.Create(Model));
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult CreateNext(int id, string EnterpriseID)
        {
            ViewBag.MPurl = ConstConfigBll.GetConfigByKey("MPurl");
            WeixinMPBll bll = new WeixinMPBll();
            return View(bll.GetByIDOfSample(id, EnterpriseID));
        }

        [Authoriz(Authorization.HNYSJYDel)]
        public ActionResult GetShopRelation(int id, string EnterpriseID)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            WeixinMPBll bll = new WeixinMPBll();
            return Content(bll.GetShopRelation(id, EnterpriseID));
        }

        [Authoriz(Authorization.HNYSJYDel)]
        public ActionResult Delete(int id, string EnterpriseID)
        {
            WeixinMPBll bll = new WeixinMPBll();
            return Content(bll.Delete(id, EnterpriseID));
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult EditWeixinMP(int id, string EnterpriseID)
        {
            WeixinMPBll bll = new WeixinMPBll();
            ViewBag.EnterpriseID = EnterpriseID;
            return View(bll.GetByIDOfSample(id, EnterpriseID));
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        [HttpPost]
        public ActionResult EditWeixinMP(WeixinMP Model)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            WeixinMPBll bll = new WeixinMPBll();
            return Content(bll.Edit(Model));
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult EditOfSecond(int id, string EnterpriseID)
        {
            WeixinMPBll bll = new WeixinMPBll();
            return View(bll.GetByIDOfSample(id, EnterpriseID));
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        [HttpPost]
        public ActionResult EditOfSecond(WeixinMP Model)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            WeixinMPBll bll = new WeixinMPBll();
            
            
            return Content(bll.UpdateOfSecond(Model));
        }

        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult EditOfSecondSuccess(int id, string EnterpriseID)
        {
            ViewBag.MPurl = ConstConfigBll.GetConfigByKey("MPurl");
            WeixinMPBll bll = new WeixinMPBll();
            return View(bll.GetByIDOfSample(id, EnterpriseID));
        }

        /// <summary>
        /// 获取可分配的数量
        /// </summary>
        /// <param name="ID"></param>
        /// <param name="EnterpriseID"></param>
        /// <returns></returns>
        [Authoriz(Authorization.HNYSJYEdit)]
        public ActionResult GetQRNumCan(int ID, string EnterpriseID)
        {
            WeixinMPBll objWeixinMPBll = new WeixinMPBll();
            return Content(objWeixinMPBll.GetQRNumCan(ID, EnterpriseID).ToString());
        }
        #endregion


        //[HttpPost]
        //public string Edit(Enterprise Model)
        //{
        //    EnterpriseBll bll = new EnterpriseBll();
        //    return bll.Edit(Model);
        //}


        //public string Delete(Enterprise Model)
        //{
        //    EnterpriseBll bll = new EnterpriseBll();
        //    return bll.Delete(Model);
        //}

    }
}