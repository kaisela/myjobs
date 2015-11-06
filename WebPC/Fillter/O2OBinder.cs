using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebPC.Fillter
{
    public class O2OBinder : IModelBinder
    {
        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            if (bindingContext.ModelType.Name == "String" || bindingContext.ModelType.Name == "string")
            {
                string value = HttpUtility.HtmlDecode(bindingContext.ValueProvider.GetValue(bindingContext.ModelName).AttemptedValue);
                return value;
            }
            else
            {
                //string[] keys = controllerContext.RequestContext.HttpContext.Request.Params.AllKeys;

                object model = Activator.CreateInstance(bindingContext.ModelType);
                PropertyDescriptorCollection col = TypeDescriptor.GetProperties(model);
                
                foreach (PropertyDescriptor item in col)
                {
                    //if (!keys.Contains(item.Name)) continue;
                    if (bindingContext.ValueProvider.GetValue(item.Name) != null)
                    {
                        string value = HttpUtility.HtmlDecode(bindingContext.ValueProvider.GetValue(item.Name).AttemptedValue);
                        if (item.PropertyType.Name == "int" || item.PropertyType.Name == "uint") value = "0";
                        item.SetValue(model, Convert.ChangeType(value, item.PropertyType));
                    }
                }
                return model;
            }
            
        }
    }
    public class O2OBinderAttribute : CustomModelBinderAttribute
    {
        public override IModelBinder GetBinder()
        {
            return new O2OBinder();
        }
    }
}