using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Bll;
using Utility;
using Model;
using WebPC.Controllers;

namespace WebPC.Areas.Operate.Controllers
{
    public class AttributesController : BaseController
    {
        // GET: Operate/Attributes
        public ActionResult Index()
        {
            //一级类目
            GoodsClassBll bll = new GoodsClassBll();
            ViewBag.GClass = new SelectList(bll.GetList(w => w.Parentid == 0), "ID", "CName");
            //属性类型
            SelectLists sl = new SelectLists();
            ViewBag.AStatus = new SelectList(sl.GetAttrStatusN(), "Value", "Text");
            return View();
        }
        /// <summary>
        /// 获取属性名列表总数
        /// </summary>
        /// <returns></returns>
        // [Authoriz(Authorization.GoodsView)]
        public JsonResult GetAllCount(string aName="", int gcid=0, int status=-1)
        {
            AttributesBll bll = new AttributesBll();
            return Json(bll.GetAllCount(aName, gcid, status), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 获取属性名列表
        /// </summary>
        /// <param name="PageIndex">页码（从1开始）</param>
        /// <param name="PageSize">每页大小</param>
        /// <returns></returns>
        public JsonResult GetAList(string aName = "", int gcid = 0, int status = -1, int pageIndex=1, int pageSize=0)
        {
            if (pageIndex == 0) pageIndex = 1;
            AttributesBll bll = new AttributesBll();
            return Json(bll.GetAList(aName, gcid, status, pageIndex, pageSize), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 获取批量属性信息
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public JsonResult GetAttrByIds(string ids,int gcid)
        {
            string[] idstr = ids.Split(',');
            AttributesBll bll = new AttributesBll();
            return Json(bll.GetList(w => idstr.Contains(w.ID.ToString()) && w.GoodsClassID==gcid), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 合并属性名
        /// </summary>
        /// <param name="id"></param>
        /// <param name="ids"></param>
        /// <param name="gcid"></param>
        /// <returns></returns>
        public JsonResult CombineAttr(long id, string ids, int gcid)
        {
            string[] idstr = ids.Split(',');
            AttributesBll bll = new AttributesBll();
            return Json(bll.CombineAttr(id,ids,gcid), JsonRequestBehavior.AllowGet); 
        }
        /// <summary>
        /// 修改属性名
        /// </summary>
        /// <param name="id"></param>
        /// <param name="aname"></param>
        /// <returns></returns>
        public JsonResult Update(long id, string aname)
        {
            AttributesBll bll = new AttributesBll();
           int count=bll.Update(new Attributes { AName = aname }, x => new { x.AName }, x => x.ID == id);
         // bool statuss = (count > 0) ? true : false;
            return Json(new ReturnData<string>()
            {
                Status = true
            }, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 审核
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public JsonResult CheckAttr(long id)
        {
            AttributesBll bll = new AttributesBll();
            int count = bll.Update(new Attributes { Status = 0 }, x => new { x.Status }, x => x.ID == id);
            // bool statuss = (count > 0) ? true : false;
            return Json(new ReturnData<string>()
            {
                Status = true
            }, JsonRequestBehavior.AllowGet);
        }
        #region 属性值
        public ActionResult AttrValueIndex(long id=0)
        {
            AttributesBll bll = new AttributesBll();
            ViewBag.aid = id.ToString();
            ViewBag.aName= bll.GetObjectById(w => w.ID == id).AName;
            return View();
        }
        /// <summary>
        /// 获取属性值列表总数
        /// </summary>
        /// <returns></returns>
        // [Authoriz(Authorization.GoodsView)]
        public JsonResult GetAVAllCount(long aid)
        {
            AttrValueBll bll = new AttrValueBll();
            return Json(bll.GetAllCount(aid), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 获取属性值列表
        /// </summary>
        /// <param name="PageIndex">页码（从1开始）</param>
        /// <param name="PageSize">每页大小</param>
        /// <returns></returns>
        public JsonResult GetAVList(long aid = 0, int pageIndex = 1, int pageSize = 0)
        {
            if (pageIndex == 0) pageIndex = 1;
            AttrValueBll bll = new AttrValueBll();
            return Json(bll.GetAVList(aid, pageIndex, pageSize), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 获取批量属性值信息
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public JsonResult GetAVByIds(string ids, long aid)
        {
            string[] idstr = ids.Split(',');
            AttrValueBll bll = new AttrValueBll();
            return Json(bll.GetList(w => idstr.Contains(w.ID.ToString()) && w.AttributesID == aid), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 合并属性值
        /// </summary>
        /// <param name="id"></param>
        /// <param name="ids"></param>
        /// <param name="gcid"></param>
        /// <returns></returns>
        public JsonResult CombineAV(long id, string ids, int aid)
        {
            AttrValueBll bll = new AttrValueBll();
            return Json(bll.CombineAV(id, ids, aid), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 修改属性值
        /// </summary>
        /// <param name="id"></param>
        /// <param name="aname"></param>
        /// <returns></returns>
        public JsonResult UpdateAV(long id, string vname)
        {
            AttrValueBll bll = new AttrValueBll();
            int count = bll.Update(new AttrValue { VName = vname }, x => new { x.VName }, x => x.ID == id);
            // bool statuss = (count > 0) ? true : false;
            return Json(new ReturnData<string>()
            {
                Status = true
            }, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}