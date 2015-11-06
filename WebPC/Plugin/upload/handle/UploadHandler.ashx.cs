using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace MeiliChang.Scripts.upload
{
    /// <summary>
    /// UploadHandler 的摘要说明
    /// </summary>
    public class UploadHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            var imgExts = new string[] { ".png", ".jpg" };
            var files = context.Request.Files;
            var datas=new List<object>();
            foreach (string key in files.Keys)
            {
                var file = files[key];
                var ext = file.FileName.Substring(file.FileName.LastIndexOf("."));
                var fileId = Guid.NewGuid().ToString();
                string path = System.IO.Path.Combine(context.Request.MapPath("~/files"), fileId + ext);
                file.SaveAs(path);
                var fr=new 
                {
                    FormKey = key,
                    FileKey = fileId,
                    Path = fileId + ext,
                    Ext=ext,
                    DisplayName = file.FileName,
                    IsImage = imgExts.Contains(ext)
                };
                datas.Add(fr);
            }
            context.Response.Write(JsonConvert.SerializeObject(datas));
            context.Response.End();
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