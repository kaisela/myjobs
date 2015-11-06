using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace Preview.plugin.form.handle
{
    /// <summary>
    /// formTest 的摘要说明
    /// </summary>
    public class formTest : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
           var age= context.Request["age"];
           if (age=="111")
            {
               throw new Exception("出现了异常");
            }
            if (age == "222")
            {
                context.Response.Write(JsonConvert.SerializeObject(new
                {
                    Status = false,
                    Message = "数据库执行失败，但它不是异常"
                }));
                context.Response.End();
            }
            else
            {
                context.Response.Write(JsonConvert.SerializeObject(new
                {
                    Status = true,
                    Data="成功从数据库读取了数据,时间:"+DateTime.Now.ToString()
                }));
                context.Response.End();
            }
           
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