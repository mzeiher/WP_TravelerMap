<?php
function travelermap_editmaps() {
    
    global $wpdb;
    
    $map_table = $wpdb->prefix . "tm_map";
    $results = $wpdb->get_results( "SELECT * FROM $map_table");
    
    print_r($results);
?>


<?php 
} 
?>
