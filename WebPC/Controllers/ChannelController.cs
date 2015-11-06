using Bll;
using Model;
using Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Utility;
using WebPC.Fillter;

namespace WebPC.Controllers
{
    public class ChannelController : BaseController
    {
        ChannelGroupBll bll = new ChannelGroupBll();

        [Authoriz(Authorization.ChnGroupView)]
        public ActionResult Index()
        {
            ChannelGroupViewModel viewModel = new ChannelGroupViewModel();
            string msg;
            List<ChannelGroupBindModel> list = bll.GetListWithGoodsGroup(LoginUser.UserBasic.EnterpriseID, out msg);
            viewModel.AddRange(list);
            return View(viewModel);
        }


        [Authoriz(Authorization.ChnGroupEdit)]
        public ActionResult CreateChannelIndex(int? id)
        {
            ChannelGroup model = null;
            if (id.HasValue)
            {
                model = bll.GetObjectById(x => x.ID == id.Value);
                return View("CreateChannel", model);
            }
            else
            {
                model = new ChannelGroup();
            }
            return View("CreateChannel", model);
        }
        [Authoriz(Authorization.ChnGroupEdit)]
        public ActionResult CreateChannelIndex2(int? id)
        {
            ChannelGroup model = null;
            if (id.HasValue)
            {
                model = bll.GetObjectById(x => x.ID == id.Value);
                return View("CreateChannel", model);
            }
            else
            {
                model = new ChannelGroup();
            }
            return View("CreateChannel", model);
        }
        [Authoriz(Authorization.ChnGroupEdit)]
        public ActionResult CreateChannelGroup(ChannelGroup model)
        {
            string msg;
            ReturnData<string> returnData = new ReturnData<string>();
            if (!ModelState.IsValid)
            {
                msg = "数据验证失败";
                return Json(new { Status = false, Message = msg });
            }
            model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            bool success = bll.AddChannelGroup(model, out msg);
            if (success)
            {
                return Json(new { Status = true, Message = msg });
            }
            return Json(new { Status = false, Message = msg });
        }
        [Authoriz(Authorization.ChnGroupEdit)]
        public JsonResult UpdateChannelGroup(ChannelGroup model)
        {
            string msg;
            if (!ModelState.IsValid)
            {
                msg = "数据验证失败";
                return Json(new { Status = false, Message = msg });
            }
            model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            if (bll.UpdateChannelGroup(model, out msg))
            {
                return Json(new { Status = true, Message = msg });
            }
            return Json(new { Status = false, Message = msg });
        }
        [Authoriz(Authorization.ChnGroupDel)]
        public JsonResult DeleteChannelGroup(int[] ids)
        {
            string msg;
            if (bll.DelChanndelGroup(ids, out msg))
            {
                return Json(new { Status = true, Message = msg });
            }
            return Json(new { Status = false, Message = msg });
        }
        [Authoriz(Authorization.ChnGroupEdit)]
        public ActionResult IsGoodsGroupNull(int channelGroupId)
        {
            string msg;
            long count = bll.Count(channelGroupId, LoginUser.UserBasic.EnterpriseID, out msg);
            return Json(count <= 0, JsonRequestBehavior.AllowGet);
        }

        [Authoriz(Authorization.ChnGroupEdit)]
        public ViewResult CreateRelationWithGoodsGroupIndex(int channelGroupId)
        {
            string msg;
            List<GoodsGroup> list = bll.GetNoRelatedGoodsGroups(channelGroupId, LoginUser.UserBasic.EnterpriseID, out msg);
            return View("CreateRelationWithGoodsGroup", list);
        }

        [Authoriz(Authorization.ChnGroupEdit)]
        public JsonResult CreateRelationWithGoodsGroup(int channelGroupId, int[] GoodsGroupIds)
        {
            string msg;
            bool success = bll.CreateRelationWithGoodsGroup(channelGroupId, GoodsGroupIds, out msg);
            if (success)
            {
                return Json(new { Status = true, Message = msg });
            }
            else
            {
                return Json(new { Status = false, Message = msg });
            }
        }
        [Authoriz(Authorization.ChnGroupEdit)]
        public JsonResult DelRelationWithGoodsGroup(int channelGroupId, int goodsGroupId)
        {
            string msg;
            bool success = bll.DeleteRelationWithGoodsGroup(channelGroupId, goodsGroupId, out msg);
            if (success)
            {
                return Json(new { Status = true, Message = msg });
            }
            return Json(new { Status = false, Message = msg });
        }
    }
}