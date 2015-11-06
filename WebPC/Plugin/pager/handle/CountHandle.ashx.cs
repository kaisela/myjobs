using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace Preview.plugin.pager.handle
{
    /// <summary>
    /// PageHandle 的摘要说明
    /// </summary>
    public class CountHandle : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            var data = new {totalCount = TestData.GetList().Count};
            context.Response.Write(JsonConvert.SerializeObject(data));
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