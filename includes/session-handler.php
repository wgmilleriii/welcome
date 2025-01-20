<?php
session_start();

class UXSessionHandler {
    private const COOKIE_NAME = 'preferred_experience';
    private const COOKIE_DURATION = 2592000; // 30 days in seconds
    private const SESSION_PREFIX = 'ux_';

    public static function initSession($ux = null) {
        // Set initial visit timestamp if not set
        if (!isset($_SESSION[self::SESSION_PREFIX . 'first_visit'])) {
            $_SESSION[self::SESSION_PREFIX . 'first_visit'] = time();
            $_SESSION[self::SESSION_PREFIX . 'visit_count'] = 1;
        } else {
            $_SESSION[self::SESSION_PREFIX . 'visit_count']++;
        }

        // Update last visit
        $_SESSION[self::SESSION_PREFIX . 'last_visit'] = time();
        
        // Set experience preference if provided
        if ($ux) {
            self::setPreferredExperience($ux);
        } else {
            // If no experience is provided, get the current preferred experience
            $_SESSION[self::SESSION_PREFIX . 'experience'] = self::getPreferredExperience();
        }

        // Generate or get visitor ID
        if (!isset($_SESSION[self::SESSION_PREFIX . 'visitor_id'])) {
            $_SESSION[self::SESSION_PREFIX . 'visitor_id'] = uniqid('v_', true);
        }

        error_log("Session initialized - Visitor ID: " . $_SESSION[self::SESSION_PREFIX . 'visitor_id'] . 
                 ", Experience: " . $_SESSION[self::SESSION_PREFIX . 'experience']);

        return [
            'visitor_id' => $_SESSION[self::SESSION_PREFIX . 'visitor_id'],
            'visit_count' => $_SESSION[self::SESSION_PREFIX . 'visit_count'],
            'first_visit' => $_SESSION[self::SESSION_PREFIX . 'first_visit'],
            'last_visit' => $_SESSION[self::SESSION_PREFIX . 'last_visit'],
            'experience' => $_SESSION[self::SESSION_PREFIX . 'experience']
        ];
    }

    public static function setPreferredExperience($experience) {
        error_log("Setting preferred experience: " . $experience);
        
        setcookie(
            self::COOKIE_NAME,
            $experience,
            time() + self::COOKIE_DURATION,
            '/',
            '',
            true,  // Secure
            true   // HttpOnly
        );
        $_SESSION[self::SESSION_PREFIX . 'experience'] = $experience;
    }

    public static function getPreferredExperience() {
        $experience = 'stravinsky'; // Default experience
        
        if (isset($_GET['ux'])) {
            $experience = $_GET['ux'];
            error_log("Experience from URL: " . $experience);
        } elseif (isset($_COOKIE[self::COOKIE_NAME])) {
            $experience = $_COOKIE[self::COOKIE_NAME];
            error_log("Experience from cookie: " . $experience);
        } elseif (isset($_SESSION[self::SESSION_PREFIX . 'experience'])) {
            $experience = $_SESSION[self::SESSION_PREFIX . 'experience'];
            error_log("Experience from session: " . $experience);
        } else {
            error_log("Using default experience: " . $experience);
        }
        
        return $experience;
    }

    public static function getSessionData() {
        $data = [
            'visitor_id' => $_SESSION[self::SESSION_PREFIX . 'visitor_id'] ?? null,
            'visit_count' => $_SESSION[self::SESSION_PREFIX . 'visit_count'] ?? 0,
            'first_visit' => $_SESSION[self::SESSION_PREFIX . 'first_visit'] ?? null,
            'last_visit' => $_SESSION[self::SESSION_PREFIX . 'last_visit'] ?? null,
            'experience' => $_SESSION[self::SESSION_PREFIX . 'experience'] ?? 'stravinsky'
        ];
        
        error_log("Getting session data: " . json_encode($data));
        return $data;
    }
} 