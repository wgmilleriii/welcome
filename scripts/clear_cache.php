<?php
require_once __DIR__ . '/../config/mamp.php';

// Function to recursively delete directory contents
function clearDirectory($dir) {
    if (!is_dir($dir)) {
        return;
    }
    
    $files = array_diff(scandir($dir), array('.', '..'));
    foreach ($files as $file) {
        $path = $dir . '/' . $file;
        is_dir($path) ? clearDirectory($path) : unlink($path);
    }
}

// Clear PHP's opcache
if (function_exists('opcache_reset')) {
    opcache_reset();
    echo "Opcache cleared\n";
}

// Clear PHP's realpath cache
clearstatcache(true);
echo "PHP realpath cache cleared\n";

// Clear MAMP's PHP cache directory
$cacheDir = '/Applications/MAMP/tmp/php/cache';
if (is_dir($cacheDir)) {
    clearDirectory($cacheDir);
    echo "MAMP PHP cache directory cleared\n";
}

// Clear application cache
$appCacheDir = __DIR__ . '/../cache';
if (is_dir($appCacheDir)) {
    clearDirectory($appCacheDir);
    echo "Application cache directory cleared\n";
}

// Clear session files older than 24 hours
$sessionDir = '/Applications/MAMP/tmp/php';
if (is_dir($sessionDir)) {
    $files = glob($sessionDir . '/sess_*');
    $now = time();
    foreach ($files as $file) {
        if (is_file($file) && $now - filemtime($file) >= 86400) {
            unlink($file);
        }
    }
    echo "Old session files cleared\n";
}

echo "Cache clearing complete!\n"; 