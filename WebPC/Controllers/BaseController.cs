using Bll;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using WebPC.Fillter;
using Utility;

namespace WebPC.Controllers
{
    //[Authoriz]
    //[Error]
    [Login]
    public class BaseController : Controller
    {
        public string Creater { get { return Guid.NewGuid().ToString(); } }

        private UserPC _userPc = null;
        public UserPC LoginUser
        {
            get
            {
                if (_userPc == null)
                {
                    _userPc = Session["user"] as UserPC;
                    return Session["user"] as UserPC;
                }
                return _userPc;
            }
        }

        /// <summary>
        /// 企业基本信息
        /// </summary>
        private Enterprise _Enterprise = null;


        /// <summary>
        /// 企业基本信息
        /// </summary>
        public Enterprise Enterprise
        {
            get
            {
                if (_Enterprise == null)
                    _Enterprise = new EnterpriseBll().GetEnterpriseModel(LoginUser.UserBasic.EnterpriseID);
                return _Enterprise;
            }
        }


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


        private IList<ConstConfig> _ConstConfigList;

        public IList<ConstConfig> ConstConfigList
        {
            get
            {
                if (_ConstConfigList == null) _ConstConfigList = new ConstConfigBll().GetAllConfig();
                return _ConstConfigList;
            }
        }





        /// <summary>
        /// 获取省市县，三级联动
        /// </summary>
        /// <returns></returns>
        [Login(false)]
        public string GetCitys()
        {
            return new AreasBll().GetAll().Select(x => new { x.ID, x.AreasID, x.AType, x.ACode, x.AName, Children = x.Children.Select(d => new { d.ID, d.AreasID, d.AName, d.ACode, Children = d.Children == null ? null : d.Children.Select(e => new { e.ACode, e.ID, e.AName, e.AreasID, e.AType }) }), x.Parent }).GetJson();
        }

        /// <summary>
        /// 获取联动
        /// </summary>
        /// <returns></returns>
        [Login(false)]
        public string GetGoodsClass()
        {
            string PagePublic = ConstConfigBll.GetConfigByKey("PagePublic");
            return new BrandBll().GetBrandList(LoginUser.UserBasic.EnterpriseID);
        }

        ///// <summary>
        ///// 公共参数
        ///// </summary>
        ///// <returns></returns>
        //public string GetConfigParamPublic()
        //{
        //    string PageCollectRecord = ConstConfigBll.GetConfigByKey("PageCollectRecord");
        //    //商品详情页的累计评价记录，默认加载和点击更多追加的条数（10）
        //    string PageComment = ConstConfigBll.GetConfigByKey("PageComment");
        //    string PageOrderRecord = ConstConfigBll.GetConfigByKey("PageOrderRecord");
        //    //老客户回访记录，默认加载和点击更多追加的条数（10）
        //    string PageReturnVisit = ConstConfigBll.GetConfigByKey("PageReturnVisit");
        //    //销售卖点记录默认加载和点击更多追加的条数（10）
        //    string PageSallingPoint = ConstConfigBll.GetConfigByKey("PageSallingPoint");
        //    //其他未强调的数据列表，默认显示和上拉更多的条数（12）
        //    string PagePublic = ConstConfigBll.GetConfigByKey("PagePublic");

        //    //图片展示地止
        //    string ImageShowUrl = ConstConfigBll.GetConfigByKey("ImageShowUrl");
        //    //图片上传地止
        //    string ImgServiceURL = ConstConfigBll.GetConfigByKey("ImgServiceURL");
        //    //avi
        //    string AviShowUrl= ConstConfigBll.GetConfigByKey("AviShowUrl");

        //    return new
        //    {
        //        PageCollectRecord = PageCollectRecord,
        //        PageComment = PageComment,
        //        PageOrderRecord = PageOrderRecord,
        //        PageReturnVisit = PageReturnVisit,
        //        PageSallingPoint = PageSallingPoint,
        //        PagePublic = PagePublic,
        //        ImageShowUrl = ImageShowUrl,
        //        ImgServiceURL = ImgServiceURL,
        //        AviShowUrl = AviShowUrl
        //    }.GetJson();

        //}
    }
}