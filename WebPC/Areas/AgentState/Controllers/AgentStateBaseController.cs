
using Bll;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebPC.Areas.AgentState.Fillter;
using Utility;

namespace WebPC.Areas.AgentState.Controllers
{
    [AgentLogin]
    public class AgentStateBaseController : Controller
    {
        // GET: AgentState/AgentStateBase
        #region 代理商
        private UserPC _AgentLoginUser;

        public UserPC AgentLoginUser
        {
            get
            {
                if (_AgentLoginUser == null) _AgentLoginUser = Session["agentuser"] as UserPC;
                return _AgentLoginUser;
            }
        }

        #endregion


        private string _EnterpriseKey = null;

        /// <summary>
        /// 企业key
        /// </summary>
        public string EnterpriseKey
        {
            get
            {
                if (_EnterpriseKey == null) _EnterpriseKey = Session["EnterpriseKey"] as string;
                return _EnterpriseKey;
            }
        }

        /// <summary>
        /// 公共参数
        /// </summary>
        /// <returns></returns>
        [AgentLogin(false)]
        public string GetConfigParamPublic()
        {
            string PageCollectRecord = ConstConfigBll.GetConfigByKey("PageCollectRecord");
            //商品详情页的累计评价记录，默认加载和点击更多追加的条数（10）
            string PageComment = ConstConfigBll.GetConfigByKey("PageComment");
            string PageOrderRecord = ConstConfigBll.GetConfigByKey("PageOrderRecord");
            //老客户回访记录，默认加载和点击更多追加的条数（10）
            string PageReturnVisit = ConstConfigBll.GetConfigByKey("PageReturnVisit");
            //销售卖点记录默认加载和点击更多追加的条数（10）
            string PageSallingPoint = ConstConfigBll.GetConfigByKey("PageSallingPoint");
            //其他未强调的数据列表，默认显示和上拉更多的条数（12）
            string PagePublic = ConstConfigBll.GetConfigByKey("PagePublic");

            //图片展示地止
            string ImageShowUrl = ConstConfigBll.GetConfigByKey("ImageShowUrl");
            //图片上传地止
            string ImgServiceURL = ConstConfigBll.GetConfigByKey("ImgServiceURL");
            //avi
            string AviShowUrl = ConstConfigBll.GetConfigByKey("AviShowUrl");

            return new
            {
                PageCollectRecord = PageCollectRecord,
                PageComment = PageComment,
                PageOrderRecord = PageOrderRecord,
                PageReturnVisit = PageReturnVisit,
                PageSallingPoint = PageSallingPoint,
                PagePublic = PagePublic,
                ImageShowUrl = ImageShowUrl,
                ImgServiceURL = ImgServiceURL,
                AviShowUrl = AviShowUrl
            }.GetJson();

        }
    }
}