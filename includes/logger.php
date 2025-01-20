<?php

class Logger {
    private const LOG_DIR = 'logs';
    private const INTERACTIONS_LOG = 'interactions.log';
    private const VISITS_LOG = 'visits.log';
    private const ERRORS_LOG = 'errors.log';

    public static function init() {
        // Create logs directory if it doesn't exist
        if (!file_exists(self::LOG_DIR)) {
            mkdir(self::LOG_DIR, 0755, true);
        }

        // Create .htaccess to protect logs
        $htaccess = self::LOG_DIR . '/.htaccess';
        if (!file_exists($htaccess)) {
            file_put_contents($htaccess, "Deny from all");
        }
    }

    public static function logVisit($sessionData) {
        $logEntry = [
            'timestamp' => time(),
            'visitor_id' => $sessionData['visitor_id'],
            'visit_count' => $sessionData['visit_count'],
            'experience' => $sessionData['experience'],
            'ip' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'],
            'referrer' => $_SERVER['HTTP_REFERER'] ?? 'direct',
            'landing_page' => $_SERVER['REQUEST_URI']
        ];

        self::writeLog('visits', $logEntry);
    }

    public static function logInteraction($type, $data) {
        $sessionData = SessionHandler::getSessionData();
        $logEntry = [
            'timestamp' => time(),
            'visitor_id' => $sessionData['visitor_id'],
            'type' => $type,
            'data' => $data,
            'experience' => $sessionData['experience'],
            'page' => $_SERVER['REQUEST_URI']
        ];

        self::writeLog('interactions', $logEntry);
    }

    public static function logError($error, $context = []) {
        $sessionData = SessionHandler::getSessionData();
        $logEntry = [
            'timestamp' => time(),
            'visitor_id' => $sessionData['visitor_id'],
            'error' => $error,
            'context' => $context,
            'file' => $context['file'] ?? '',
            'line' => $context['line'] ?? '',
            'experience' => $sessionData['experience']
        ];

        self::writeLog('errors', $logEntry);
    }

    private static function writeLog($type, $data) {
        $logFile = self::LOG_DIR . "/{$type}.log";
        $logLine = json_encode($data) . "\n";
        file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
    }

    public static function getStats($type, $period = 'day') {
        $logFile = self::LOG_DIR . "/{$type}.log";
        if (!file_exists($logFile)) {
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

        return [
            'total' => count($filtered),
            'unique_visitors' => count(array_unique(array_column($filtered, 'visitor_id'))),
            'experiences' => array_count_values(array_column($filtered, 'experience'))
        ];
    }
} 