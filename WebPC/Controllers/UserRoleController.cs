using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Web.Mvc;
using Bll;
using Model;
using Newtonsoft.Json;
using System.Linq.Expressions;
using Utility;
using WebPC.Fillter;

namespace WebPC.Controllers
{
    /// <summary>
    /// 用户角色
    /// 李惠宇
    /// </summary>

    public class UserRoleController : BaseController
    {
        UserRoleBll bll = new UserRoleBll();
        RolePowerBll rpBll = new RolePowerBll();
        // GET: UserRole
        
        public ActionResult Index()
        {


            return View(bll.GetList(LoginUser.UserBasic.EnterpriseID,""));
        }
        public ActionResult GetTotal()
        {
            Expression<Func<UserRole,bool>> where=t=>true;
            var data = bll.GetQueryCount(x=>x.EnterpriseID==LoginUser.UserBasic.EnterpriseID);
            return Content(data.ToString());
        }
        public ActionResult GetDataPager(int pageIndex,int pageSize)
        {
            long total=0;
            pageIndex = pageIndex == 0 ? 1 : pageIndex;
            var data = bll.GetPage(ref total, LoginUser.UserBasic.EnterpriseID,"", pageSize,pageIndex);
            return Content(JsonConvert.SerializeObject(data));
        }

        /// <summary>
        /// 添加角色
        /// </summary>
        /// <param name="model">角色实体</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Add(UserRole model)
        {
            Utility.ReturnData<string> returnData = new Utility.ReturnData<string>();
            model.Addtime = DateTime.Now;
            model.AddUserBasicID = LoginUser.UserBasicID;
            model.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            returnData = bll.AddOrUpdateUserRole(model);
            if (returnData.Message=="添加成功！")
            {
                return Content(returnData.Message);
            }
            else
            {
                return Content(returnData.Message);
            }

        }

        /// <summary>
        /// 删除角色
        /// </summary>
        /// <param name="id">角色id</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Delete(int id)
        {
            RolePowerBll rp=new RolePowerBll();
            Utility.ReturnData<string> returnData = new Utility.ReturnData<string>();
           
            long check = bll.GetCountByRoleId(id);
            if (check > 0)
            {
                return Content("角色存在关联，不能删除！");
            }
            UserRole model = bll.FindUserRoleByID(id);
             returnData = bll.DeleteUserRole(model);
           rp.Delete(x=>x.UserRoleID==id);
            if (returnData.Message=="删除成功！")
            {
                return Content(returnData.Message);
            }
            else
            {
                return Content(returnData.Message);
            }
            
        }

        [HttpPost]
        public ActionResult Edits(int Mid)
        {
            IList<RolePower> list = rpBll.getList(Mid);
            if (list.Count!=0)
            {
                IList<string> i=new List<string>();
                foreach (var item in list)
                {
                    i.Add(item.PowerID);
                }
                return Json(i);
            }
            return null;
        }

        [HttpPost]
        public ActionResult Edit(string[] CheckThis, string roleName1,int Mid)

        {
            string reg = "^[a-zA-Z0-9\u4e00-\u9fa5]+$";
            if (!Regex.IsMatch(roleName1.Trim(),reg))
            {
                return Content("名称不允许有特殊字符！");
            }
            if (roleName1.Trim()=="")
            {
                return Content("名称不能为空！");
            }
            if (roleName1.Trim().Length>16)
            {
                return Content("名称不能大于16位！");   
            }

            ReturnData<string> returnData = new ReturnData<string>();
            ReturnData<string> rd = new ReturnData<string>();
            UserRole roleModel = bll.FindUserRoleByID(Mid);
            roleModel.RoleName = roleName1;
          returnData= bll.AddOrUpdateUserRole(roleModel);

            IList<RolePower> list = rpBll.getList(Mid);
            RolePower rpModel = new RolePower();
            if (CheckThis==null)
            {
                rpBll.Delete(Mid);
                return Content("添加成功！");
            }
            if (list.Count!=0)
            {
                returnData = rpBll.Delete(Mid);
                if (returnData.Status==true)
                {
                    for (int i = 0; i < CheckThis.Length; i++)
                    {
                        rpModel.PowerID = CheckThis[i];
                        rpModel.UserRoleID = Mid;
                     rd=   rpBll.Add(rpModel);
                    }
                }
            }
            else
            {
                for (int i = 0; i < CheckThis.Length; i++)
                {
                    rpModel.PowerID = CheckThis[i];
                    rpModel.UserRoleID = Mid;
                    rd = rpBll.Add(rpModel);
                }
            }
            if (rd.Status==true)
            {
                return Content(rd.Message);
            }

            return Content(rd.Message);
        }



    }
}