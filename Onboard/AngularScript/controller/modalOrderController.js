

onboardapp.controller('modalOrderController', function ($scope, $uibModalInstance, orders, products, resultOption, deleteOrderShow, addOrderShow, editOrderShow, customerData, selectedDataIndex) {


    
    $scope.addOrderShow = addOrderShow;
    $scope.editOrderShow = editOrderShow;
    $scope.deleteOrderShow = deleteOrderShow;
    $scope.resultOption = resultOption;
    $scope.customers = customerData;
    $scope.selectedDataIndex = selectedDataIndex;
    $scope.orders = orders;

    $scope.addOrdCustName;
    $scope.addOrdProName;
    $scope.products = products;

    // update the price edit modal input when product name selected
    $scope.priceUpdate = function () {
        angular.forEach($scope.products, function (value, key) {
            if ($scope.modalSelectedData.ProductName === value.ProductName) {
                $scope.editOrdProPrice = value.Price;
            }

        });
    }

    // update the price add modal input when product name selected
    $scope.addModalpriceUpdate = function () {
        angular.forEach($scope.products, function (value, key) {
            if ($scope.addOrdProName === value.ProductName) {
                $scope.addOrdProPrice = value.Price;
            }

        });
    }

    

    // save new order data from modal
    $scope.addOrder = function () {
        $scope.resultOption = 'addOrder';
        $scope.customerId;
        $scope.prodtId;
        $scope.personId = angular.forEach($scope.customers, function (value, key) {
            if ($scope.addOrdCustName === value.Name) {
                $scope.customerId = value.Id;
            }
        });
        $scope.productId = angular.forEach($scope.products, function (value, key) {
            if ($scope.addOrdProName === value.ProductName) {
                $scope.prodtId = value.Id;
            }
        });
        $scope.addOrderDet = { CustomerName: $scope.addOrdCustName, ProductName: $scope.addOrdProName, Price: $scope.addOrdProPrice }
        $scope.addOrderDataHeader = { OrderDate: $scope.Date, CustomerId: $scope.customerId, ProductId: $scope.prodtId }
        $uibModalInstance.close({ orderHeader: $scope.addOrderDataHeader, addOrderDet: $scope.addOrderDet, option: $scope.resultOption });
    }

    // deep copy of a source use angular.copy.The changes won't directly reflected to main screen 
    //so its not bind $scope.modalSelectedData with $scope.orders and hence both are refrencing to the same location.

    if (editOrderShow) {
        // selected single data from (product)order list for MODAL
        $scope.modalSelectedData = angular.copy($scope.orders[selectedDataIndex]);
        // bind selected single data date for MODAL
        $scope.modalSelecteddataDate = new Date(parseInt($scope.modalSelectedData.OrderDate.substr(6)));
        // bind selected single data price for MODAL
        $scope.editOrdProPrice = $scope.modalSelectedData.Price;
    }


    // save edited order from modal
    $scope.saveEditOrder = function () {
        $scope.resultOption = 'editOrder';
        $scope.customerId;
        $scope.prodtId;
        angular.forEach($scope.customers, function (value, key) {
            if ($scope.modalSelectedData.CustomerName === value.Name) {
                $scope.customerId = value.Id;
            }
        });
        angular.forEach($scope.products, function (value, key) {
            if ($scope.modalSelectedData.ProductName === value.ProductName) {
                $scope.prodtId = value.Id;
            }
        });
        $scope.editDet = { OrderDate: $scope.modalSelectedData.OrderDate, CustomerName: $scope.modalSelectedData.CustomerName, ProductName: $scope.modalSelectedData.ProductName, Price: $scope.editOrdProPrice }
        $scope.editedOrderData = { OrderId: $scope.modalSelectedData.OrderId, OrderDate: $scope.modalSelecteddataDate, CustomerId: $scope.customerId, ProductId: $scope.prodtId }
        $uibModalInstance.close({ orderHeader: $scope.editedOrderData, editDet: $scope.editDet, option: $scope.resultOption })
    }

    $scope.delOrder = function () {
        $scope.resultOption = 'delOrder';
        $uibModalInstance.close({ option: $scope.resultOption });
    };

    $scope.ok = function () {

        $uibModalInstance.close("ok");
    };

    $scope.cancel = function ($value) {
        $scope.resultOption = '';
        console.log('Modal dismissed at cancel: ' + $scope.addOrderShow, $scope.editOrderShow);
        $uibModalInstance.dismiss("cancel");

    };
});