using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Onboard.Models;
using Onboard.ViewModel;

namespace Onboard.Controllers
{
    public class OnboardController : Controller
    {
        // GET: Onboard                         ******* CUSTOMERS ********
        public ActionResult Customer()
        {
            return View();
        }
        

        public JsonResult GetCustomers()
        {
            try
            {
                using (CobraOnboardEntities e = new CobraOnboardEntities())
                {
                    var customers = e.People.ToList();
                    var collection = customers.Select(x => new
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Address1 = x.Address1,
                        Address2 = x.Address2,
                        City = x.City
                    });
                    return Json(collection, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception)
            {
                return Json(-1);
            }
        }

        [HttpPost]
        public JsonResult AddCustomer(PersonViewModel stu)
        {
            try
            {
                using (CobraOnboardEntities dbContext = new CobraOnboardEntities())
                {
                    var newPerson = new Person
                    {
                        Name = stu.Name,
                        Address1 = stu.Address1,
                        Address2 = stu.Address2,
                        City = stu.City,
                    };
                        dbContext.People.Add(newPerson);
                        dbContext.SaveChanges();
                        dbContext.Entry(newPerson).GetDatabaseValues();
                        var newPersonId = newPerson.Id;
                        return Json(newPersonId, JsonRequestBehavior.AllowGet);
                        //return Json(e.Message, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception)
            {
                return Json(-1);
            }
           
        }

        [HttpPost]
        public JsonResult UpdateCustomer(PersonViewModel person)
        {
            try
            {
                using (CobraOnboardEntities dbContext = new CobraOnboardEntities())
                {
                    
                        var lstPerson = dbContext.People.Find(person.Id);
                    if (lstPerson != null)
                    {
                        //lstPerson.Name = person.Name;
                        //lstPerson.Address1 = person.Address1;
                        //lstPerson.Address2 = person.Address2;
                        //lstPerson.City = person.City;
                        dbContext.Entry(lstPerson).CurrentValues.SetValues(person);
                        dbContext.SaveChanges();
                        return Json(person.Id, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(-1);
                    } 
                }
            }
            catch (Exception)
            {
                return Json(-1);
            }
        }


        public JsonResult DeleteCustomer(int Id)
        {
            try
            {
                using (CobraOnboardEntities dataContext = new CobraOnboardEntities())
                {
                    var orderRcord = dataContext.OrderHeaders.Where(x => x.PersonId == Id).FirstOrDefault();
                    if (orderRcord == null)
                    {
                            var lstStud = dataContext.People.Where(x => x.Id == Id).FirstOrDefault();
                            dataContext.People.Remove(lstStud);
                            dataContext.SaveChanges();
                            return Json(Id, JsonRequestBehavior.AllowGet);
                    }
                    else {
                        return Json(new { orderFound = true });
                    }

                }
            }
            catch (Exception)
            {
                return Json(-1);
            }
        }

                                            // ******** ORDERS *****
        public ActionResult Orders()
        {
            return View();
        }

        public JsonResult GetOrders()
        {
            CobraOnboardEntities e = new CobraOnboardEntities();
            var result = e.OrderHeaders.ToList();
            var resultOrdDetail = e.OrderDetails.ToList();
            var collection = result.Select(x => new {
                OrderId = x.OrderId,
                OrderDate = x.OrderDate,
                CustomerName = e.People.Where(y => y.Id == x.PersonId).FirstOrDefault().Name,
                //ProductId = e.OrderDetails.Where(y => y.OrderId == x.OrderId).FirstOrDefault().ProductId,
                ProductName = e.Products.Where(z => z.Id == e.OrderDetails.Where(y => y.OrderId == x.OrderId).FirstOrDefault().ProductId).FirstOrDefault().ProductName,
                Price = e.Products.Where(z => z.Id == e.OrderDetails.Where(y => y.OrderId == x.OrderId).FirstOrDefault().ProductId).FirstOrDefault().Price
            });
            return Json(collection, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetProducts()
        {
            using (CobraOnboardEntities e = new CobraOnboardEntities())
            {
                var result = e.Products.ToList();
                var collection = result.Select(x => new {
                    Id = x.Id,
                    ProductName = x.ProductName,
                    Price = x.Price
                });
                return Json(collection, JsonRequestBehavior.AllowGet);
                //return Json(new { Success = true});
            };

        }

        [HttpPost]
        public JsonResult AddOrder(OrderViewModel order)
        {
            try
            {
                using (CobraOnboardEntities dbContext = new CobraOnboardEntities())
                {
                    var orderheader = new OrderHeader
                    {
                        OrderDate = order.OrderDate,  //DateTime.Now,
                        PersonId = order.CustomerId,
                    };
                    dbContext.OrderHeaders.Add(orderheader);
                    dbContext.SaveChanges();
                    dbContext.Entry(orderheader).GetDatabaseValues();
                    // var lastRecord = dbContext.OrderHeaders.Where(x => x.PersonId == order.CustomerId).LastOrDefault();
                    var lastRecordOrderId = orderheader.OrderId;
                    var orderdetail = new OrderDetail
                    {
                        OrderId = lastRecordOrderId,
                        ProductId = order.ProductId,
                    };
                    //orderdetail.OrderId = lastRecordId;
                    dbContext.OrderDetails.Add(orderdetail);
                    dbContext.SaveChanges();
                    return Json(lastRecordOrderId, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception)
            {
                return Json(-1);
            }
        }

        [HttpPost]
        public JsonResult EditOrder(OrderViewModel editOrder)      
        {
            try
            {
                using (CobraOnboardEntities dbContext = new CobraOnboardEntities())
                {
                    var recordHeader = dbContext.OrderHeaders.Find(editOrder.OrderId);
                    recordHeader.OrderDate = editOrder.OrderDate;
                    recordHeader.PersonId = editOrder.CustomerId;
                    var recordDetails = dbContext.OrderDetails.Where(x => x.OrderId == editOrder.OrderId).FirstOrDefault();
                    recordDetails.ProductId = editOrder.ProductId;
                    dbContext.SaveChanges();
                    return Json(editOrder.OrderId, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception)
            {
                return Json(-1);
            }
        }


        public JsonResult DeleteOrder(int Id)
        {
            try
            {
                using (CobraOnboardEntities dbContext = new CobraOnboardEntities())
                {
                    var orderDet = dbContext.OrderDetails.Where(x => x.OrderId == Id).FirstOrDefault();
                    dbContext.OrderDetails.Remove(orderDet);
                    var orderHead = dbContext.OrderHeaders.Where(x => x.OrderId == Id).FirstOrDefault();
                    dbContext.OrderHeaders.Remove(orderHead);
                    dbContext.SaveChanges();
                    return Json(Id, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception)
            {
                return Json(-1);
            }
        }

    }
}