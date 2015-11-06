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
    public class PageHandle : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            var page=Int32.Parse(context.Request["page"]);
            var pageSize = Int32.Parse(context.Request["pageSize"]);
            var data=TestData.GeneralData(page, pageSize);
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

    public class TestData
    {
        public string Name { get; set; }
        public string Age { get; set; }

        public static List<TestData> GetList()
        {
            var list = new List<TestData>();
            for (int i = 0; i < 100; i++)
            {
                list.Add(new TestData()
                {
                    Name = "张三_" + i,
                    Age = i.ToString()
                });
            }
            return list;
        }

        public static List<TestData> GeneralData(int pageIndex,int pageSize)
        {
           
            //以上生成假数据

            var data = GetList().Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
            return data;
        }
    }
}