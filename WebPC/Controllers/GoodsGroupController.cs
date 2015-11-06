using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Bll;
using Model;
using Newtonsoft.Json;
using Utility;
using WebPC.Fillter;

namespace WebPC.Controllers
{
    public class GoodsGroupController : BaseController
    {
        GoodsGroupBll bll = new GoodsGroupBll();
        ChannelJoinGoodsBll cbll = new ChannelJoinGoodsBll();
        ChannelGroupBll cgbll = new ChannelGroupBll();
        // GET: GoodsGroup
        [Authoriz(Authorization.GoodsGroupView)]
        public ActionResult Index()
        {

            return View();
        }

        /// <summary>
        /// 获得所有
        /// </summary>
        /// <returns></returns>
        [Authoriz(Authorization.GoodsGroupView)]
        public ActionResult GetTotal()
        {
            var data = bll.GetQueryCount(x => x.EnterpriseID == LoginUser.UserBasic.EnterpriseID);
            return Content(data.ToString());
        }

        /// <summary>
        /// 获得数据页
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [Authoriz(Authorization.GoodsGroupView)]
        public ActionResult GetDataPager(int pageIndex, int pageSize)
        {
            pageIndex = pageIndex == 0 ? 1 : pageIndex;
            var data = bll.GetGG(pageSize, pageIndex, LoginUser.UserBasic.EnterpriseID);
            return Content(JsonConvert.SerializeObject(data));
        }


        [Authoriz(Authorization.GoodsGroupView)]
        public ActionResult ShowList(int pageIndex, int pageSize)
        {
            string eid = LoginUser.UserBasic.EnterpriseID;
            pageIndex = pageIndex == 0 ? 1 : pageIndex;
            var data = bll.GetGG(pageSize, pageIndex,eid);
            var shit = cgbll.getList(eid);
            ViewBag.List = data;
            ViewBag.cList = shit;
            return PartialView();
        }

        [Authoriz(Authorization.GoodsGroupEdit)]
        public ActionResult Add(GoodsGroup model)
        {
            model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            ReturnData<string> ret = new ReturnData<string>();
            ret = bll.AddGoodsGroup(model);
            if (ret.Status == true)
            {
                return Content(ret.Message);
            }
            return Content(ret.Message);
        }

        [Authoriz(Authorization.GoodsGroupEdit)]
        [HttpPost]
        public ActionResult Delete(int id, int count)
        {
            ReturnData<string> ret = new ReturnData<string>();
            ReturnData<string> check = new ReturnData<string>();
            IList<ChannelJoinGoods> cModel = cbll.GetCGListByGId(id, LoginUser.UserBasic.EnterpriseID);

            if (cModel.Count != 0)
            {
                return Content("存在关联！不能删除！请先取消关联！");
               
            }

            GoodsGroup model = bll.GetModelById(id);
            if (count == 0)
            {
                ret = bll.DeleteGoodsGroup(model);
            }
            else
            {
                return Content("当前分组下存在商品，请先移除商品！");
            }
            if (ret.Status == true && check.Status == true)
            {
                return Content(ret.Message);
            }
            return Content(ret.Message);
        }

        [Authoriz(Authorization.GoodsGroupEdit)]
        public ActionResult DeleteList(string ids,string counts)
        {
            string[] id = ids.Substring(0, ids.Length - 1).Split(',');
            string[] count = counts.Substring(0, counts.Length - 1).Split(',');
            ReturnData<string> ret = new ReturnData<string>();
            ReturnData<string> ret1 = new ReturnData<string>();
            IList<ChannelJoinGoods> list = new List<ChannelJoinGoods>();
            for (int j = 0; j < count.Length; j++)
            {
                if (Convert.ToInt32(count[j])!=0)
                {
                    return Content("分组下存在商品，请先移除商品！");
                }
            }



            for (int i = 0; i < id.Length; i++)
            {

                IList<ChannelJoinGoods> cModel = cbll.GetCGListByGId(Convert.ToInt32(id[i]), LoginUser.UserBasic.EnterpriseID);

                if (cModel.Count != 0)
                {
                    return Content("存在关联！不能删除！请先取消关联！");

                }

                GoodsGroup model = bll.GetModelById(Convert.ToInt32(id[i]));
                
                    ret = bll.DeleteGoodsGroup(model);
                


                ret = bll.DeleteById(Convert.ToInt32(id[i]));
                list = cbll.GetCGListByGId(Convert.ToInt32(id[i]), LoginUser.UserBasic.EnterpriseID);
                if (list.Count != 0)
                {
                    ret1 = cbll.DeleteByGId(Convert.ToInt32(id[i]));
                }
            }
            if (ret.Status == true && ret1.Status == true)
            {
                return Content(ret.Message);
            }
            return Content(ret.Message);
        }

        [Authoriz(Authorization.GoodsGroupEdit)]
        [HttpPost]
        public ActionResult CancelThis(int gid, int cid)
        {
            ReturnData<string> ret = new ReturnData<string>();
            ret = cbll.DeleteByTwoId(gid, cid);
            if (ret.Status == true)
            {
                return Content("取消关联成功！");
            }
            return Content("取消关联失败！");
        }

        [Authoriz(Authorization.GoodsGroupEdit)]
        [HttpPost]
        public ActionResult Edit(GoodsGroup model)
        {
            ReturnData<string> ret = new ReturnData<string>();
            GoodsGroup check = bll.GetModelById(model.ID);
            check.GroupName = model.GroupName;
            check.Remarks = model.Remarks;

            ret = bll.UpdateGoodsGroup(check);
            if (ret.Status == true)
            {
                return Content(ret.Message);
            }
            return Content(ret.Message);
        }

        [Authoriz(Authorization.GoodsGroupEdit)]
        [HttpPost]
        public ActionResult AddGuans(int gid)
        {
            IList<ChannelJoinGoods> list = cbll.GetCGListByGId(gid, LoginUser.UserBasic.EnterpriseID);

            if (list.Count != 0)
            {
                IList<int> g = new List<int>();
                foreach (var i in list)
                {
                    g.Add(i.ChannelGroupID);
                }
                return Json(g);
            }

            return null;
        }

        [Authoriz(Authorization.GoodsGroupEdit)]
        [HttpPost]
        public ActionResult AddGuan(int gid, string id)
        {
            string[] ids = id.Substring(0, id.Length - 1).Split(',');

            ReturnData<string> ret = new ReturnData<string>();
            IList<ChannelJoinGoods> list = cbll.GetCGListByGId(gid, LoginUser.UserBasic.EnterpriseID);
            ChannelJoinGoods model = new ChannelJoinGoods();
            if (list.Count != 0)
            {
                cbll.Delete(gid);
                for (int i = 0; i < ids.Length; i++)
                {
                    model.AddTime = DateTime.Now;
                    model.ChannelGroupID = Convert.ToInt32(ids[i]);
                    model.GoodsGroupID = gid;
                    ret = cbll.Add(model);
                }

            }
            else
            {
                for (int i = 0; i < ids.Length; i++)
                {
                    model.AddTime = DateTime.Now;
                    model.ChannelGroupID = Convert.ToInt32(ids[i]);
                    model.GoodsGroupID = gid;
                    ret = cbll.Add(model);
                }

            }
            if (ret.Status == true)
            {
                return Content(ret.Message);
            }

            return Content(ret.Message);
        }

    }
}