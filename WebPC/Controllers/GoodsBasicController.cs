using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Bll;
using Utility;
using System.Collections;
using Model;
using WebPC.Fillter;
using Newtonsoft.Json;
using System.Text;


namespace WebPC.Controllers
{
    public class GoodsBasicController : BaseController
    {

        /// <summary>
        /// 仓库中的商品
        /// </summary>
        /// <returns></returns>
        [Authoriz(Authorization.GoodsView)]
        public ActionResult Index(int id = 0)
        {
            //有货状态
            SelectLists sList = new SelectLists();
            ViewBag.isNormal = sList.GetGBISNormal();
            //可视分组
            GoodsGroupBll ggBll = new GoodsGroupBll();
            ViewBag.gGroup = ggBll.GetGGList(LoginUser.UserBasic.EnterpriseID);
            //商品类目(一级)
            GoodsClassBll gcbll = new GoodsClassBll();
            ViewBag.gClass = gcbll.GetGCList(0);
            ViewBag.gIsSales = id;
            return View();
        }
        /// <summary>
        /// 添加/编辑商品
        /// </summary>
        /// <param name="id">商品id</param>
        /// <returns></returns>
        [Authoriz(Authorization.GoodsEdit)]
        public ActionResult Operate(int id = 0)
        {
            ViewBag.gbId = id;
            //价格区间
            ViewBag.isPrice = LoginUser.UserBasic.Enterprise.ISPrice;
            ViewBag.priceLower = LoginUser.UserBasic.Enterprise.PriceLower;
            ViewBag.priceUpper = LoginUser.UserBasic.Enterprise.PriceUpper;
            GoodsBasicBll bll = new GoodsBasicBll();
            GoodsGroupBll ggBll = new GoodsGroupBll();
            GoodsBasic list = new GoodsBasic();
            ViewBag.gAttr = new List<Hashtable>();
            ViewBag.pClass = 0;
            int gclassP;
            if (id != 0)
            {
                list = bll.GetModelByGBid(id, out gclassP, LoginUser.UserBasic.EnterpriseID);
                ViewBag.pClass = gclassP;
                if (list != null)
                {
                    //商品属性
                    AttributesBll gavBll = new AttributesBll();
                    ViewBag.gAttr = gavBll.GetListByGBid(id);
                    ////商品销售卖点
                    //SellPointBll spBll = new SellPointBll();
                    //list.SellPointList = spBll.GetListByGBid(id);
                    //商品可视分组
                    list.GoodsGroupList = ggBll.GetListByGBid(id);
                }
                else
                {
                    Response.Redirect("/Login/Index");
                    return Content("此商品不存在");
                }
            }
            //有货状态
            SelectLists sList = new SelectLists();
            ViewBag.ISNormal = new SelectList(sList.GetGBISNormal(), "value", "text", list.ISNormal);
            //价格模式
            ViewBag.RType = new SelectList(sList.GetGBRType(), "value", "text", list.RType);
            //可视分组
            ViewBag.gGroupList = ggBll.GetGGList(LoginUser.UserBasic.EnterpriseID);
            //所属品牌
            BrandBll bBll = new BrandBll();
            ViewBag.BrandID = new SelectList(bBll.GetEBList(LoginUser.UserBasic.EnterpriseID), "ID", "BName", list.BrandID);
            return View(list);
        }
        [HttpPost]
        [ValidateInput(false)]
        [Authoriz(Authorization.GoodsEdit)]
        public ActionResult OperateSave(Model.GoodsBasic model)
        {
            GESnapshotBll geBll = new GESnapshotBll();
            GESnapshot ges = geBll.GetGesModel(model.ID, model.GESnapshot.GName);
            if (ges == null)
            {
                string isSale = "";
                GoodsBasicBll bll = new GoodsBasicBll();
                //可视分组
                string hidGG = Request["hidGG"];
                //属性规格
                string hidGAV = HttpUtility.HtmlDecode(Request["hidGAV"]);
                int gcPid = int.Parse(Request["gClassP"]);
                int gcid = int.Parse(Request["gClass"]);
                Decimal lowerP = Decimal.Parse(Request["txtPriceLower"]);
                Decimal upperP = Decimal.Parse(Request["txtPriceUpper"]);
                string GEImg = Request["hidGEImg"];
                model.GoodsClassID = gcid;
                if (model.RType == 2)
                {
                    model.MinPrice = 0;
                    model.MaxPrice = 0;
                }
                else
                {
                    model.MinPrice = lowerP;
                    model.MaxPrice = upperP;
                }
                model.BarCode = (model.BarCode == null) ? "" : model.BarCode;
                model.GModel = (model.GModel == null) ? "" : model.GModel;
                model.SaleNum = (model.SaleNum == null) ? 0 : model.SaleNum;
                model.CommentNum = (model.CommentNum == null) ? 0 : model.CommentNum;
                List<Hashtable> strGAV = JsonConvert.DeserializeObject<List<Hashtable>>(hidGAV);
                if (model.ID == 0)
                {
                    isSale = "1";
                    model.IsSale = 1;
                    model.Status = 0;
                    model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
                    model.AddTime = DateTime.Now;
                    model.GESnapshot.IMG = GEImg;
                    bll.AddGoods(model, gcPid, hidGG.Split(','), strGAV);
                }
                else
                {
                    int gcp = 0;
                    GoodsBasic updateModel = bll.GetModelByGBid(model.ID, out gcp, LoginUser.UserBasic.EnterpriseID);
                    isSale = updateModel.IsSale.ToString();
                    model.IsSale = updateModel.IsSale;
                    model.Status = updateModel.Status;
                    model.EnterpriseID = updateModel.EnterpriseID;
                    model.AddTime = updateModel.AddTime;
                    model.Sorting = updateModel.Sorting;
                    model.GESnapshot.AddTime = updateModel.GESnapshot.AddTime;
                    model.GESnapshot.Status = updateModel.GESnapshot.Status;
                    model.GESnapshot.GoodsBasicID = updateModel.GESnapshot.GoodsBasicID;
                    model.GESnapshot.EnterpriseID = updateModel.GESnapshot.EnterpriseID;
                    model.GESnapshot.IMG = GEImg;
                    isSale = model.IsSale.ToString();
                    bll.UpdateGoods(model, gcPid, hidGG.Split(','), strGAV);
                }
                return Json(new ReturnData<string>()
                {
                    Status = true,
                    Data = isSale
                });
            }
            else
            {
                return Json(new ReturnData<string>()
                {
                    Status = false,
                    Message = "该商品名称已被占用"
                });
            }

        }


