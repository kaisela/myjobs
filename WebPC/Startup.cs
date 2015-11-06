using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(WebPC.Startup))]
namespace WebPC
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
