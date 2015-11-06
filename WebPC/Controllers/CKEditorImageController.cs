using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebPC.Controllers
{
    public class CKEditorImageController : Controller
    {
        // GET: CKEditorImage
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ImageUpLoad() {
            //string callNum = Request.QueryString["CKEditorFuncNum"];
            //for (int i = 0; i < Request.Files.Count; i++)
            //{


            //    EnterpriseBLL.ImageFile fileOperation = new EnterpriseBLL.ImageFile();
            //    Model.ReturnData<string> returnData = fileOperation.UploadAndCreate(Request.Files[i], Utility.PType.goods);

            //    //string[] rt = (Encoding.UTF8.GetString(model.EImgUrl) == eImgUrl) ? new string[2] { "0", eImgUrl } : GetImgUrl.UpLoadImg(Request.Files[0]);

            //    if (!returnData.Status)
            //    {
            //        ModelState.AddModelError("EImgUrl", returnData.Message);
            //        return Content("<script>window.parent.CKEDITOR.tools.callFunction(" + callNum + ",''," + "'" + returnData.Message + "')</script>");
            //    }

            //    strFileName = Utility.StringHelp.GetImgUrl.GetImgAllUrl(returnData.Data);


            //    //strFileName = DateTime.Now.ToString("yyyyMMddHHmmssfff") + file.FileName;
            //    ////文件上传路径
            //    //strFilePath = Server.MapPath("/upload/") + strFileName;
            //    //file.SaveAs(strFilePath);
            //    //strFilePathUrl = "/upload/" + strFileName;
            //}
            //return Content("<script>window.parent.CKEDITOR.tools.callFunction(" + callNum + ",\"" + strFileName + "\")</script>");
            return View();
        }
    }
}