<?php

class Logger {
    private const LOG_DIR = 'logs';
    private const INTERACTIONS_LOG = 'interactions.log';
    private const VISITS_LOG = 'visits.log';
    private const ERRORS_LOG = 'errors.log';
    private const DEBUG_LOG = 'debug.log';

    public static function init() {
        error_log("Initializing Logger");
        
        // Create logs directory if it doesn't exist
        if (!file_exists(self::LOG_DIR)) {
            mkdir(self::LOG_DIR, 0755, true);
            error_log("Created logs directory: " . self::LOG_DIR);
        }

        // Create .htaccess to protect logs
        $htaccess = self::LOG_DIR . '/.htaccess';
        if (!file_exists($htaccess)) {
            file_put_contents($htaccess, "Deny from all");
            error_log("Created .htaccess in logs directory");
        }
    }

    public static function logVisit($sessionData) {
        error_log("Logging visit with session data: " . json_encode($sessionData));
        
        $logEntry = [
            'timestamp' => time(),
            'visitor_id' => $sessionData['visitor_id'],
            'visit_count' => $sessionData['visit_count'],
            'experience' => $sessionData['experience'] ?? 'unknown',
            'ip' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'],
            'referrer' => $_SERVER['HTTP_REFERER'] ?? 'direct',
            'landing_page' => $_SERVER['REQUEST_URI']
        ];

        self::writeLog('visits', $logEntry);
        self::debug("Visit logged for visitor: " . $sessionData['visitor_id']);
    }

    public static function logInteraction($type, $data) {
        error_log("Logging interaction - Type: " . $type . ", Data: " . json_encode($data));
        
        $sessionData = UXSessionHandler::getSessionData();
        $logEntry = [
            'timestamp' => time(),
            'visitor_id' => $sessionData['visitor_id'],
            'type' => $type,
            'data' => $data,
            'experience' => $sessionData['experience'] ?? 'unknown',
            'page' => $_SERVER['REQUEST_URI']
        ];

        self::writeLog('interactions', $logEntry);
        self::debug("Interaction logged - Type: " . $type);
    }

    public static function logError($error, $context = []) {
        error_log("Logging error: " . $error . ", Context: " . json_encode($context));
        
        $sessionData = UXSessionHandler::getSessionData();
        $logEntry = [
            'timestamp' => time(),
            'visitor_id' => $sessionData['visitor_id'],
            'error' => $error,
            'context' => $context,
            'file' => $context['file'] ?? '',
            'line' => $context['line'] ?? '',
            'experience' => $sessionData['experience'] ?? 'unknown'
        ];

        self::writeLog('errors', $logEntry);
        self::debug("Error logged: " . $error);
    }

    private static function writeLog($type, $data) {
        $logFile = self::LOG_DIR . "/{$type}.log";
        $logLine = json_encode($data) . "\n";
        file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
        error_log("Wrote to {$type} log: " . substr($logLine, 0, 100) . (strlen($logLine) > 100 ? '...' : ''));
    }

    private static function debug($message) {
        $logEntry = [
            'timestamp' => time(),
            'message' => $message,
            'request_uri' => $_SERVER['REQUEST_URI'],
            'method' => $_SERVER['REQUEST_METHOD']
        ];
        
        $logFile = self::LOG_DIR . "/" . self::DEBUG_LOG;
        $logLine = json_encode($logEntry) . "\n";
        file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
    }

    public static function getStats($type, $period = 'day') {
        $logFile = self::LOG_DIR . "/{$type}.log";
        if (!file_exists($logFile)) {
            error_log("Stats requested for non-existent log file: " . $logFile);
            return [];
        }

        $logs = array_filter(
            array_map('json_decode', 
            file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES)
        ));

        $cutoff = strtotime("-1 {$period}");
        $filtered = array_filter($logs, function($log) use ($cutoff) {
            return $log->timestamp >= $cutoff;
        });

        $stats = [
            'total' => count($filtered),
            'unique_visitors' => count(array_unique(array_column($filtered, 'visitor_id'))),
            'experiences' => array_count_values(array_column($filtered, 'experience'))
        ];
        
        error_log("Generated stats for {$type}: " . json_encode($stats));
        return $stats;
    }
} 