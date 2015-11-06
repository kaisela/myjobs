using Bll;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Utility;
using WebPC.Fillter;

namespace WebPC.Controllers
{
    public class LoadInController : BaseController
    {
        [Authoriz(Authorization.ChnCheckIn)]
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 导入
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        [Authoriz(Authorization.ChnCheckIn)]
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
            if (newDt.Rows.Count > 0)
            {
                Session["loadFile"] = newDt;
                return new { status = false }.GetJson();
            }
            return new { status = true }.GetJson();
        }

        /// <summary>
        /// 当导入失败后默认下载失败文档
        /// </summary>
        [Authoriz(Authorization.ChnCheckIn)]
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
            Response.ContentEncoding = System.Text.Encoding.GetEncoding("utf-8");//设置输出流为简体中文   
            Response.ContentType = "application/vnd.xls";//设置输出文件类型为excel文件。     
            Response.Write(strb);
            Response.End();
        }
    }
}