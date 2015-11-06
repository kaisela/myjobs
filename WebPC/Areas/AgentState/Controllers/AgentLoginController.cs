using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Bll;
using Model;
using Utility;
using Utility.SMS;
using WebPC.Controllers;
using WebPC.Fillter;
using WebPC.Areas.AgentState.Fillter;
using YYYCommon.Encryption;

namespace WebPC.Areas.AgentState.Controllers
{
    [Authoriz(false)]
    [AgentLogin(false)]
    public class AgentLoginController : AgentStateBaseController
    {

        // GET: AgentLogin
        public ActionResult Index()
        {
            var model = new UserPC();
            if (Request.Cookies["agentremember"] != null)
            {
                if (Request.Cookies["agentremember"]["uname"] != "")
                {
                    model.UserName = Request.Cookies["agentremember"]["uname"];
                    model.PassWord = "********";
                }
            }

            //获取企业信息 用来显示logo等信息
            EnterpriseBll objEnterpriseBll = new EnterpriseBll();
            var enterprise = objEnterpriseBll.GetObjectById(o => o.ID == EnterpriseKey);
            if (enterprise == null) return HttpNotFound();
            ViewBag.Enterprise = enterprise;
            return View(model);
        }


        /// <summary>
        /// 登录action
        /// </summary>
        /// <param name="model">PC端用户Model</param>
        /// <param name="isAuto">是否记住用户名</param>
        /// <returns>登录结果</returns>
        [HttpPost]
        public ActionResult Login(UserPC model, bool isAuto = false)
        {
            ReturnData<string> ret = new ReturnData<string>();
            //Bll实例化放action里面 为了不让每次都实例化 产生废代码
            UserPCBll bll = new UserPCBll();
            //只要找得到记住的密码就去匹配记住的密码
            if (Request.Cookies["agentremember"] != null)
            {
                if (Request.Cookies["agentremember"]["uname"] != "" && model.PassWord == "********")
                {
                    model.Status = 99;
                    model.PassWord = Request.Cookies["agentremember"]["pwd"];
                }
            }
            //ReturnData 是值类型 不需要ref来赋值传递 当传入方法里时返回时还是带有值的
            // model.PCType = 2;
            //  model.PassWord = YYYCommon.Encryption.SimpleEncrypt.SaltMD5(model.PassWord);
            var user = bll.AgentLogin(ret, model, EnterpriseKey);
            if (user != null)
            {
                //登录成功了 才记住用户名和密码
                if (isAuto)
                {
                    Response.Cookies["agentremember"]["uname"] = user.UserName;
                    Response.Cookies["agentremember"]["pwd"] = Convert.ToBase64String(YYYCommon.Encryption.SymmetricEncryption.Encrypt(user.PassWord + "\r" + DateTime.Now.ToString()));
                    Response.Cookies["agentremember"].Expires = DateTime.Now.AddDays(7);

                }
                else
                {
                    Response.Cookies["agentremember"]["uname"] = "";
                }
                //保存登录信息
                Session["agentuser"] = user;
                //设置跳转路径
                Dictionary<string, object> Identify = new Dictionary<string, object>();
                Identify.Add("url", "/AgentState/AgentLogin/WellCome");
                ret.Identify = Identify;
            }
            return Content(ret.GetJson());
        }

        /// <summary>
        /// 注册代理商
        /// </summary>
        /// <param name="name">名称</param>
        /// <param name="pwd">密码</param>
        /// <param name="num">手机号码</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult FirstLogin(string name, string pwd, string num)
        {
            ReturnData<string> ret = new ReturnData<string>();
            AgentBll aBll = new AgentBll();
            UserBasicBll uBll = new UserBasicBll();
            UserPCBll pcBll = new UserPCBll();

            Agent aModel = aBll.GetModelByPhone(num);
            UserBasic uModel = new UserBasic();
            UserPC pcModel = new UserPC();

            uModel.NickName = name;
            uModel.UserType = 1;
            uModel.EnterpriseID = aModel.EnterpriseID;
            uModel.AddTime = DateTime.Now;
            long id = uBll.AddAndGetId(uModel);

            pcModel.UserBasicID = id;
            pcModel.PassWord = SimpleEncrypt.SaltMD5(pwd.Replace(" ", ""));
            pcModel.PCType = 2;
            pcModel.RoleID = aModel.ID;
            pcModel.Status = 0;
            pcModel.UserName = name;
            pcModel.AddTime = DateTime.Now;
            pcModel.AddUserBasicID = 0;
            ret = pcBll.AddUserPc(pcModel);
            if (ret.Status == true)
            {
                aModel.Status = 0;
                aBll.EditAgent(aModel);
                return Content(ret.Message);

            }
            return Content(ret.Message);
        }

        /// <summary>
        /// 验证手机号码
        /// </summary>
        /// <param name="num">手机号码</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult CheckNum(string num)
        {
            AgentBll bll = new AgentBll();
            EnterpriseBll eBll = new EnterpriseBll();


            Agent model = bll.GetModelByPhone(num);
            Enterprise emodel = eBll.GetModelById(model.EnterpriseID);
            if (model == null)
            {
                return Content("您所输入的手机号码不存在！请确认号码！");
            }
            if (model.Status != 1)
            {
                return Content("您所输入的手机号码不是待验证状态！请确认号码！");
            }
            ISMS test = new Sms();
            string checkNum = test.SendbyGSM(num, emodel.EName);
            return Content(checkNum);
        }




        /// <summary>
        /// 退出
        /// </summary>
        /// <param name="model"></param>
        /// <param name="isAuto"></param>
        /// <returns></returns>
        public ActionResult LoginOff(string param)
        {
            //清除用户session
            //string url = "/Login/" + param;
            Session.Remove("agentuser");
            //直接重定向到登录页
            //return Redirect(url);
            return RedirectToAction("Index");
        }

        public ActionResult WellCome()
        {
            return View();
        }



    }
}