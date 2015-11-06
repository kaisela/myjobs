using Bll;
using Model;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using Utility;
using WebPC.Fillter;

namespace WebPC.Controllers
{
    [Authoriz(false)]
    [Login(false)]
    public class LoginController : BaseController
    {
        public ActionResult Index()
        {
            var model = new UserPC();
            if (Request.Cookies["remember"] != null)
            {
                if (Request.Cookies["remember"]["uname"] != "")
                {
                    model.UserName = Request.Cookies["remember"]["uname"];
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
            if (Request.Cookies["remember"] != null)
            {
                if (Request.Cookies["remember"]["uname"] != "" && model.PassWord == "********")
                {
                    model.Status = 99;
                    model.PassWord = Request.Cookies["remember"]["pwd"];
                }
            }
            //ReturnData 是值类型 不需要ref来赋值传递 当传入方法里时返回时还是带有值的
            var user = bll.Login(ret, model, EnterpriseKey);
            if (user != null)
            {
                //登录成功了 才记住用户名和密码
                if (isAuto)
                {
                    Response.Cookies["remember"]["uname"] = user.UserName;
                    Response.Cookies["remember"]["pwd"] = Convert.ToBase64String(YYYCommon.Encryption.SymmetricEncryption.Encrypt(user.PassWord + "\r" + DateTime.Now.ToString()));
                    Response.Cookies["remember"].Expires = DateTime.Now.AddDays(7);

                }
                else
                {
                    Response.Cookies["remember"]["uname"] = "";
                }
                //保存登录信息
                Session["user"] = user;
                //设置跳转路径
                Dictionary<string, object> Identify = new Dictionary<string, object>();

                if (EnterpriseKey.ToLower() == "opera")
                {

                    Identify.Add("url", "/Operate/Areas/Index");
                }
                else
                {
                    //return RedirectToAction("WellCome");
                    Identify.Add("url", "/Login/Welcome");
                }
                ret.Identify = Identify;
            }
            return Content(ret.GetJson());
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
            Session.Remove("user");
            //直接重定向到登录页
            //return Redirect(url);
            return RedirectToAction("Index");
        }

        [Login(true)]
        public ActionResult Welcome()
        {
            return View();
        }
    }
}