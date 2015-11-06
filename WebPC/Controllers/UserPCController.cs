using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Mime;
using System.Web.Mvc;
using Bll;
using Model;
using Newtonsoft.Json;
using Utility;
using YYYCommon.Encryption;


namespace WebPC.Controllers
{
    public class UserPCController : BaseController
    {
        UserPCBll bll = new UserPCBll();
        UserRoleBll roleBll = new UserRoleBll();
        UserBasicBll ubBll = new UserBasicBll();
        PcAndRoleBll pcBll = new PcAndRoleBll();
        // GET: UserPC
        public ActionResult Index()
        {
            string eid = LoginUser.UserBasic.EnterpriseID;
            ViewData["RoleId"] = new SelectList(roleBll.GetList(eid, ""), "ID", "RoleName");
            ViewData["RoleId1"] = new SelectList(roleBll.GetList(eid, ""), "ID", "RoleName");
            ViewData["RoleId2"] = new SelectList(roleBll.GetList(eid, ""), "ID", "RoleName");
            ViewData["RoleId3"] = new SelectList(roleBll.GetList(eid, ""), "ID", "RoleName");
            return View();


        }

        /// <summary>
        /// 获得所有
        /// </summary>
        /// <returns></returns>
        public ActionResult GetTotal(int roleid, string info)
        {
            string eid = LoginUser.UserBasic.EnterpriseID;
            if (roleid != -1 && info != "")
            {
                var data = pcBll.GetQueryCount(s => s.RoleID == roleid && s.UserName.Contains(info) && s.EnterpriseID == eid);
                return Content(data.ToString());
            }
            else if (roleid == -1 && info != "")
            {
                var data = pcBll.GetQueryCount(s => s.UserName.Contains(info) && s.EnterpriseID == eid);
                return Content(data.ToString());
            }
            else if (roleid != -1 && info == "")
            {
                var data = pcBll.GetQueryCount(s => s.RoleID == roleid && s.EnterpriseID == eid);
                return Content(data.ToString());
            }

            var data1 = pcBll.GetQueryCount(s => s.EnterpriseID == eid);
            return Content(data1.ToString());
        }

        /// <summary>
        /// 获得数据页
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public ActionResult GetDataPager(int roleid, string name, int pageIndex, int pageSize)
        {


            long total = 0;
            pageIndex = pageIndex == 0 ? 1 : pageIndex;
            var data = pcBll.GetPage(ref total, roleid, LoginUser.UserBasic.EnterpriseID, name, pageSize, pageIndex);
            return Content(JsonConvert.SerializeObject(data));
        }

        [HttpPost]
        public ActionResult EditPwd(string oldpwd, string pwd)
        {
            Utility.ReturnData<string> ret = new Utility.ReturnData<string>();
            long id = LoginUser.UserBasicID;
            UserPC model = bll.GetModelById(id);
            string checkpwd = SimpleEncrypt.SaltMD5(oldpwd.Replace(" ", ""));
            if (model.PassWord != checkpwd)
            {
                return Content("原始密码不正确！");
            }
            model.PassWord = SimpleEncrypt.SaltMD5(pwd.Replace(" ", ""));
            bll.Update(model);

            return Content("修改成功！");



        }

        [HttpPost]
        public ActionResult AddInfo(int check)
        {
            //if (check==1)
            //{
            //    string name=LoginUser.UserBasic.


            //}

            return Content("请求失败！");
        }

        [HttpPost]
        public ActionResult EditInfo()
        {
            return null;
        }


        /// <summary>
        /// 添加企业用户
        /// </summary>
        /// <param name="model">企业用户实体</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Add(PcAndRole model)
        {
            Utility.ReturnData<string> returnData = new Utility.ReturnData<string>();
            long count = bll.GetQueryCount(x => x.UserName == model.UserName && x.Status != 1);
            UserBasic ubModel = new UserBasic();
            ubModel.NickName = model.UserName;
            ubModel.UserType = 1;
            ubModel.AddTime = DateTime.Now;
            ubModel.EnterpriseID = LoginUser.UserBasic.EnterpriseID;
            long id = ubBll.AddAndGetId(ubModel);
            UserPC upModel = new UserPC();
            upModel.UserName = model.UserName;
            upModel.UserBasicID = id;
            upModel.RoleID = model.RoleID;
            upModel.PCType = 1;
            upModel.AddTime = DateTime.Now;
            upModel.PassWord = SimpleEncrypt.SaltMD5(model.PassWord.Replace(" ", ""));
            upModel.AddUserBasicID = LoginUser.UserBasicID;
            upModel.Status = 0;
            returnData = bll.AddUserPc(upModel);
            if (returnData.Status == false)
            {
                ubBll.Delete(s => s.ID == id);
                return Content(returnData.Message);
            }
            return Content(returnData.Message);
        }

