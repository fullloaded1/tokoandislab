<?php
/**
 * Front to the WordPress application.
 * MODIFIED UNTUK ANDISLAB NEXT.JS (VERCEL)
 */

$request_uri = $_SERVER['REQUEST_URI'];

// Pengecualian: Jangan redirect jika sedang mengakses Admin Panel atau API
if (
    strpos($request_uri, '/wp-admin') === false && 
    strpos($request_uri, '/wp-login.php') === false && 
    strpos($request_uri, '/wp-json') === false
) {
    // Redirect semua pengunjung web ke Vercel
    header("Location: https://tokoandislab.vercel.app" . $request_uri, true, 301);
    exit;
}

/**
 * Tells WordPress to load the WordPress theme and output it.
 *
 * @var bool
 */
define( 'WP_USE_THEMES', true );

/** Loads the WordPress Environment and Template */
require __DIR__ . '/wp-blog-header.php';
