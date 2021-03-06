angular.module("leaflet-directive").directive('maxbounds', function ($log, leafletMapDefaults, leafletHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var isDefined = leafletHelpers.isDefined,
                isNumber  = leafletHelpers.isNumber,
                leafletScope  = controller.getLeafletScope(),
                maxBounds = leafletScope.maxBounds;


            controller.getMap().then(function(map) {
                if (isDefined(maxBounds) && isDefined(maxBounds.southWest) && isDefined(maxBounds.northEast)) {
                    leafletScope.$watch("maxBounds", function (maxBounds) {
                        if (isDefined(maxBounds.southWest) && isDefined(maxBounds.northEast) && isNumber(maxBounds.southWest.lat) && isNumber(maxBounds.southWest.lng) && isNumber(maxBounds.northEast.lat) && isNumber(maxBounds.northEast.lng)) {
                            map.setMaxBounds(
                                new L.LatLngBounds(
                                    new L.LatLng(maxBounds.southWest.lat, maxBounds.southWest.lng),
                                    new L.LatLng(maxBounds.northEast.lat, maxBounds.northEast.lng)
                                )
                            );
                        }
                    });
                } else {
                    $log.warn("[AngularJS - Leaflet] 'maxBounds' is defined in the current scope, but not correctly initialized.");
                }
            });
        }
    };
});
