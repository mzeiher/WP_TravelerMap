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

add_action( 'wp_ajax_travelermap_ajax_updatemap', 'travelermap_ajax_updatemap' );
add_action( 'wp_ajax_travelermap_ajax_getpostnames', 'travelermap_ajax_getpostnames' );
add_action( 'wp_ajax_travelermap_ajax_getpostinfos', 'travelermap_ajax_getpostinfos' );

function travelermap_ajax_updatemap() {
    check_ajax_referer( 'travelermap_ajax_updatemap');
    global $wpdb;
    
    $map_table = $wpdb->prefix . "travelermap_maps";
    $wpdb->query(
        $wpdb->prepare(
            "UPDATE $map_table SET name=%s, map=%s WHERE id=%d",
            $_POST['name'], $_POST['map'], $_POST['id']
        )
    );
    wp_send_json_success();
    die();
}

function travelermap_ajax_getpostnames() {
    check_ajax_referer( 'travelermap_ajax_getpostnames');
    global $wpdb;
    
    $table = $wpdb->prefix . "posts";
    $results = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT id, post_title FROM $table WHERE post_status=%s AND post_type=%s",
                'publish', 'post'
        )
    );
    $response = array();
    foreach ( $results as $map ) {
        array_push($response, array('value' => $map->id, 'label' => $map->post_title));
    }
    wp_send_json( $response );	
    die();
}

function travelermap_ajax_getpostinfos() {
    check_ajax_referer( 'travelermap_ajax_getpostinfos');
    
    $result = get_post($_GET['post_id']);
    
    if($result == false) {
        echo "error";
        wp_send_json_error();
    }
    $postId = $result->ID;
    $thumbnailId = get_post_thumbnail_id( $result->ID);
    $permalink = get_permalink( $result->ID);
    $thumbnail = wp_get_attachment_image_src( $thumbnailId );
    $fullsize = wp_get_attachment_image_src( $thumbnailId, 'full');
    $description = "";
    if(!empty($result->post_excerpt)) {
        $description = $result->post_excerpt;
    } else {
        $description = travelermap_create_excerpt($result->post_content);
    }
    $title = $result->post_title;
    $date = $result->post_date;
    
    $response = array(
        "postId" => $postId,
        "link" => $permalink,
        "thumbnail" => $thumbnail[0] === null ? "" : $thumbnail[0],
        "mediaId" => $thumbnailId === false ? -1 : $thumbnailId,
        "fullsize" => $fullsize[0] === null ? "": $fullsize[0],
        "description" => $description,
        "title" => $title,
        "date" => $date
    );
    
    wp_send_json( $response );	
}

function travelermap_create_excerpt($text) {
    $length = 20;
    $text  = strip_tags( strip_shortcodes( $text ) );
    $words = explode( ' ', $text, $length + 1 );

    if( count ( $words ) > $length ) {
            array_pop( $words );
            array_push( $words, '…' );
            $text = implode( ' ', $words ) ;
    }
    return $text;	
}

?>