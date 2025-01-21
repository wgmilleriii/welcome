<?php
require_once '../includes/session-handler.php';
require_once '../includes/logger.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['type'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing event type']);
    exit;
}

// Initialize logging system
Logger::init();

// Log the event
try {
    switch ($data['type']) {
        case 'pageview':
            Logger::logVisit(UXSessionHandler::getSessionData());
            break;
            
        case 'interaction':
            Logger::logInteraction($data['action'], $data['details'] ?? []);
            break;
            
        case 'error':
            Logger::logError($data['message'], $data['context'] ?? []);
            break;
            
        case 'exit':
            Logger::logInteraction('exit', $data['details'] ?? []);
            break;
            
        default:
            throw new Exception('Unknown event type');
    }
    
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    error_log("Logging error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} 