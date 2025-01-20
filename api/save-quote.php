<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // For testing
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Enable error reporting for testing
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request data']);
    exit;
}

// Update path for localhost
$quotesDir = __DIR__ . '/../data/quotes';

// Ensure directory exists and is writable
if (!is_dir($quotesDir)) {
    if (!mkdir($quotesDir, 0755, true)) {
        error_log("Failed to create directory: $quotesDir");
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create storage directory']);
        exit;
    }
}

// Log the save attempt
error_log("Attempting to save quote: " . json_encode($data));

// Save individual quote file
$quoteFile = $quotesDir . '/' . $data['id'] . '.json';
$saved = file_put_contents($quoteFile, json_encode($data, JSON_PRETTY_PRINT));

if ($saved) {
    // Update index file
    $indexFile = $quotesDir . '/index.json';
    $index = [];
    
    if (file_exists($indexFile)) {
        $index = json_decode(file_get_contents($indexFile), true) ?? [];
    }
    
    // Add to index
    $index[] = [
        'id' => $data['id'],
        'timestamp' => $data['timestamp'],
        'attribution' => $data['attribution'],
        'preview' => substr($data['quote']['start'], 0, 30) . '...'
    ];
    
    // Sort by timestamp descending
    usort($index, function($a, $b) {
        return strcmp($b['timestamp'], $a['timestamp']);
    });
    
    file_put_contents($indexFile, json_encode($index, JSON_PRETTY_PRINT));
    
    echo json_encode([
        'success' => true,
        'shareUrl' => '/cmiller/public_html/git/welcome/share/' . $data['id']
    ]);
} else {
    error_log("Failed to save quote to file: $quoteFile");
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save quote']);
}
?> 