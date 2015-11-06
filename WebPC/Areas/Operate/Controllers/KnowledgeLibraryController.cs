using Bll;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Utility;
using System.IO;
using WebPC.Fillter;
using System.Linq.Expressions;
using Model.CreationModel;
using WebPC.Controllers;
using YYYCommon.Model;


namespace WebPC.Areas.Operate.Controllers
{

    /// <summary>
    /// 知识库
    /// </summary>
    public class KnowledgeLibraryController : BaseController
    {
        public string Creater { get { return Guid.NewGuid().ToString(); } }
        KnowledgeClassBll cBll = new KnowledgeClassBll();

        public ActionResult Index(string title, int? titleType, string classId, string orderby, int? pageIndex, int? pagesize, bool isGetRowCount = false)
        {
            KnowledgeArticleBll bll = new KnowledgeArticleBll();
            if (pageIndex == null || pageIndex < 1)
            {
                pageIndex = 1;
            }

            string msg;
            KnowledgeArticleViewModel viewModel = new KnowledgeArticleViewModel();
            viewModel.PageSize = 10;
            viewModel.OrderBy = orderby;
            if (Request.IsAjaxRequest())
            {
                viewModel.TotalRowCount = (int)bll.GetRowCountBySql(title, titleType, classId, out msg);
                if (!isGetRowCount)
                {
                    viewModel.List = bll.GetPagedList(title, titleType, classId, viewModel.TotalRowCount, 10, pageIndex.Value, orderby, false, out msg);
                }
                viewModel.PageIndex = pageIndex.Value;
                return Json(viewModel, JsonRequestBehavior.AllowGet);
            }
            else
            {
                viewModel.Level0Classes = cBll.GetArray(null, x => new KnowledgeClass { Id = x.Id, ClassName = x.ClassName }).Where(x => x.Lvl == 0).ToList();
                return View(viewModel);
            }
        }

        /// <summary>
        /// 生成文章的地址
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        //[Login(false)]
        public ActionResult YieldEWM(int id)
        {
            string imageContent = Request.Url.Authority + "/Operate/KnowledgeLibrary/ArticleDetailWeiXin/" + id;
            return File(ImageHelper.GetImgUrlStream(imageContent), "image/jpeg");
        }
        [Login(false)]
        public ActionResult ArticleDetailWeiXin(int id)
        {
            KnowledgeArticle model = new KnowledgeArticleBll().GetKnowledgeArticleById(id);
            return View(model);
        }

        public ActionResult KnowledgeLibraryClasses()
        {
            ViewBag.List = cBll.GetList();
            return View("KnowledgeClassPage");
        }

        /// <summary>
        /// 新增或更新知识库类目
        /// </summary>
        /// <param name="Model"></param>
        /// <returns>json</returns>
        [Error(true)]
        public string AddOrUpdateKnowledgeClass(KnowledgeClass Model)
        {
            Model.Creater = Creater;
            Model.AddTime = DateTime.Now;
            KnowledgeClassBll bll = new KnowledgeClassBll();

            return bll.AddOrUpdateKnowledgeClass(Model);
        }

        /// <summary>
        /// 移动类目
        /// </summary>
        /// <param name="baseId">被移的类目ID</param>
        /// <param name="baseOrder">被移的类目排序</param>
        /// <param name="toId">被交换的类目ID,</param>
        /// <param name="toOrder">被交换的类目排序</param>
        /// <returns>json</returns>
        [ErrorAttribute(true)]
        public string MoveKnowledgeClass(int baseId, int baseOrder, int toId, int toOrder)
        {
            KnowledgeClassBll bll = new KnowledgeClassBll();
            return bll.MoveKnowledgeClass(baseId, baseOrder, toId, toOrder);
        }

        /// <summary>
        /// 删除知识库类目
        /// </summary>
        /// <param name="Id">主键</param>
        /// <returns></returns>
        [ErrorAttribute(true)]
        public string DeleteKnowledgeClass(int Id)
        {
            KnowledgeClassBll bll = new KnowledgeClassBll();
            return bll.DeleteKnowledgeClass(Id);
        }

        public ActionResult KnowledgeClassSearch()
        {
            return View();
        }

        public ActionResult DelKnowledgeArticle(int[] ids)
        {
            if (ids == null || ids.Length == 0)
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }
            KnowledgeArticleBll bll = new KnowledgeArticleBll();
            foreach (int id in ids)
            {
                if (bll.Delete(x => x.Id == id) != 1)
                {
                    return Json(new { success = false }, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(new { success = true }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 询知识库数据
        /// </summary>
        /// <param name="Name">名称</param>
        /// <returns></returns>
        //[ErrorAttribute(ViewName: "~/Views/KnowledgeLibrary/KnowledgeClassPage.cshtml")]
        public ActionResult KnowledgeClassPage(string Name)
        {
            KnowledgeClassBll bll = new KnowledgeClassBll();
            IList<KnowledgeClass> list = bll.KnowledgeClassPage(Name);
            ViewBag.List = list;
            return View();
        }

        /// <summary>
        /// 新增或更新知识库
        /// </summary>
        /// <param name="Model"></param>
        /// <returns></returns>
        [ErrorAttribute(true)]
        [ValidateInput(false)]
        public string KnowledgeArticleAddOrUpdate(KnowledgeArticle Model)
        {
            KnowledgeArticleBll bll = new KnowledgeArticleBll();
            Model.Creater = Creater;
            Model.Modifier = Creater;
            return bll.KnowledgeArticleAddOrUpdate(Model);
        }


        /// <summary>
        /// 置顶
        /// </summary>
        /// <param name="Model"></param>
        /// <returns></returns>
        public string SetTop(KnowledgeArticle Model)
        {
            KnowledgeArticleBll bll = new KnowledgeArticleBll();
            bll.SetTop(Model);
            return new { success = true }.GetJson();
        }

        /// <summary>
        /// 新增更新
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public ActionResult AddClass(int Id = 0, bool isUpdate = false)
        {
            KnowledgeClass MODEL = new KnowledgeClass();
            KnowledgeClassBll bll = new KnowledgeClassBll();
            if (Id != 0)
            {
                MODEL = bll.GetMoel(Id);
            }
            IList<KnowledgeClass> list = bll.KnowledgeClassPage(string.Empty);
            ViewBag.list = list;
            ViewBag.Update = isUpdate;
            return View(MODEL);
        }
        public ActionResult Add(int Id = 0)
        {
            ViewBag.UpDate = false;
            KnowledgeArticle Model = new KnowledgeArticle();
            if (Id > 0)
            {
                Model = new KnowledgeArticleBll().GetKnowledgeArticleById(Id);
                ViewBag.UpDate = true;
            }
            ViewBag.ClassList = new KnowledgeClassBll().KnowledgeClassPage(string.Empty);
            return View(Model);
        }

        public ActionResult ClassPage_1(string Name)
        {
            KnowledgeClassBll bll = new KnowledgeClassBll();
            IList<KnowledgeClass> list = bll.KnowledgeClassPage(string.Empty);
            ViewBag.list = list;
            return View();
        }

        /// <summary>
        /// 预览界面
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public ActionResult ArticleDetail(int Id)
        {
            var Model = new KnowledgeArticleBll().GetKnowledgeArticleById(Id);
            string ClassName = new KnowledgeClassBll().GetKnowledgeClassName(Model.ClassId);
            ViewBag.ClassName = ClassName;
            return View(Model);
        }
    }
}