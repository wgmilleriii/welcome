<?php
require_once '../includes/session-handler.php';
require_once '../includes/logger.php';

header('Content-Type: application/json');

// Initialize logging system
Logger::init();

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

// Log the event
try {
    switch ($data['type']) {
        case 'pageview':
            Logger::logVisit(SessionHandler::getSessionData());
            break;
            
        case 'interaction':
            Logger::logInteraction($data['action'], $data['details'] ?? []);
            break;
            
        case 'error':
            Logger::logError($data['message'], $data['context'] ?? []);
            break;
            
        default:
            throw new Exception('Unknown event type');
    }
    
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} 