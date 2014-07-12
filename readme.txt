=== wp-travelermap ===
Contributors: der_maddis
Donate link: http://bitschubser.org
Tags: travel, map, waypoints
Requires at least: 3.9.0
Tested up to: 3.9.1
Stable tag: 1.4.0
License: MIT
License URI: http://opensource.org/licenses/MIT

A simple Plugin to create travel routes and manage maps

== Description ==

This plugin allows the creation of travel maps with routes and point of interests.
The points or route section can be linked with posts or media attachments.

To place the maps within posts use the shortcode [tm_map id=""] where id is either the map id or
a comma separated list of map ids to display.
Additional parameters for the shortcode are: connectmaps="true|false" to connect the maps in the order
specified in the comma separated id list and spinner="true|false" to disable the spinner to navigate
through markers, zoomlevel="0-16" to set the initial zoom level (0 min, 16 max level)

example:
[tm_map id="1"]
[tm_map id="1,2" connectmaps="false"]
[tm_map id="1,6,3" spinner="false" connectmaps="true"]

The Plugin is build with the help of leaflet.js and some 3rd party libraries. The
licenses of the libraries are in the appendix "3rd Party Licenses" within this readme.

If you have ideas for the plugin or if you found some bugs just let me know. I submitted this plugin
in a rather early but stable phase to react to improvements and feature requests from the community

== Installation ==

1. Extract the wp-travel.zip and copy it to the /wp-contet/plugins directory.
2. Activate the wp-travelmap plugin

== Frequently Asked Questions ==

= What do i do when i have questions/suggestions =

Go to http://blog.bitschubser.org and ask in the wp-travelermap section or here

== Screenshots ==

1. Map List
2. Map Edit
3. Map Display

== Changelog ==

= 1.4.0 =
* Added more marker possibities

= 1.3.0 =
* Moved Post linking from endsection to startsection

= 1.2.0 =
* added zoomlevel to shortcode to set initial zoom level
* added startendsection marker type to create consecutive sections
* fixed some bugs

= 1.1.0 =
* added ability to place marker in admin menu to a specific address (no marker dragging anymore)
* fixed some bugs

= 1.0.0 =
* Initial Release of the BETA

== Upgrade Notice ==

To upgrade, remove old wp-travelermap folder under wp-content/plugins and replace it with the new version

First Version

== 3rd Party Licenses ==
Colorbox v1.5.9 - 2014-04-25
jQuery lightbox and modal window plugin
(c) 2014 Jack Moore - http://www.jacklmoore.com/colorbox
license: http://www.opensource.org/licenses/mit-license.php

Leaflet, a JavaScript library for mobile-friendly interactive maps. http://leafletjs.com
(c) 2010-2013, Vladimir Agafonkin
(c) 2010-2011, CloudMade
Licesed BSD

Slimbox v2.05 - The ultimate lightweight Lightbox clone for jQuery
(c) 2007-2013 Christophe Beyls <http://www.digitalia.be>
MIT-style license.

jQuery UI - v1.10.4 - 2014-04-02
http://jqueryui.com
Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.accordion.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.datepicker.js, jquery.ui.dialog.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.effect.js, jquery.ui.effect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js, jquery.ui.effect-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js, jquery.ui.menu.js, jquery.ui.progressbar.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.slider.js, jquery.ui.sortable.js, jquery.ui.spinner.js, jquery.ui.tabs.js, jquery.ui.tooltip.js
Copyright 2014 jQuery Foundation and other contributors; Licensed MIT

Leaflet.AwesomeMarkers
A plugin that adds colorful iconic markers for Leaflet, based on the Font Awesome icons
(c) 2012-2013, Lennard Voogdt Licensed MIT
http://leafletjs.com
https://github.com/lvoogdt

Leaflet.geodesic
(c) 2013 Fragger (Kevin Brasier) Licensed BSD2
http://github.com/Fragger

Font Awesome 4.1.0 by @davegandy - http://fontawesome.io - @fontawesome
License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)

Spectrum Colorpicker v1.3.4
https://github.com/bgrins/spectrum
Author: Brian Grinstead
License: MIT

jquert-dateFormat 1.0.0
(c)2014 phstc
https://github.com/phstc/jquery-dateFormat
License: MIT & GPL

Map Icons Collection
Creative Commons 3.0 BY-SA
Author : Nicolas Mollet
http://mapicons.nicolasmollet.com/