
onboardapp.controller('customerController', function ($scope, onboardService, dateFilter, $uibModal, $log, $timeout) {

    $scope.square = function () {
        $scope.result = onboardService.square($scope.number);
    }



    // this is base url   
    var baseUrl = '/Onboard/';
    $scope.customers = [];

    // get all CUSTOMERS from databse using service via passing $scope
    // and updataing customers[] array
    onboardService.getCustomers($scope);

    //****-----Modal-----*****
    // Updating customer record  

    $scope.editCustomerData = { Id: "", name: "", address1: "", address2: "", city: "" }
    $scope.addCustomerData = { name: "", address1: "", address2: "", city: "" }

    $scope.selectedDataIndex;

    $scope.selected = false;
    $scope.add = false;
    $scope.edit = false;
    $scope.resultOption = '';



    $scope.open = function (index, option) {
        $scope.selectedDataIndex = index;

        switch (option) {
            case 'edit':
                $scope.edit = true;
                $scope.add = false;
                $scope.deleteCustShow = false;
                break;
            case 'add':
                $scope.add = true;
                $scope.edit = false;
                $scope.deleteCustShow = false;
                $scope.selectedDataIndex = 0; // for add new customer index is undefined, so assigned it to 0
                break;
            case 'deleteCustomer':
                $scope.deleteCustShow = true;
                $scope.add = false;
                $scope.edit = false;
                break;

            default:
        }


        var modalInstance = $uibModal.open({
            templateUrl: '/Templates/customerModal.html',
            controller: 'modalCustomerController',
            resolve: {
                resultOption: function () {
                    return $scope.resultOption;
                },
                edit: function () {
                    return $scope.edit;
                },
                add: function () {
                    return $scope.add;
                },
                deleteCustShow: function () {
                    return $scope.deleteCustShow;
                },
                selectedDataIndex: function () {
                    return $scope.selectedDataIndex;
                },
                editCustomerData: function () {
                    return $scope.editCustomerData;
                },
                customerData: function () {
                    return $scope.customers;
                },
                addCustomerData: function () {
                    return $scope.addCustomerData;
                }

            }
        });

        modalInstance.result.then(function (transferData) {
            console.log($scope.resultOption);
            switch (transferData.option) {
                case 'editCustomer':
                    //save back to backend
                    var customerService = onboardService.UpdateCustomer(transferData.data);

                    customerService.then(function (response) {
                        if (response.data > 0) {
                            $scope.successMessage = "Customer edited successfully.";
                            $('#customer-dialog').modal('toggle');
                            //refresh grid after updated db
                            var currentRecord = $scope.customers[index];
                            if (currentRecord.Id == response.data) {
                                currentRecord.Name = transferData.data.name;
                                currentRecord.Address1 = transferData.data.address1;
                                currentRecord.Address2 = transferData.data.address2;
                                currentRecord.City = transferData.data.city;
                            }
                        } else {
                            $scope.successMessage = 'Customer edit failed!';
                            $('#customer-dialog').modal('toggle');
                        }
                        
                    }, function error(response) {  // catch error function when application break, without handling Exception in server site
                        console.log(response.data);
                    })
                    break;
                case 'addCustomer':
                    //save back to backend using service
                    var customerService = onboardService.AddNewCustomer(transferData.data);
                    customerService.then(function (response) {
                        if(response.data > 0){
                                $scope.successMessage = "Customer saved!";
                                $('#customer-dialog').modal('toggle');

                                //refresh grid after updated db
                                var newCustomer = {
                                    Id: response.data,
                                    Name: transferData.data.name,
                                    Address1: transferData.data.address1,
                                    Address2: transferData.data.address2,
                                    City: transferData.data.city
                                }
                                $scope.customers.push(newCustomer);
                        } else {
                            $scope.successMessage = "Customer save failed!";
                            $('#customer-dialog').modal('toggle');
                        }
                    }, function error(response) {  // catch error function when application break, without handling Exception in server site
                         console.log(response.data);
                    })

                    break;
                case 'deleteCust':

                    var currentRecord = $scope.customers[index];
                    var customerId = currentRecord.Id;

                    var customerService = onboardService.deleteCustomer(customerId)
                    customerService.then(function (response) {
                        if(response.data > 0){
                            $scope.customers.splice(index, 1);
                            $scope.successMessage = "Customer record deleted.";
                            $('#customer-dialog').modal('toggle');
                        } else if (response.data.orderFound) {
                            $scope.successMessage = "Record not deleted! Customer have order";
                            $('#customer-dialog').modal('toggle');
                        } else {
                            $scope.successMessage = "Customer delete failed!";
                            $('#customer-dialog').modal('toggle');
                        }
                        
                    }, function error(response) {  // catch error function when application break, without handling Exception in server site
                        console.log(response.data);
                    })
                    break;               
                default:
            }

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

});

