using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Web.Models
{
    public class Test1Model
    {

        //[testAttribute]
        [Display(Name = "用户名")]
        [Required]
        [RegularExpression("(\\*{8}|[A-Za-z0-9]+)", ErrorMessage="aaaa")]
        public string Id { set; get; }

        //[Required]
        [testAttribute]
        [Display(Name = "d")]
        public string abcd { set; get; }
    }

    public class testAttribute : ValidationAttribute,IClientValidatable
    {
        public override bool IsValid(object value)
        {
            value = "ddddddddd";
            ErrorMessage = "我了个去呀";
            return false;
        }
        public IEnumerable<ModelClientValidationRule> GetClientValidationRules(ModelMetadata metadata, ControllerContext context)
        {
            yield return new ModelClientValidationRule
            {
                ErrorMessage = String.IsNullOrEmpty(ErrorMessage) ? "ddddd" : ErrorMessage,
                ValidationType = "enforcetrue"
            };
        } 
    }


    /// <summary>
    /// 
    /// </summary>
    public class StringByteAttribute: ValidationAttribute,IClientValidatable
    {
        private int _min = -1, _max = -1;
        private string _errormessage = string.Empty;
        public StringByteAttribute(int minlength,int maxlength,string errorMessage="")
        {
            this._max = maxlength; this._min = minlength;
            _errormessage = errorMessage;
        }

        public override bool IsValid(object value)
        {
            if (value == null)
            {
                ErrorMessage = _errormessage;
                return false;
            }
            int v = value.ToString().Length;
            if (v < _min || v > _max)
            {
                ErrorMessage = _errormessage;
                return false;
            }
            return true;
        }

        public IEnumerable<ModelClientValidationRule> GetClientValidationRules(ModelMetadata metadata, ControllerContext context)
        {
            var dic =  new Dictionary<string,int>();
            yield return new ModelClientValidationRule
            {
                ErrorMessage = String.IsNullOrEmpty(ErrorMessage) ? "默认报错" : _errormessage,
                ValidationType = "stringbyte"
            };
            
        }
        
    }
}