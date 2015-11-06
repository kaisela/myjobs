using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Utility;

namespace WebPC.Fillter
{
    /// <summary>
    /// 权限验证
    /// </summary>
    public class AuthorizAttribute : FilterAttribute, IActionFilter
    {
        private bool check = true;

        private Authorization[] Autorizs;

        public void OnActionExecuted(ActionExecutedContext filterContext)
        {
            //执行action后执行这个方法 比如做操作日志
        }
        public AuthorizAttribute()
        {

        }
        public AuthorizAttribute(params Authorization[] _Autorizs)
        {
            this.Autorizs = _Autorizs;
        }


        public AuthorizAttribute(bool c)
        {
            this.check = c;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="filterContext"></param>
        public void OnActionExecuting(ActionExecutingContext filterContext)
        {
            return;
            ReturnData<string> returndata = new ReturnData<string>();

            UserPC user = filterContext.HttpContext.Session["user"] as UserPC;

            //string controllerName = (string)filterContext.RouteData.Values["controller"]; //control
            //string actionName = (string)filterContext.RouteData.Values["action"];         //action

            if (check)
            {
                if (user == null)
                {
                    //跳转页面
                    filterContext.HttpContext.Response.Redirect("/Login/index");
                    return;

                }
                //权限验证!
                bool hasCount = false;

                if (Autorizs == null)
                {
                    returndata.Status = false;
                    returndata.Message = "没有该权限!";
                    filterContext.Result = new ContentResult()
                    {
                        Content = returndata.GetJson()
                    };
                    return;
                }

                foreach (var val in Autorizs)
                {
                   
                    if (user.RolePowerList !=null && user.RolePowerList.Where(x => x.PowerID == val.GetDescriptionN(0)).Count() > 0)
                    {
                        hasCount = true;
                        break;
                    }
                }
                if (!hasCount)
                {
                    //验证失败后 调 用
                    returndata.Message = "没有该权限!";
                    filterContext.Result = new ContentResult()
                    {
                        Content = returndata.GetJson()
                    };
                    return;
                }
            }

        }
    }
}