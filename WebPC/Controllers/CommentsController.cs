using Bll;
using Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Utility;
using WebPC.Fillter;

namespace WebPC.Controllers
{
    /// <summary>
    /// 负责人：竺杨平
    /// </summary>
    public class CommentsController : BaseController
    {
        [Authoriz(Authorization.FakeCommView)]
        public ActionResult Index()
        {
            ViewBag.CommentsStatus = new SelectList(new Utility.SelectLists().GetCommentsStatus(), "Value", "Text");
            return View();
        }

        /// <summary>
        /// 查询总数
        /// </summary>
        /// <returns></returns>
        [Authoriz(Authorization.FakeCommView)]
        public ActionResult GetTotal(string keywords, int CommentsStatus = -1)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            CommentsBll bll = new CommentsBll();
            var data = bll.GetTotal(keywords, CommentsStatus, LoginUser.UserBasic.EnterpriseID);
            return Content(data.ToString());
        }

        /// <summary>
        /// 查询分页数据
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [Authoriz(Authorization.FakeCommView)]
        public ActionResult GetDataPager(string keywords, int CommentsStatus = -1, int orderby = -1, int pageIndex = 1, int pageSize = 10)
        {
            pageIndex = pageIndex == 0 ? 1 : pageIndex;
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            CommentsBll bll = new CommentsBll();
            var data = bll.GetPage(keywords, CommentsStatus, orderby, pageIndex, pageSize, LoginUser.UserBasic.EnterpriseID);
            return Content(JsonConvert.SerializeObject(data));
        }


        [Authoriz(Authorization.FakeCommEdit)]
        public ActionResult Create()
        {
            return View();
        }

        /// <summary>
        /// 新增自定义评价的提交action
        /// </summary>
        /// <param name="Model"></param>
        /// <returns></returns
        [Authoriz(Authorization.FakeCommEdit)]
        [HttpPost]
        public string Create(Comments Model)
        {
            //Bll实例化放action里面 为了不让每次都实例化 产生废代码
            CommentsBll bll = new CommentsBll();
            //控制器里直接返回Bll里的返回结果 不写任何逻辑代码
            //保存的企业ID从登录信息里面取 所以必须要在这里赋值 因为登录信息是在BaseController里的
            Model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            return bll.AddOrUpdate(Model);
        }


        /// <summary>
        /// 编辑显示视图
        /// </summary>
        /// <returns></returns>
        [Authoriz(Authorization.FakeCommEdit)]
        public ActionResult Edit(int id = 0)
        {
            CommentsBll bll = new CommentsBll();
            //控制器不要写业务逻辑 只需调用Bll写好的业务方法 
            //方便以后业务改了就不需要改控制器
            var model = bll.GetByID(id, LoginUser.UserBasic.EnterpriseID);
            return View(model);
        }

        /// <summary>
        /// 编辑操作
        /// </summary>
        /// <param name="Model"></param> 
        /// <returns></returns>
        [Authoriz(Authorization.FakeCommEdit)]
        [HttpPost]
        public ActionResult Edit(Comments Model)
        {
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            CommentsBll bll = new CommentsBll();
            //当前的企业信息是保存在登录Userlid
            //赋值当前的企业ID
            Model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            return Content(bll.AddOrUpdate(Model));
        }


        /// <summary>
        /// 屏蔽
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authoriz(Authorization.FakeCommDel)]
        [HttpPost]
        public ActionResult Shield(int id)
        {
            //返回结果用标准的ReturnData
            ReturnData<string> returnData = new ReturnData<string>();
            //Bll要在这里实例化 不要在action外面 避免生成很多废代码
            CommentsBll bll = new CommentsBll();
            return Content(bll.UpdateStatus(id, LoginUser.UserBasic.EnterpriseID));
        }
    }
}