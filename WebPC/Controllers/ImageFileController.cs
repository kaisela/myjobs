using Bll;
using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Utility;
using WebPC.Fillter;

namespace WebPC.Controllers
{
    public class ImageFileController : BaseController
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="param">图片主键</param>
        /// <returns></returns>
        public ActionResult ShowImage(string param)
        {
            if (param.IndexOf("_") == -1) return Content("");
            FileUpload im = new FileUpload();
            byte[] imageByte = im.GetImage(param, () =>
            {
                ImageFileBll bll = new ImageFileBll();
                string name = param;
                name = name.Substring(0, param.IndexOf("_"));
                ImageFile file = bll.GetImage(name);
                if (file == null) return null;
                ImageState img = new ImageState();
                img.imageData = file.ImageData;
                img.imageName = file.ImageId;
                img.imageType = file.ImageType;
                return img;
            });
            if (imageByte == null) return Content("");//这里可以放默认图片
            return File(imageByte, "image/jpeg");
        }

        /// <summary>
        /// 上传图片
        /// </summary>
        /// <param name="p">图片类型</param>
        /// <param name="file">文件</param>
        /// <returns></returns>
        [Error(true)]
        public string ImageUpload(PType p, HttpPostedFileBase file)
        {

            new FileUpload().SaveFile(file);
            return "";

            if (file == null) return new { success = false, msg = "请选择图片" }.GetJson();
            string ext = file.FileName.Substring(file.FileName.LastIndexOf('.')+1, file.FileName.Length - file.FileName.LastIndexOf('.')-1);
            //BMP、JPG、JPEG、PNG、GIF
            string[] imageExt = { "BPM", "JPG", "JPEG", "PNG", "GIF","ICO" };
            if (!imageExt.Contains(ext.ToUpper())) return new { success = false, msg = "只能上传图片文件" }.GetJson();

            byte[] buffer = null;
            buffer = new byte[file.ContentLength];
            file.InputStream.Read(buffer, 0, file.ContentLength);

            string[] ret = new FileUpload().PictureSave(p, "", buffer);
            if(ret==null) return new {success=false,msg="图片上传失败"}.GetJson();
            return new { success = true,imageId=ret[0] }.GetJson();
        }


        public void DowlonExcel()
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("ic");
            dt.Columns.Add("ic1");
            dt.Columns.Add("ic2");
            dt.Rows.Add("1", "2", "3");
            dt.Rows.Add("1", "2", "3");
            dt.Rows.Add("1", "2", "3");
            CreateExcel(dt, "qqdet");
        }

        //普通形式的下载Excel（HTML格式的Excel）

        //dt当然是你一些的要导出的数据返回一个DataTable
        //fileName是自己定义的文件导出的名字
        protected void CreateExcel(DataTable dt, string fileName)
        {
            StringBuilder strb = new StringBuilder();
            strb.Append(" <table align=\"center\" border='1px' style='border-collapse:collapse;table-layout:fixed;font-size:12px'> <tr>");

            //写列标题    
            int columncount = dt.Columns.Count;
            for (int columi = 0; columi < columncount; columi++)
            {
                strb.Append(" <td> <b>" + dt.Columns[columi] + " </b> </td>");
            }
            strb.Append(" </tr>");
            //写数据    
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                strb.Append(" <tr>");
                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    strb.Append(" <td>" + dt.Rows[i][j].ToString() + " </td>");
                }
                strb.Append(" </tr>");
            }
            strb.Append(" </table>");


            Response.Clear();
            Response.Buffer = true;
            Response.Charset = "GB2312";
            Response.AppendHeader("Content-Disposition", "attachment;filename=" + fileName + ".xls");
            Response.ContentEncoding = System.Text.Encoding.GetEncoding("GB2312");//设置输出流为简体中文   
            Response.ContentType = "application/vnd.xls";//设置输出文件类型为excel文件。     
            Response.Write(strb);
            Response.End();
        }
    }
}