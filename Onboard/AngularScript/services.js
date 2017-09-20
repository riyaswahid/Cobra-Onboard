

onboardapp.service('onboardService', function (MathService, $http) {
    this.square = function (a) {
        return MathService.multiply(a, a);
    }
                                                // --------Customer operations---------
    var baseUrl = '/Onboard/';

    var urlGet = '';
    this.getAll = function (apiRoute) {
        urlGet = apiRoute;
        return $http.get(urlGet);
    }
   
    // Initialy get all CUSTOMERS from db and passing to controllers using passing parameter $scope into the method from controller
    this.getCustomers = function (scope) {
        var apiRoute = baseUrl + 'GetCustomers/';
        var allCustomers = this.getAll(apiRoute);
        allCustomers.then(function (response) {
            scope.customers = response.data;
            if (response.data.length == 0) {
            }
            return response;
        },
        function (error) {
            console.log("Error: " + error);
        });
    }
    // Initialy get all PRODUCTS from db and passing to controllers using passing parameter $scope into the method from controller
    this.getProducts = function (scope) {
        var apiRoute = baseUrl + 'GetProducts/';
        var allProducts = this.getAll(apiRoute);
        allProducts.then(function (response) {
            scope.products = response.data;
            //for (i = 0; response.data.length > i; i++){
            //    scope.products.push(response.data[i]);
            //}
            return response;
        },
        function (error) {
            console.log("Error: " + error);
        });
    }

    // Initialy get all ORDERS from db and passing to controllers using passing parameter $scope into the method from controller
    this.getOrders = function (scope) {
        var apiRoute = baseUrl + 'GetOrders/';
        var allOrders = this.getAll(apiRoute);
        allOrders.then(function (response) {
            scope.orders = response.data;
            return response;
        },
        function (error) {
            console.log("Error: " + error);
        });
    }

    // Adding Customer Record  
    this.AddNewCustomer = function (person) {
        return $http({
            method: "post",
            url: "/Onboard/AddCustomer/",
            data: JSON.stringify(person),
            dataType: "json"
        });
    }
    // Update Customer details
    this.UpdateCustomer = function (person) {       
        return $http({
            method: "post",
            url: "/Onboard/UpdateCustomer/",
            data: JSON.stringify(person),
            dataType: "json"
        });
    }

    // Deleting customer records  
    this.deleteCustomer = function (Id) {
        return $http.post('/Onboard/DeleteCustomer/' + Id);
    }

                                                         // --------Order operations---------

    // Adding new order Record  
    this.AddNewOrder = function (header) {
        return $http({
            method: "post",
            url: "/Onboard/AddOrder/",
            data: JSON.stringify(header),
            dataType: "json"
        });
    }

    // save edited order record
    this.EditOrder = function (header) {
        return $http({
            method: "post",
            url: "/Onboard/EditOrder/",
            data: JSON.stringify(header),
            dataType: "json"
        });
    }

    this.deleteOrder = function (OrdId) {
        return $http.post('/Onboard/DeleteOrder/' + OrdId);
    }
});