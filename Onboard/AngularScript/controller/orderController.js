

onboardapp.controller('orderController', function ($scope, onboardService, dateFilter, $uibModal, $log, $timeout) {

    $scope.square = function () {
        $scope.result = onboardService.square($scope.number);
    }



    // this is base url   
    var baseUrl = '/Onboard/';
    $scope.customers = [];

    $scope.orders = [];

    $scope.products = [];

    

    // get all CUSTOMERS from databse using service via passing $scope
    // and updataing customers[] array
    onboardService.getCustomers($scope);

    // get all PRODUCTS from databse using service via passing $scope
    // and updataing products[] array 
    onboardService.getProducts($scope);

    // get all ORDERS from databse using service via passing $scope
    // and updataing orders[] array
    onboardService.getOrders($scope);
    

    //****-----Modal-----*****
    // Updating customer record  

    $scope.editCustomerData = { Id: "", name: "", address1: "", address2: "", city: "" }
    $scope.addCustomerData = { name: "", address1: "", address2: "", city: "" }

    $scope.selectedDataIndex;

    $scope.addOrderShow = false;
    $scope.editOrderShow = false;
    $scope.deleteOrderShow = false;
    $scope.resultOption = '';

   

    $scope.open = function (index, option) {
        $scope.selectedDataIndex = index;

        switch (option) {
           
            case 'editOrderShow':
                $scope.addOrderShow = false;
                $scope.editOrderShow = true;
                $scope.deleteOrderShow = false;
                break;
            case 'addOrderShow':
                $scope.addOrderShow = true;
                $scope.editOrderShow = false;
                $scope.selectedDataIndex = 0; // for add new order index is undefined, so assigned it to 0
                $scope.deleteOrderShow = false;
                break;
            case 'deleteOrder':
                $scope.deleteOrderShow = true;
                $scope.addOrderShow = false;
                $scope.editOrderShow = false;

            default:
        }
        

        var modalInstance = $uibModal.open({
            templateUrl: '/Templates/orderModal.html',
            controller: 'modalOrderController',
            resolve: {
                resultOption: function () {
                    return $scope.resultOption;
                },
                editOrderShow: function () {
                    return $scope.editOrderShow;
                },
                addOrderShow: function () {
                    return $scope.addOrderShow;
                },
                deleteOrderShow: function(){
                    return $scope.deleteOrderShow;
                },
                orders: function(){
                    return $scope.orders;
                },
                selectedDataIndex: function () {
                    return $scope.selectedDataIndex;
                },
                customerData: function () {
                    return $scope.customers;
                },
                products: function () {
                    return $scope.products;
        }

            }
        });

        modalInstance.result.then(function (transferData) {
            console.log($scope.resultOption);
            switch (transferData.option) {               
                case 'addOrder':
                    //save back to backend
                    var orderService = onboardService.AddNewOrder(transferData.orderHeader);

                    orderService.then(function (response) {
                        if(response.data > 0){
                            $scope.successMessage = "Order saved.";                        
                            $('#order-dialog').modal('toggle');

                            $scope.retOrderId = response.data;
                            var date = new Date(transferData.orderHeader.OrderDate);
                            var jsonDate = '/Date(' + date.getTime() + ')/';  // change date to MS JSON format Date()
                            $scope.newOrder = {
                            OrderId: $scope.retOrderId,
                            OrderDate: jsonDate,
                            CustomerName: transferData.addOrderDet.CustomerName,
                            ProductName: transferData.addOrderDet.ProductName,
                            Price: transferData.addOrderDet.Price
                        }

                        $scope.orders.push($scope.newOrder);
                        } else {
                            $scope.successMessage = "Order failed!";
                            $('#order-dialog').modal('toggle');
                        }
                    })
                    break;
                case 'editOrder':
                    var orderService = onboardService.EditOrder(transferData.orderHeader);
                    orderService.then(function (response) {
                        if (response.data > 0) {
                            $scope.successMessage = "Order saved.";
                            $('#order-dialog').modal('toggle');

                            $scope.retOrderId = response.data;
                            $scope.editedOrderObj = $scope.orders[index]; // Passing array index when open modal (by clicking edit button)
                            if ($scope.retOrderId == $scope.editedOrderObj.OrderId) {
                                var date = new Date(transferData.orderHeader.OrderDate);
                                var jsonDate = '/Date(' + date.getTime() + ')/';  // change date to MS JSON format Date()
                                $scope.editedOrderObj.OrderDate = jsonDate;
                                $scope.editedOrderObj.CustomerName = transferData.editDet.CustomerName;
                                $scope.editedOrderObj.ProductName = transferData.editDet.ProductName;
                                $scope.editedOrderObj.Price = transferData.editDet.Price;
                            } else {
                                $scope.successMessage = "Order ID not matched.";
                                $('#success-modal').modal('toggle');
                            }
                        } else {
                            $scope.successMessage = "Order edit failed.";
                            $('#order-dialog').modal('toggle');
                        }
                    })
                    break;
                case 'delOrder':
                    var currentRecord = $scope.orders[index];
                    var orderId = currentRecord.OrderId;

                    var orderService = onboardService.deleteOrder(orderId);
                    orderService.then(function (response) {
                        if(response.data > 0){
                            $scope.orders.splice(index, 1);
                            $scope.successMessage = "Order deleted.";
                            $('#order-dialog').modal('toggle');
                        } else {
                            $scope.successMessage = "Delete order failed!.";
                            $('#order-dialog').modal('toggle');
                        }
                        
                    }, function (error) {
                        $scope.successMessage = "Server error";
                        $('#order-dialog').modal('toggle');
                    });
                default:
            }
            
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

});

