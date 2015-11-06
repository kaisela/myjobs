using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Utility;

namespace WebPC.Fillter
{
    public class ErrorAttribute : FilterAttribute, IExceptionFilter
    {
        private object returnMsg = null;
        private string viewName = null;

        public string msg = "{\"success\":false,\"msg\":\"数据处理失败\"}";
        private bool defaultMsg = false;
        public ErrorAttribute(bool DefaultMsg)
        {
            defaultMsg = DefaultMsg;
        }

        public ErrorAttribute()
        {
        }
        public ErrorAttribute(object ReturnMsg)
        {
            this.returnMsg = ReturnMsg;
        }
        public ErrorAttribute(string ViewName)
        {
            viewName = ViewName;
        }


        public void OnException(ExceptionContext filterContext)
        {
            //写日志
            string message = filterContext.Exception.ToString();
            


            //自定义反回值

            //反回视图
            if (viewName != null)
            {
                string controllerName = (string)filterContext.RouteData.Values["controller"];
                string actionName = (string)filterContext.RouteData.Values["action"];
                HandleErrorInfo model = new HandleErrorInfo(filterContext.Exception, controllerName, actionName);

                ViewResult ret = new ViewResult()
                {
                    ViewName = viewName,
                    //MasterName = "",//this.Master,
                    ViewData = new ViewDataDictionary<HandleErrorInfo>(model),
                    TempData = filterContext.Controller.TempData

                };
                filterContext.Result = ret;
            }
            else if (defaultMsg)            //返回string （默认的）
            {
                filterContext.Result = new ContentResult()
                {
                    Content = msg
                };
            }
            else if(returnMsg != null) //返回string （默认的）
            {
                filterContext.Result = new ContentResult()
                {
                    Content = returnMsg as string
                };
            }
            else  
            {
                filterContext.HttpContext.Response.Redirect("/Login/index");//跳转友好界面
            }
            filterContext.ExceptionHandled = true;//设置异常已经处理
        }
    }
}