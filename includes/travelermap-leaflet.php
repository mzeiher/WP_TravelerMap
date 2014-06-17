<?php
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

if ( is_admin() ) {
    add_action( 'admin_enqueue_scripts','travelermap_enqueue_leaflet_scripts' );
    add_action( 'admin_enqueue_scripts','travelermap_enqueue_leaflet_styles' );
} else {
    add_action( 'wp_enqueue_scripts','travelermap_enqueue_leaflet_scripts' );
    add_action( 'wp_enqueue_scripts','travelermap_enqueue_leaflet_styles' );    
}

function travelermap_enqueue_leaflet_scripts() {
    wp_enqueue_script( 'leaflet', TM_URL . "js/leaflet-src.js" , array(), '0.7.2', false);
    wp_enqueue_script( 'leaflet-providers', TM_URL . "js/leaflet-providers.js" , array(), '1.0.5', false);   
    wp_enqueue_script( 'leaflet-markers', TM_URL . "js/leaflet.awesome-markers.js" , array(), '2.0.2', false);   
    wp_enqueue_script( 'leaflet-geodesic', TM_URL . "js/leaflet.geodesic.js" , array(), '1.0.0', false);   
}

function travelermap_enqueue_leaflet_styles() {
    wp_enqueue_style( 'leafet', TM_URL . "media/leaflet.css" );
    wp_enqueue_style( 'leafet-markers', TM_URL . "media/leaflet.awesome-markers.css" );
}

?>