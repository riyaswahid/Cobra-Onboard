using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Onboard.ViewModel
{
    public class OrderViewModel
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public int CustomerId { get; set; }
        public int ProductId { get; set; }
    }
}