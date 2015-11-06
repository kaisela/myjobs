using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace Preview.plugin.autocomplete.handle
{
    /// <summary>
    /// search 的摘要说明
    /// </summary>
    public class search : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            var obj = new
            {
                data = "杭州",
                value = "hz"
            };
            var obj1 = new
            {
                data = "上海",
                value = "sz"
            };
            var obj2 = new
            {
                data = "北京",
                value = "bj"
            };
            var obj4 = new
            {
                data = "海宁",
                value = "hn"
            };
            var objList = new List<object>();
            objList.Add(obj);
            objList.Add(obj1);
            objList.Add(obj2);
            objList.Add(obj4);
            context.Response.Write(JsonConvert.SerializeObject(objList));
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}