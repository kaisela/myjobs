using Bll;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebPC.Controllers
{
    public class GoodsInfoController : Controller
    {
        // GET: GoodsInfo
        public ActionResult Index(int id = 0)
        {
            GoodsBasicBll bll = new GoodsBasicBll();
            int gcPid = 0;
            var goods = bll.GetModelByGBid(id,out gcPid);

            //累计评价总数 要正常状态的 要对应商品企业的
            CommentsBll objCommentsBll = new CommentsBll();
            ViewBag.FeedbackNum = objCommentsBll.GetQueryCount(x => x.GoodsBasicID == id && x.Status == 0 && x.EnterpriseID == goods.EnterpriseID);
            //老客户回访总数 要对应商品企业的
            ReturnVisitBll objReturnVisitBll = new ReturnVisitBll();
            ViewBag.ReturnVisitNum = objReturnVisitBll.GetCountForGoodsInfo(id, goods.EnterpriseID);
            //销售卖点总数 要对应商品企业的
            SPJoinGBBll objSPJoinGBBll = new SPJoinGBBll();
            ViewBag.SellPointNum = objSPJoinGBBll.GetCountForGoodsInfo(id, goods.EnterpriseID);
            return View(goods);
        }

        /// <summary>
        /// 累计评价
        /// </summary>
        /// <param name="goodsID"></param>
        /// <param name="PageSize"></param>
        /// <returns></returns>
        public ActionResult GetFeedback(int goodsID, int ctype = 0, int pageIndex = 1, int pageSize = 10, string EnterpriseID = "")
        {
            CommentsBll objCommentsBll = new CommentsBll();
            var data = objCommentsBll.GetForGoodsInfo(goodsID, ctype, pageIndex, pageSize, EnterpriseID);
            //不管有没有都返回 前端去判断是否要重新绘制
            return Content(JsonConvert.SerializeObject(data));
        }

        /// <summary>
        /// 老客户回访
        /// 商品存在于老客户关联商品时就显示关联的老客户回访
        /// 不存在就显示全部的当前企业的老客户回访记录
        /// </summary>
        /// <param name="goodsID"></param>
        /// <param name="PageSize"></param>
        /// <returns></returns>
        public ActionResult GetReturnVisit(int goodsID, int pageIndex = 1, int pageSize = 10, string EnterpriseID = "")
        {
            VistJoinGoodsBll objVistJoinGoodsBll = new VistJoinGoodsBll();
            var data = objVistJoinGoodsBll.GetForGoodsInfo(goodsID, pageIndex, pageSize, EnterpriseID);
            //不管有没有都返回 前端去判断是否要重新绘制
            return Content(JsonConvert.SerializeObject(data));
        }

        /// <summary>
        /// 销售卖点
        /// 如果显示全部要显示当前商品的企业的销售卖点
        /// </summary>
        /// <param name="goodsID"></param>
        /// <param name="pageIndex"></param>
        /// <returns></returns>
        public ActionResult GetSellPoint(int goodsID = 0, int pageIndex = 1, int pageSize = 10, string EnterpriseID = "")
        {
            SPJoinGBBll objSPJoinGBBll = new SPJoinGBBll();
            //不管有没有都返回 前端去判断是否要重新绘制
            return Content(JsonConvert.SerializeObject(objSPJoinGBBll.GetForGoodsInfo(goodsID, pageIndex, pageSize, EnterpriseID)));
        }

        public ActionResult Details(int goodsId = 0)
        {
            GoodsBasicBll bll = new GoodsBasicBll();
            int gcPid = 0;
            var goods = bll.GetModelByGBid(goodsId, out gcPid);
            AttributesBll objAttributesBll = new AttributesBll();
            ViewBag.AttrValue = objAttributesBll.GetListByGBid(goodsId, goods.EnterpriseID);
            return View(goods);
        }
    }
}