        /// <summary>
        /// 修改企业用户
        /// </summary>
        /// <param name="model">企业用户实体</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Update(UserPC model)
        {
            Utility.ReturnData<string> returnData = new Utility.ReturnData<string>();
            UserPC ucModel = bll.GetModelById(model.UserBasicID);
            ucModel.RoleID = model.RoleID;
            ucModel.UserName = model.UserName;
            ucModel.AddTime = DateTime.Now;
            ucModel.AddUserBasicID = LoginUser.UserBasicID;
            returnData = bll.UpdateUserPc(ucModel);
            if (returnData.Message == "编辑成功！")
            {
                return Content(returnData.Message);
            }
            else
            {
                return Content(returnData.Message);
            }


        }

        /// <summary>
        /// 重置密码
        /// </summary>
        /// <param name="pwd">密码</param>
        /// <param name="id">企业id</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult ChangePwd(string pwd, int id)
        {
            Utility.ReturnData<string> returnData = new Utility.ReturnData<string>();
            UserPC model = bll.GetModelById(id);
            model.PassWord = SimpleEncrypt.SaltMD5(pwd.Replace(" ", ""));
            returnData = bll.UpdateUserPc(model);
            if (returnData.Message == "编辑成功！")
            {
                return Content("重置成功！");
            }
            else
            {
                return Content(returnData.Message);
            }
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="id">企业id</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Delete(int id)
        {
            Utility.ReturnData<string> returnData = new Utility.ReturnData<string>();
            UserPC model = bll.GetModelById(id);

            ubBll.Delete(s => s.ID == id);
            model.Status = 1;
            returnData = bll.UpdateUserPc(model);
            if (returnData.Message == "编辑成功！")
            {
                return Content("删除成功！");
            }
            else
            {
                return Content(returnData.Message);
            }
        }

        /// <summary>
        /// 批量删除账号
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult DeleteList(string id)
        {
            Utility.ReturnData<string> returnData = new Utility.ReturnData<string>();
            string[] ids = id.Substring(0, id.Length - 1).Split(',');

            UserPC model = new UserPC();

            for (int i = 0; i < ids.Length; i++)
            {
                int j = Convert.ToInt32(ids[i]);
                ubBll.Delete(s => s.ID == j);
                model = bll.GetModelById(Convert.ToInt32(ids[i]));
                model.Status = 1;
                returnData = bll.UpdateUserPc(model);
            }
            if (returnData.Message == "编辑成功！")
            {
                return Content("删除成功！");
            }


            return Content(returnData.Message);
        }


        [HttpPost]
        public ActionResult UpdateList(string id, int roleid)
        {

            Utility.ReturnData<string> returnData = new Utility.ReturnData<string>();
            string[] ids = id.Substring(0, id.Length - 1).Split(',');

            UserPC model = new UserPC();

            for (int i = 0; i < ids.Length; i++)
            {
                model = bll.GetModelById(Convert.ToInt32(ids[i]));
                model.RoleID = roleid;
                returnData = bll.UpdateUserPc(model);
            }
            if (returnData.Message == "编辑成功！")
            {
                return Content("关联成功！");
            }


            return Content(returnData.Message);
        }

        /// <summary>
        /// 修改个人基本信息
        /// </summary>
        /// <param name="id">用户id</param>
        /// <param name="name">名字</param>
        /// <param name="img">头像</param>
        /// <param name="sex">性别</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult BasicInfo(long id, string name, string img, int sex)
        {
            ReturnData<string> ret = new ReturnData<string>();
            ret = ubBll.UpdateBasic(id, name, sex, img);
            var user = ubBll.GetModel(id);
            LoginUser.UserBasic.IMG = user.IMG;
            if (ret.Status == true)
            {
                return Content(ret.Message);
            }
            return Content(ret.Message);

        }

        [HttpPost]
        public ActionResult ShowInfo(long id)
        {
            return Json(ubBll.GetModel(id));
        }


    }
}
