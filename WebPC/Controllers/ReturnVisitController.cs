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
    public class ReturnVisitController : BaseController
    {
        [Authoriz(Authorization.OldCommView)]
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 查询总数
        /// </summary>
        /// <returns></returns>
        [Authoriz(Authorization.OldCommView)]
        public ActionResult GetTotal(string keywords)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            ReturnVisitBll bll = new ReturnVisitBll();
            var data = bll.GetQueryCount(whereExp: x => (string.IsNullOrWhiteSpace(keywords)
                || (x.GoodsName.Contains(keywords) || x.Consumer.Contains(keywords))) && x.EnterpriseID == LoginUser.UserBasic.EnterpriseID);
            return Content(data.ToString());
        }

        /// <summary>
        /// 查询分页数据
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [Authoriz(Authorization.OldCommView)]
        public ActionResult GetDataPager(string keywords, int orderby = -1, int pageIndex = 1, int pageSize = 10)
        {
            pageIndex = pageIndex == 0 ? 1 : pageIndex;
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            ReturnVisitBll bll = new ReturnVisitBll();
            var data = bll.GetPage(keywords, orderby, pageIndex, pageSize, LoginUser.UserBasic.EnterpriseID);
            return Content(JsonConvert.SerializeObject(data));
        }

        /// <summary>
        /// 新增显示视图
        /// </summary>
        /// <returns></returns>
        [Authoriz(Authorization.OldCommEdit)]
        public ActionResult Create()
        {
            ViewBag.VistType = new SelectLists().GetVistType();
            return View();
        }

        /// <summary>
        /// 新增操作
        /// </summary>
        /// <param name="Model"></param>
        /// <returns></returns>
        [Authoriz(Authorization.OldCommEdit)]
        [HttpPost]
        public ActionResult Create(ReturnVisit Model)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            ReturnVisitBll bll = new ReturnVisitBll();
            Model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            return Content(bll.AddOrUpdateReturnVisit(Model));
        }

        /// <summary>
        /// 编辑显示视图
        /// </summary>
        /// <returns></returns>
        [Authoriz(Authorization.OldCommEdit)]
        public ActionResult Edit(int id = 0)
        {
            ReturnVisitBll bll = new ReturnVisitBll();
            //控制器不要写业务逻辑 只需调用Bll写好的业务方法 
            //方便以后业务改了就不需要改控制器
            //查询数据时必须要带企业ID的参数
            var model = bll.GetByID(id, LoginUser.UserBasic.EnterpriseID);
            ViewBag.VistType = new SelectList(new SelectLists().GetVistType(), "Value", "Text", model.VistType);
            VistJoinGoodsBll objVistJoinGoodsBll = new VistJoinGoodsBll();
            ViewBag.VistJoinGoods = objVistJoinGoodsBll.GetListByReturnVisitID(id);
            return View(model);
        }

        /// <summary>
        /// 编辑操作
        /// </summary>
        /// <param name="Model"></param> 
        /// <returns></returns>
        [Authoriz(Authorization.OldCommEdit)]
        [HttpPost]
        public ActionResult Edit(ReturnVisit Model)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            ReturnVisitBll bll = new ReturnVisitBll();
            //当前的企业信息是保存在登录Userlid
            Model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            return Content(bll.AddOrUpdateReturnVisit(Model));
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authoriz(Authorization.OldCommDel)]
        [HttpPost]
        public ActionResult Delete(int id)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            ReturnVisitBll bll = new ReturnVisitBll();
            return Content(bll.Delete(id, LoginUser.UserBasic.EnterpriseID));
        }
    }
}