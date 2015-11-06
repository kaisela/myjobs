using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Antlr.Runtime.Tree;
using Bll;
using Model;
using Utility;
using YYYCommon.Encryption;

namespace WebPC.Areas.AgentState.Controllers
{
    public class AgentInfoController : AgentStateBaseController
    {
        // GET: AgentState/AgentInfo
        public ActionResult Index()
        {
            AgentInfoViewBll bll=new AgentInfoViewBll();
            AgentInfoView model = bll.GetModel(AgentLoginUser.UserBasicID, AgentLoginUser.UserBasic.EnterpriseID);
            List<SelectListItem> list = new List<SelectListItem>();
            SelectListItem item1 = new SelectListItem();
            item1.Text = "男";
            item1.Value = "1";
            list.Add(item1);
            SelectListItem item3 = new SelectListItem();
            item3.Text = "女";
            item3.Value = "2";
            list.Add(item3);
            SelectListItem item5 = new SelectListItem();
            item5.Text = "保密";
            item5.Value = "0";
            list.Add(item5);
            ViewBag.Sex = new SelectList(list, "Value", "Text", model.Sex);
            
            return View(model);
        }

        [HttpPost]
        public ActionResult Index(AgentInfoView model)
        {
            ReturnData<string> ret=new ReturnData<string>();
            AgentInfoViewBll bll=new AgentInfoViewBll();
            ret=bll.EditAgent(model);
            return Json(ret);
        }


        [HttpPost]
        public ActionResult EditPwd(string oldpwd, string pwd)
        {
            UserPCBll bll = new UserPCBll();
            Utility.ReturnData<string> ret = new Utility.ReturnData<string>();
            long id = AgentLoginUser.UserBasicID;
            UserPC model = bll.GetModelById(id);
            string checkpwd = SimpleEncrypt.SaltMD5(oldpwd.Replace(" ", ""));
            if (model.PassWord != checkpwd)
            {
                return Content("原始密码不正确！");
            }
            model.PassWord = SimpleEncrypt.SaltMD5(pwd.Replace(" ", ""));
            bll.Update(model);

            return Content("修改成功！");



        }
    }
}