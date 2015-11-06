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
    [Login(false)]
    public class MyHomeController : BaseController
    {
        //[Authoriz(Authorization.ChnCheck, Authorization.ChnCheckIn,Authorization.ChnDel)]
        public ActionResult Index()
        {
            //new RolePowerBll().tina();
            //new AreasBll().GetAll();
            //new AgentBll().search();
            //new goodsBll().add();
            return View();

            
            ViewBag.abcd = "111";

            FileUpload im = new FileUpload();
            #region 新建数据
            //Image img1 = System.Drawing.Image.FromFile("C:\\l_c0b6624ca85344feaba162befeb9cc9c.jpg");
            //MemoryStream ms1 = new MemoryStream();
            //byte[] imagedata1 = null;
            //img1.Save(ms1, System.Drawing.Imaging.ImageFormat.Jpeg);
            //imagedata1 = ms1.GetBuffer();

            //ImageFileBll bll = new ImageFileBll();
            //bll.Add(new ImageFile()
            //{
            //    ImageId = "LEKGJJXHI6",
            //    Creater = "",
            //    CreateTime = DateTime.Now,
            //    Ip = "",
            //    Description = "这是图片",
            //    Ext = ".jpg",
            //    ImageData = imagedata1,
            //    Path = "",
            //    ImageName = "西湖景区",
            //    ImageType = 1
            //});
            #endregion


            #region  public string[] PictureSave(PType ptype,string picname, byte[] picturebyte,bool exites =false)
            //Image img = System.Drawing.Image.FromFile("d:\\x_02de507f04a340a89fa25d334bfb3bce.jpg");
            //MemoryStream ms = new MemoryStream();
            //byte[] imagedata = null;
            //img.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
            //imagedata = ms.GetBuffer();
            //im.PictureSave(PType.goods, "ddddd.jpg", imagedata);
            #endregion
            
            #region  URL
            //im.PictureSave(PType.goods, new string[] { "http://imgs.fangtuwang.com/img1/upload/201502/007/381/l_472b493cc1f043c68b0e2bcd57b1592f.jpg", "http://imgs.fangtuwang.com/img2/upload/201503/942/606/l_9f23d355f92e4761a449db0422e671e1.jpg" });
            #endregion

            return View();
        }

        public string SavePath(HttpPostedFileBase file)
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add("渠道ID", "Id");
            dic.Add("渠道类型（必填）", "Type");
            dic.Add("渠道或者门店名称（必填）", "Name");
            dic.Add("所属代理商（必填）", "AgentID");
            dic.Add("所属省（必填）", "ProvinceID");
            dic.Add("所属市（必填）", "CityID");
            dic.Add("所属区/县（必填）", "CountryID");
            dic.Add("联系人（必填）", "Contact");
            dic.Add("注册手机号码（必填）", "Tel");
            DataTable dt = file.GetDataTable(dic);
            DataTable newDt = new ShopInfoBll().InsertShopInfoFromExcel(LoginUser.UserBasic.EnterpriseID, dt);

            long timer = DateTime.Now.Ticks;
            if (dt.Rows.Count > 0)
            {
                Session["loadFile"] = newDt;
                return new { status = false }.GetJson();
            }
            return new { status = true }.GetJson();
        }

        public void DownLoadFile()
        {
            StringBuilder strb = new StringBuilder();
            strb.Append(" <table align=\"center\" border='1px' style='border-collapse:collapse;table-layout:fixed;font-size:12px'> <tr>");

            DataTable dt = Session["loadFile"] as DataTable;
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
            Response.AppendHeader("Content-Disposition", "attachment;filename=出错数据.xls");
            Response.ContentEncoding = System.Text.Encoding.GetEncoding("GB2312");//设置输出流为简体中文   
            Response.ContentType = "application/vnd.xls";//设置输出文件类型为excel文件。     
            Response.Write(strb);
            Response.End();
        }


        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult RoleTest()
        {
            return View();
        }



       
        

    }
}