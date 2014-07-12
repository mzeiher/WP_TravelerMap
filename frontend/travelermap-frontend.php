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

add_action( 'wp_enqueue_scripts','travelermap_enqueue_frontend_scripts' );
add_action( 'wp_enqueue_scripts','travelermap_enqueue_frontend_styles' );    

add_shortcode( 'tm_map', 'travelermap_show_map' );

function travelermap_show_map($atts, $content = null) {
    
    global $wpdb;
    
    static $map_id = 0;
    $map_id++;
    
    extract( shortcode_atts( array (
        "height"  => '400',
        "id"      => '',
        "connectmaps" => 'false',
        'spinner' => 'true',
        'zoomlevel' => '3'
    ), $atts ) );
    
    $dateFormat = get_option('date_format');
    
    $ids = explode(",", $id);
    $map_table = $wpdb->prefix . "travelermap_maps";
    
    $separator = "";
    $script = "[";
    foreach ( $ids as $mapid ) {
        $result = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM $map_table WHERE ID = %d",
                $mapid
            )
        );
        if(!$result) {continue;}
        $script .= $separator;
        
        $script .= $result->map;
        $separator = ",";
    }
    $script .= "]";
    $output = "";
    $output .= '<div id="tm_map_'. $map_id .'"></div>';
    $output .= '<script type="text/javascript">';
    $output .= '(function($) { $(document).ready(function() {';
    $output .= 'window.tm_loadFrontendMap(';
    $output .= str_replace('\"', '"', $script);
    $output .= ",";
    $output .= "$('#tm_map_$map_id')";
    $output .= ",";
    $output .= "{connectMaps:$connectmaps, height:$height, spinner:$spinner, dateFormat:'$dateFormat', zoomLevel:$zoomlevel}";
    $output .= ');';
    $output .= '});';
    $output .= '})(jQuery);';
    $output .= '</script>';
    
    return $output;
}

function travelermap_enqueue_frontend_scripts() {
    wp_enqueue_script('jquery');
    wp_enqueue_script('jquery-colorbox', TM_URL . "js/jquery.colorbox-min.js" , array('jquery'), '1.5.9', false);
    wp_enqueue_script('jquery-dateFormat', TM_URL . "js/jquery-dateFormat.min.js" , array('jquery'), '1.0.0', false);
    wp_enqueue_script('json2');
    wp_enqueue_script('travelermap-frontend', TM_URL . "frontend/js/travelermap-frontend.js" , array('jquery'), '1.4.0', false);
}

function travelermap_enqueue_frontend_styles() {
    wp_enqueue_style('tm-frontend', TM_URL . "media/tm-frontend.css" );
    wp_enqueue_style('font-awesome', TM_URL . "media/font-awesome.min.css" );
    wp_enqueue_style('jquery-colorbox-style', TM_URL . "media/colorbox/colorbox.css");
}
?>