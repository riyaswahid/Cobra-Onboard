using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Onboard.Models;

namespace Onboard.API
{
    public class OnboardAPIController : ApiController
    {
        CobraOnboardEntities _ctx = null; // CobraOnboardEntities is data model name  

        public OnboardAPIController()
        {
            _ctx = new CobraOnboardEntities();
        }
        public List<Person> GetStudents()
        {
            List<Person> students = null;
            try
            {
                students = _ctx.People.ToList();
            }
            catch
            {
                students = null;
            }
            return students;
        }
    }
}
