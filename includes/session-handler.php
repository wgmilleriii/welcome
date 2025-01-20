<?php
session_start();

class SessionHandler {
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
        }

        // Generate or get visitor ID
        if (!isset($_SESSION[self::SESSION_PREFIX . 'visitor_id'])) {
            $_SESSION[self::SESSION_PREFIX . 'visitor_id'] = uniqid('v_', true);
        }

        return [
            'visitor_id' => $_SESSION[self::SESSION_PREFIX . 'visitor_id'],
            'visit_count' => $_SESSION[self::SESSION_PREFIX . 'visit_count'],
            'first_visit' => $_SESSION[self::SESSION_PREFIX . 'first_visit'],
            'last_visit' => $_SESSION[self::SESSION_PREFIX . 'last_visit']
        ];
    }

    public static function setPreferredExperience($experience) {
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
        if (isset($_GET['ux'])) {
            return $_GET['ux'];
        }
        if (isset($_COOKIE[self::COOKIE_NAME])) {
            return $_COOKIE[self::COOKIE_NAME];
        }
        if (isset($_SESSION[self::SESSION_PREFIX . 'experience'])) {
            return $_SESSION[self::SESSION_PREFIX . 'experience'];
        }
        return 'stravinsky'; // Default experience
    }

    public static function getSessionData() {
        return [
            'visitor_id' => $_SESSION[self::SESSION_PREFIX . 'visitor_id'] ?? null,
            'visit_count' => $_SESSION[self::SESSION_PREFIX . 'visit_count'] ?? 0,
            'first_visit' => $_SESSION[self::SESSION_PREFIX . 'first_visit'] ?? null,
            'last_visit' => $_SESSION[self::SESSION_PREFIX . 'last_visit'] ?? null,
            'experience' => $_SESSION[self::SESSION_PREFIX . 'experience'] ?? null
        ];
    }
} 