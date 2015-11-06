using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Bll;
using Model;
using WebPC.Controllers;
namespace WebPC.Areas.Operate.Controllers
{
    public class AreasController : BaseController
    {
        // GET: Operate/Areas
        public ActionResult Index(string type, int PID = -1, string AName = "", int pageIndex = 1, int pageSize = 10, int ProvinceID = -1, int CityID = -1)
        {
            AreasBll bll = new AreasBll();
            if (Request.IsAjaxRequest())
            {
                if (type.Equals("data"))
                {
                    return Json(bll.list(PID, AName, pageIndex, pageSize, ProvinceID, CityID), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(bll.GetCount(PID,AName, pageIndex, pageSize, ProvinceID, CityID), JsonRequestBehavior.AllowGet);
                }

            }
            else
            {
                return View();
            }
          
        }

        public ActionResult Add() {
            
            return View();
        }
        [HttpPost]
        public string Add(Model.Areas Model, int ProvinceID, int CityID)
        {
           
            AreasBll bll = new AreasBll();

            return (bll.Add(Model, ProvinceID, CityID));
        }
        public ActionResult Edit(int ID)
        {
            AreasBll bll = new AreasBll();

            return View(bll.GetByID(ID));
        }

        [HttpPost]
        public string Edit(Model.Areas Model)
        {
            AreasBll bll = new AreasBll();
            
            return bll.Edit(Model);
        }

        public ActionResult Merge(int ID)
        {
            return View(new AreasBll().GetByID(ID));
        }

        [HttpPost]
        public string Merge(int ID, int ProvinceID = -1, int CityID=-1, int AID=-1)
        {
            if (ModelState.IsValid)
            {
                
            }
            AreasBll bll = new AreasBll();
            return bll.Merge(ID, ProvinceID, CityID, AID);
        }
    }
}