(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.factory('SearchFactory', SearchFactory)
.directive('NarrowList', NarrowListDirective)
.constant('ApiBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com");



function NarrowListDirective() {
  var ddo = {
    templateUrl: 'index.html',
    scope: {
      items: '<',
      myTitle: '@title',
      onRemove: '&'
    },
    controller: NarrowItDownController,
    controllerAs: 'list',
    bindToController: true,
    link: NarrowListDirectiveLink,
    transclude: true
  };
  return ddo;
}
function NarrowListDirectiveLink(scope, element, attrs, controller) {
  console.log("Link scope is: ", scope);
  console.log("Controller instance is: ", controller);
  console.log("Element is: ", element);

  scope.$watch('list.get_like_items()', function (newValue, oldValue) {
    console.log("Old value: ", oldValue);
    console.log("New value: ", newValue);

    if (newValue.length === 0) {
      displayError();
    }
    else {
      removeError();
    }
  });
  function displayError() {
    var warningElem = element.find("div.error");
    warningElem.slideDown(100);
  }

  function removeError() {
    var warningElem = element.find('div.error');
    warningElem.slideUp(100);
  }

};

NarrowItDownController.$inject = ['SearchFactory'];
function NarrowItDownController(SearchFactory) {
  var NarrowedList = this;
  var service = SearchFactory();


  NarrowedList.get_like_items = function(searchTerm) {
    NarrowedList.items = service.getMatchedMenuItems(searchTerm);
    return NarrowedList.items
  }
  
  NarrowedList.remove = service.removeItem(index)

}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath, searchTerm) { //searchTerm
  var service = this;
  console.log(searchTerm)
   
  service.getMatchedMenuItems = function(searchTerm) {
    var foundItems =[]
    
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      })      
      .then(function (result) {
        // process result and only keep items that match
        
        for (var i = 0; i < result.shortname.length; i++) {
          console.log(result.shortname[i])
          for (var j=0; j< result.shortname[i].menu_items.length; j++) {
            
            var item = result.shortname[i].menu_items[j];
            console.log(item)
            if ((item.name.toLowerCase().indexOf(searchTerm) !== -1) || 
            (item.description.toLowerCase().indexOf(searchTerm) !== -1))     {
              foundObj = {
                name: item.name,
                description: item.description
              }
              foundItems.push(foundObj );
            } 
          }
          
      
        }
        return foundItems;
      });
  };
  
    service.removeItem = function (itemIndex) {
    foundItems.splice(itemIndex, 1);
    };
}
 


function SearchFactory() {
  var factory = function (searchTerm) {
    return new MenuSearchService(searchTerm);
  };

  return factory;
}

})();
