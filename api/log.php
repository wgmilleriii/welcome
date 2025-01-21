<?php
require_once '../includes/session-handler.php';
require_once '../includes/logger.php';

header('Content-Type: application/json');

// Allow CORS from localhost
header('Access-Control-Allow-Origin: http://localhost:8888');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get the raw POST data
$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit();
}

// Add timestamp and client IP
$data['timestamp'] = time();
$data['ip'] = $_SERVER['REMOTE_ADDR'];

// Determine log file based on event type
$logFile = '../logs/';
switch ($data['type'] ?? 'debug') {
    case 'pageview':
        $logFile .= 'visits.log';
        break;
    case 'interaction':
        $logFile .= 'interactions.log';
        break;
    default:
        $logFile .= 'debug.log';
}

// Append log entry
$logEntry = json_encode($data) . "\n";
if (file_put_contents($logFile, $logEntry, FILE_APPEND)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write log']);
} 