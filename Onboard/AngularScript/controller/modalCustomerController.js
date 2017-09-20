

onboardapp.controller('modalCustomerController', function ($scope, $uibModalInstance,resultOption,addCustomerData, edit, add,deleteCustShow, customerData, selectedDataIndex, editCustomerData) {

    
    $scope.edit = edit;
    $scope.add = add;
    $scope.deleteCustShow = deleteCustShow;
    $scope.resultOption = resultOption;
    $scope.customers = customerData;
    $scope.selectedDataIndex = selectedDataIndex;
    $scope.editCustomerData = editCustomerData;
    $scope.addCustomerData = addCustomerData;

    $scope.addOrdCustName;
    $scope.addOrdProName;

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

    // selected customer data to edit for modal
    if (edit) {
        $scope.selCusEditModalData = angular.copy($scope.customers[selectedDataIndex]);
    }
    

    // save edited customer data from modal
    $scope.saveEdit = function () {
        $scope.resultOption = 'editCustomer';
        $scope.editCustomerData = { Id: $scope.selCusEditModalData.Id, name: $scope.selCusEditModalData.Name, address1: $scope.selCusEditModalData.Address1, address2: $scope.selCusEditModalData.Address2, city: $scope.selCusEditModalData.City }

        $uibModalInstance.close({ data: $scope.editCustomerData, option: $scope.resultOption });

    };

    // save new customer data from modal
    $scope.saveAdd = function () {
        $scope.resultOption = 'addCustomer';
        $scope.addCustomerData = { name: $scope.customerName, address1: $scope.customerAddress1, address2: $scope.customerAddress2, city: $scope.customerCity }
        $uibModalInstance.close({ data: $scope.addCustomerData, option: $scope.resultOption });

    };

    // delete customer
    $scope.delCustomer = function () {
        $scope.resultOption = 'deleteCust';
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