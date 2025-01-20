<?php
// MAMP Configuration
return [
    'base_url' => '/cmiller/public_html/git/welcome',
    'document_root' => '/Applications/MAMP/htdocs/cmiller/public_html/git/welcome',
    'server' => [
        'host' => 'localhost',
        'port' => 8888,
        'php_version' => PHP_VERSION
    ],
    'mysql' => [
        'host' => 'localhost',
        'port' => 8889,
        'username' => 'root',
        'password' => 'root'
    ],
    'paths' => [
        'logs' => 'logs',
        'mp3' => 'mp3',
        'waveforms' => 'includes/i/waveforms'
    ]
]; 