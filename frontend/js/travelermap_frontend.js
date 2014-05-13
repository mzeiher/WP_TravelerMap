/**
 *  Copyright (C) 2014 bitschubser.org
 *
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to 
 *  deal in the Software without restriction, including without limitation the
 *  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *  sell copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
 *  THE SOFTWARE.
 */
(function($) {
    $(document).ready(function() {
        
        var map = null;
        
        function tm_loadMap(data) {
            if(typeof data === 'string') {
                data = JSON.parse(data);
            }
            if(map) {
                map.remove();
            }
            map = L.map('tm_map_' + data.properties.mapid).setView([0,0], 3);;

            var firstLayer = null;

            var baseMaps = {};
            for(var i = 0 ; i < data.properties.layer.length; i++) {
                var layer = L.tileLayer.provider(data.properties.layer[i]);
                if(layer) {
                    baseMaps[data.properties.layer[i]] = layer;
                    if(!firstLayer) {
                        firstLayer = layer;
                    }
                }

            }
            map.addLayer(firstLayer);

            var overlayMaps = {};
            for(var i = 0 ; i < data.properties.overlays.length; i++) {
                var layer = L.tileLayer.provider(data.properties.overlays[i]);
                if(layer) {
                    overlayMaps[data.properties.overlays[i]] = layer;
                }
            }

            L.control.layers(baseMaps, overlayMaps).addTo(map);

        }
        window.tm_loadFrontendMap = tm_loadMap;

        $('#tm_load').on('click', function() {
           window.tm_loadFrontendMap($('#tm_mapdata').val());
        });
        
        $('#tm_loadTestData').on('click', function() {
           $('#tm_mapdata').val('{"type":"FeatureCollection","properties":{"layer":["OpenStreetMap.Mapnik","Stamen.Watercolor"],"overlays":["OpenWeatherMap.PressureContour"],"mapid":0},"features":[{"properties":{"title":"Start","thumbnail":"","description":"","link":"","excludeFromPath":false,"lat":47.81315451752768,"lng":7.8662109375,"arrival":null,"departure":null},"feature":"Feature","geometry":{"type":"Point","coordinates":[7.8662109375,47.81315451752768]}},{"properties":{"title":"WP1","thumbnail":"","description":"","link":"","excludeFromPath":false,"lat":53.396432127095984,"lng":10.74462890625,"arrival":1398981600000,"departure":1399068000000},"feature":"Feature","geometry":{"type":"Point","coordinates":[10.74462890625,53.396432127095984]}},{"properties":{"title":"Picture","thumbnail":"","description":"","link":"","excludeFromPath":true,"lat":53.27835301753182,"lng":9.7119140625,"arrival":null,"departure":null},"feature":"Feature","geometry":{"type":"Point","coordinates":[9.7119140625,53.27835301753182]}},{"properties":{"title":"WP2","thumbnail":"","description":"","link":"","excludeFromPath":false,"lat":27.371767300523047,"lng":2.63671875,"arrival":null,"departure":null},"feature":"Feature","geometry":{"type":"Point","coordinates":[2.63671875,27.371767300523047]}},{"properties":{"title":"WP3","thumbnail":"","description":"","link":"","excludeFromPath":false,"lat":-5.266007882805498,"lng":20.7421875,"arrival":null,"departure":null},"feature":"Feature","geometry":{"type":"Point","coordinates":[20.7421875,-5.266007882805498]}},{"properties":{"title":"WP4","thumbnail":"","description":"","link":"","excludeFromPath":false,"lat":-13.752724664396975,"lng":-49.04296875,"arrival":null,"departure":null},"feature":"Feature","geometry":{"type":"Point","coordinates":[-49.04296875,-13.752724664396975]}}]}');
        });
    });
})(jQuery);