        /// <summary>
        /// 获取商品列表总数
        /// </summary>
        /// <param name="GName">商品名称</param>
        /// <param name="CId">类目ID</param>
        /// <param name="IsStatus">状态（有货/停售）</param>
        /// <param name="GId">可视分组ID</param>
        /// <param name="IsSales">上/下架</param>
        /// <returns></returns>
        [Authoriz(Authorization.GoodsView)]
        public JsonResult GetAllCount(string GName = "", int PCid = 0, int CId = 0, int IsStatus = 0, int GId = 0, int IsSales = 0)
        {
            GoodsBasicBll bll = new GoodsBasicBll();
            return Json(bll.GetAllCount(GName, CId, PCid, IsStatus, LoginUser.UserBasic.EnterpriseID, GId, IsSales), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 获取商品列表
        /// </summary>
        /// <param name="GName">商品名称</param>
        /// <param name="CId">类目ID</param>
        /// <param name="IsStatus">状态（有货/停售）</param>
        /// <param name="GId">可视分组ID</param>
        /// <param name="IsSales">上/下架</param>
        /// <param name="PageIndex">页码（从1开始）</param>
        /// <param name="PageSize">每页大小</param>
        /// <returns></returns>
        [Authoriz(Authorization.GoodsView)]
        public JsonResult GetList(string GName = "", int PCid = 0, int CId = 0, int IsStatus = 0, int GId = 0, int IsSales = 0, int PageIndex = 1, int PageSize = 10)
        {
            if (PageIndex == 0) PageIndex = 1;
            GoodsBasicBll bll = new GoodsBasicBll();
            return Json(bll.GetGBList(GName, CId, PCid, IsStatus, LoginUser.UserBasic.EnterpriseID, GId, IsSales, PageIndex, PageSize), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 批量移动到可视分组
        /// </summary>
        /// <param name="id">可视分组id</param>
        /// <param name="gbids">商品id  以,分割</param>
        /// <returns></returns>
        [Authoriz(Authorization.GoodsEdit)]
        public JsonResult UpdateGoodsGroupId(int id, string gbids)
        {
            string[] gbid = gbids.Split(',');
            GoodsJoinGroupBll bll = new GoodsJoinGroupBll();
            return Json(bll.UpGoodsGroupID(id, gbid), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        ///单个/ 批量删除商品（逻辑）
        /// </summary>
        /// <param name="gbids">商品id  以,分割</param>
        /// <returns></returns>
        [Authoriz(Authorization.GoodsDel)]
        public JsonResult UpdateStatus(string gbids)
        {
            string[] gbid = gbids.Split(',');
            GoodsBasicBll bll = new GoodsBasicBll();
            return Json(bll.UpdateStatus(1, gbid), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        ///批量上/下架
        /// </summary>
        /// <param name="status">上/下架</param>
        /// <param name="gbids">商品id  以,分割</param>
        /// <returns></returns>
        [Authoriz(Authorization.GoodsEdit)]
        public JsonResult UpdateIsSale(int isSale, string gbids)
        {
            string[] gbid = gbids.Split(',');
            GoodsBasicBll bll = new GoodsBasicBll();
            return Json(bll.UpdateIsSale(isSale, gbid), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        ///上/下移
        /// </summary>
        /// <param name="gbid">商品id</param>
        /// <param name="sorting">当前排序位</param>
        /// <returns></returns>
        [Authoriz(Authorization.GoodsEdit)]
        public JsonResult UpdateSorting(long sorting, long nextSorting)
        {
            GoodsBasicBll bll = new GoodsBasicBll();
            return Json(bll.UpdateSorting(sorting, nextSorting), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsBasicEval()
        {
            return View();
        }

        /// <summary>
        /// 选择商品页
        /// 现在选择商品后 不能包含已经选择过的商品
        /// </summary>
        /// <param name="GoodsBasicIDs">已经选择过的商品ID</param>
        /// <returns></returns>
        public ActionResult AutoGoodsBasic(string GoodsBasicIDs = "")
        {
            ViewBag.GoodsGroup = new GoodsGroupBll().GetGGList(LoginUser.UserBasic.EnterpriseID);
            ViewBag.GoodsBasicIDs = GoodsBasicIDs;
            return View();
        }

        /// <summary>
        /// 选择商品页的总数
        /// </summary>
        /// <param name="GoodsBasicIDs"></param>
        /// <param name="name"></param>
        /// <param name="GoodsClassFirst"></param>
        /// <param name="GoodsClassSecond"></param>
        /// <param name="groupId"></param>
        /// <returns></returns>
        public long GetAutoGoodsBasicTotal(string GoodsBasicIDs = "", string name = "", int GoodsClassFirst = -1, int GoodsClassSecond = -1, int groupId = -1)
        {
            GoodsBasicBll bll = new GoodsBasicBll();
            return bll.GetListCount(GoodsBasicIDs, name, GoodsClassFirst, GoodsClassSecond, groupId, LoginUser.UserBasic.EnterpriseID);
        }

        /// <summary>
        /// 选择商品页的分页数据
        /// </summary>
        /// <param name="GoodsBasicIDs"></param>
        /// <param name="name"></param>
        /// <param name="GoodsClassFirst"></param>
        /// <param name="GoodsClassSecond"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <param name="groupId"></param>
        /// <returns></returns>
        public ActionResult AutoGoodsBasicPage(string GoodsBasicIDs = "", string name = "", int GoodsClassFirst = -1, int GoodsClassSecond = -1, int pageIndex = 1, int pageSize = 5, int groupId = -1)
        {
            GoodsBasicBll bll = new GoodsBasicBll();
            long Total = 0;
            var list = bll.GetGoodsBasicList(ref Total, GoodsBasicIDs, name, GoodsClassFirst, GoodsClassSecond, pageIndex, pageSize, groupId, LoginUser.UserBasic.EnterpriseID);
            ViewBag.Total = Total;
            ViewBag.List = list;
            return PartialView();
        }

        /// <summary>
        /// <auth>徐柳</auth>
        /// 根据一级获取二级类目
        /// </summary>
        /// <param name="bid">父id</param>
        /// <returns></returns>
        public JsonResult GetGCList(int pid)
        {
            GoodsClassBll bll = new GoodsClassBll();
            return Json(bll.GetGCList(pid), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// <auth>徐柳</auth>
        /// 根据品牌获取一级类目信息
        /// </summary>
        /// <param name="bid">品牌id</param>
        /// <returns></returns>
        public JsonResult GetListByB(int bid)
        {
            GoodsClassBll bll = new GoodsClassBll();
            return Json(bll.GetListByB(bid), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// <auth>徐柳</auth>
        /// 根据品牌与一级获取二级类目信息
        /// </summary>
        /// <param name="bid">品牌id</param>
        /// <param name="pid">父id</param>
        /// <returns></returns>
        public JsonResult GetListByPB(int bid, int pid)
        {
            GoodsClassBll bll = new GoodsClassBll();
            return Json(bll.GetListByPB(bid, pid), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// <auth>徐柳</auth>
        /// 根据一级类目获取属性名列表
        /// </summary>
        /// <param name="gcid">一级类目id</param>
        /// <returns></returns>
        public JsonResult GetAttrListByP(int gcid)
        {
            AttributesBll bll = new AttributesBll();
            var tt = bll.GetList(w => w.GoodsClassID == gcid && w.Status == 0);
            return Json(tt, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// <auth>徐柳</auth>
        /// 根据属性名获取属性值列表
        /// </summary>
        /// <param name="aid">属性名id</param>
        /// <returns></returns>
        public JsonResult GetAVListByP(int aid)
        {
            AttrValueBll bll = new AttrValueBll();
            var tt = bll.GetList(w => w.AttributesID == aid && w.Status == 0);
            return Json(tt, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// <auth>徐柳</auth>
        ///预览
        /// </summary>
        /// <param name="id">商品id</param>
        /// <returns></returns>
        [Authoriz(Authorization.GoodsView)]
        public FileContentResult ReadByte(string id)
        {
            #region 存放后返回地址
            //if (id != "")
            //{
            //    string path = Server.MapPath("~/Files/QRcodeImage");
            //    string url = LoginUser.UserBasic.EnterpriseID+"." + ConstConfigBll.GetConfigByKey("domian");
            //    string showUrl = url + "/GoodsInfo/Index/" + id;
            //    return Json("/Files/QRcodeImage" + ImageHelper.GetShowImgUrl(path, url.Replace('.', '_').Replace(':', '_') + id, showUrl), JsonRequestBehavior.AllowGet);
            //}
            //else
            //{
            //    return Json("", JsonRequestBehavior.AllowGet);
            //}
            #endregion

            if (id != "")
            {
                string url = LoginUser.UserBasic.EnterpriseID + "." + ConstConfigBll.GetConfigByKey("domian");
                string showUrl = url + "/GoodsInfo/Index/" + id;
                byte[] img = ImageHelper.GetShowImgUrl(showUrl);
                string contentType = MimeMapping.GetMimeMapping("*.jpg");
                return File(img, contentType);
            }
            else
            {
                return null;
            }
        }
    }
}