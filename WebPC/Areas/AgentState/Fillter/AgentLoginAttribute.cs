using Bll;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Utility;

namespace WebPC.Areas.AgentState.Fillter
{
    public class AgentLoginAttribute : FilterAttribute, IActionFilter
    {
        private bool check = true;

        public void OnActionExecuted(ActionExecutedContext filterContext)
        {
            //执行action后执行这个方法 比如做操作日志
        }
        public AgentLoginAttribute()
        {

        }

        public AgentLoginAttribute(bool check)
        {
            this.check = check;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="filterContext"></param>

        public static string _host = ".yklay.net";//从数据库动态获取
        //public static string _host = ".yklay.com";//从数据库动态获取
        //public static string _host = ".kerlaii.com";
       
        //public static string _host = ".kerlaii.com";//从数据库动态获取

        public void OnActionExecuting(ActionExecutingContext filterContext)
        {
            bool isajax = filterContext.HttpContext.Request.IsAjaxRequest();
            UserPC user = filterContext.HttpContext.Session["agentuser"] as UserPC;

            string host = filterContext.HttpContext.Request.Url.Host;
            string key = host.Replace(_host, "");
            //本地调试，模拟e0001企业  opera
            if (host.ToLower() == "localhost") { key = "e0001"; }

            EnterpriseBll bll = new EnterpriseBll();
            string[] keys = bll.GetAllEnteriseKey();
             
            if (key =="opera" || !keys.Contains(key))
            {
                filterContext.Result = new HttpNotFoundResult();
                return;
                //没有该企业
            }
            filterContext.HttpContext.Session["enterpriseKey"] = key;
            if (check)
            {

                if (user == null)
                {
                    ReturnData<string> ret = new ReturnData<string>();
                    if (isajax)
                    {
                        ret.Status = false;
                        Dictionary<string, object> Identify = new Dictionary<string, object>();
                        Identify.Add("expired", true);
                        ret.Identify = Identify;

                        filterContext.Result = new ContentResult()
                        {
                            Content = ret.GetJson()
                        };
                        return;
                    }
                    //跳转页面
                    filterContext.Result = new ContentResult()
                    {
                        Content = "<script>window.top.location.href ='/AgentState/AgentLogin';</script>"
                    };
                    return ;

                }
                LogAdapter.Write(user.UserBasic.EnterpriseID+"     "+key, LogAdapter.LogMode.ERROR);
                //当前用户不是当前企业
                if (user.UserBasic.EnterpriseID != key)
                {
                    filterContext.Result = new ContentResult()
                    {
                        Content = "<script>window.top.location.href ='/AgentState/AgentLogin';</script>"
                    };
                    return;
                }

            }

        }
    }
}