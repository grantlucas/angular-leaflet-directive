angular.module("leaflet-directive").directive('eventBroadcast', function ($log, $rootScope, leafletData, leafletHelpers, leafletEvents) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        transclude: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var safeApply = leafletHelpers.safeApply,
                isDefinedAndNotNull = leafletHelpers.isDefinedAndNotNull,
                isDefined = leafletHelpers.isDefined,
                isObject = leafletHelpers.isObject,
                leafletScope  = controller.getLeafletScope(),
                eventBroadcast = leafletScope.eventBroadcast,
                availableMapEvents = leafletEvents.getAvailableMapEvents(),
                genDispatchMapEvent = leafletEvents.genDispatchMapEvent,
                availableMarkerEvents = leafletEvents.getAvailableMarkerEvents(),
                genDispatchMarkerEvent = leafletEvents.genDispatchMarkerEvent;

            // Set up Map Events
            controller.getMap().then(function(map) {
                var mapEvents = [];
                var i;
                var eventName;
                var logic = "broadcast";

                if (isObject(eventBroadcast)) {
                    // We have a possible valid object
                    if (eventBroadcast.map === undefined || eventBroadcast.map === null) {
                        // We do not have events enable/disable do we do nothing (all enabled by default)
                        mapEvents = availableMapEvents;
                    } else if (typeof eventBroadcast.map !== 'object') {
                        // Not a valid object
                        $log.warn("[AngularJS - Leaflet] event-broadcast.map must be an object check your model.");
                    } else {
                        // We have a possible valid map object
                        // Event propadation logic
                        if (eventBroadcast.map.logic !== undefined && eventBroadcast.map.logic !== null) {
                            // We take care of possible propagation logic
                            if (eventBroadcast.map.logic !== "emit" && eventBroadcast.map.logic !== "broadcast") {
                                // This is an error
                                $log.warn("[AngularJS - Leaflet] Available event propagation logic are: 'emit' or 'broadcast'.");
                            } else if (eventBroadcast.map.logic === "emit") {
                                logic = "emit";
                            }
                        }
                        // Enable / Disable
                        var mapEventsEnable = false, mapEventsDisable = false;
                        if (eventBroadcast.map.enable !== undefined && eventBroadcast.map.enable !== null) {
                            if (typeof eventBroadcast.map.enable === 'object') {
                                mapEventsEnable = true;
                            }
                        }
                        if (eventBroadcast.map.disable !== undefined && eventBroadcast.map.disable !== null) {
                            if (typeof eventBroadcast.map.disable === 'object') {
                                mapEventsDisable = true;
                            }
                        }
                        if (mapEventsEnable && mapEventsDisable) {
                            // Both are active, this is an error
                            $log.warn("[AngularJS - Leaflet] can not enable and disable events at the time");
                        } else if (!mapEventsEnable && !mapEventsDisable) {
                            // Both are inactive, this is an error
                            $log.warn("[AngularJS - Leaflet] must enable or disable events");
                        } else {
                            // At this point the map object is OK, lets enable or disable events
                            if (mapEventsEnable) {
                                // Enable events
                                for (i = 0; i < eventBroadcast.map.enable.length; i++) {
                                    eventName = eventBroadcast.map.enable[i];
                                    // Do we have already the event enabled?
                                    if (mapEvents.indexOf(eventName) !== -1) {
                                        // Repeated event, this is an error
                                        $log.warn("[AngularJS - Leaflet] This event " + eventName + " is already enabled");
                                    } else {
                                        // Does the event exists?
                                        if (availableMapEvents.indexOf(eventName) === -1) {
                                            // The event does not exists, this is an error
                                            $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist");
                                        } else {
                                            // All ok enable the event
                                            mapEvents.push(eventName);
                                        }
                                    }
                                }
                            } else {
                                // Disable events
                                mapEvents = availableMapEvents;
                                for (i = 0; i < eventBroadcast.map.disable.length; i++) {
                                    eventName = eventBroadcast.map.disable[i];
                                    var index = mapEvents.indexOf(eventName);
                                    if (index === -1) {
                                        // The event does not exist
                                        $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist or has been already disabled");
                                    } else {
                                        mapEvents.splice(index, 1);
                                    }
                                }
                            }
                        }
                    }

                    for (i = 0; i < mapEvents.length; i++) {
                        eventName = mapEvents[i];
                        map.on(eventName, genDispatchMapEvent(leafletScope, eventName, logic), {
                            eventName: eventName
                        });
                    }
                } else {
                    // Not a valid object
                    $log.warn("[AngularJS - Leaflet] event-broadcast must be an object, check your model.");
                }
            });

            // Set up Marker Events
            controller.getMarkers().then(function(leafletMarkers) {
                var markerEvents = [];
                var i;
                var eventName;
                var logic="broadcast";

                if(isObject(eventBroadcast)) {
                    // We have a possible valid object
                    if (eventBroadcast.marker === undefined || eventBroadcast.marker === null) {
                        // We do not have events enable/disable do we do nothing (all enabled by default)
                        markerEvents = availableMarkerEvents;
                    } else if (typeof eventBroadcast.marker !== 'object') {
                        // Not a valid object
                        $log.warn("[AngularJS - Leaflet] event-broadcast.marker must be an object check your model.");
                    } else {
                        // We have a possible valid map object
                        // Event propadation logic
                        if (eventBroadcast.marker.logic !== undefined && eventBroadcast.marker.logic !== null) {
                            // We take care of possible propagation logic
                            if (eventBroadcast.marker.logic !== "emit" && eventBroadcast.marker.logic !== "broadcast") {
                                // This is an error
                                $log.warn("[AngularJS - Leaflet] Available event propagation logic are: 'emit' or 'broadcast'.");
                            } else if (eventBroadcast.marker.logic === "emit") {
                                logic = "emit";
                            }
                        }
                        // Enable / Disable
                        var markerEventsEnable = false, markerEventsDisable = false;
                        if (eventBroadcast.marker.enable !== undefined && eventBroadcast.marker.enable !== null) {
                            if (typeof eventBroadcast.marker.enable === 'object') {
                                markerEventsEnable = true;
                            }
                        }
                        if (eventBroadcast.marker.disable !== undefined && eventBroadcast.marker.disable !== null) {
                            if (typeof eventBroadcast.marker.disable === 'object') {
                                markerEventsDisable = true;
                            }
                        }
                        if (markerEventsEnable && markerEventsDisable) {
                            // Both are active, this is an error
                            $log.warn("[AngularJS - Leaflet] can not enable and disable events at the same time");
                        } else if (!markerEventsEnable && !markerEventsDisable) {
                            // Both are inactive, this is an error
                            $log.warn("[AngularJS - Leaflet] must enable or disable events");
                        } else {
                            // At this point the marker object is OK, lets enable or disable events
                            if (markerEventsEnable) {
                                // Enable events
                                for (i = 0; i < eventBroadcast.marker.enable.length; i++) {
                                    eventName = eventBroadcast.marker.enable[i];
                                    // Do we have already the event enabled?
                                    if (markerEvents.indexOf(eventName) !== -1) {
                                        // Repeated event, this is an error
                                        $log.warn("[AngularJS - Leaflet] This event " + eventName + " is already enabled");
                                    } else {
                                        // Does the event exists?
                                        if (availableMarkerEvents.indexOf(eventName) === -1) {
                                            // The event does not exists, this is an error
                                            $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist");
                                        } else {
                                            // All ok enable the event
                                            markerEvents.push(eventName);
                                        }
                                    }
                                }
                            } else {
                                // Disable events
                                markerEvents = availableMarkerEvents;
                                for (i = 0; i < eventBroadcast.marker.disable.length; i++) {
                                    eventName = eventBroadcast.marker.disable[i];
                                    var index = markerEvents.indexOf(eventName);
                                    if (index === -1) {
                                        // The event does not exist
                                        $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist or has been already disabled");
                                    } else {
                                        markerEvents.splice(index, 1);
                                    }
                                }
                            }
                        }
                    }
                }

                // Loop through available markers and add their events
                for (var key in leafletMarkers) {
                    for (i = 0; i < markerEvents.length; i++) {
                        eventName = markerEvents[i];
                        leafletMarkers[key].on(eventName, genDispatchMarkerEvent(leafletScope, eventName, logic, key), {
                            eventName: eventName,
                            key: key
                        });
                    }
                }
            });
        }
    };
});
