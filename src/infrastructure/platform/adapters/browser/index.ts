/**
 * Browser Platform Adapter
 * Implements PlatformApi using standard Web APIs
 */

import type { PlatformApi } from '../contracts/types'

const browserHaptics = {
  async light() {
    if (navigator.vibrate) navigator.vibrate(10)
  },
  async medium() {
    if (navigator.vibrate) navigator.vibrate(20)
  },
  async heavy() {
    if (navigator.vibrate) navigator.vibrate(50)
  },
}

const browserStorage = {
  async getItem(key: string) {
    return localStorage.getItem(key)
  },
  async setItem(key: string, value: string) {
    localStorage.setItem(key, value)
  },
  async removeItem(key: string) {
    localStorage.removeItem(key)
  },
  async clear() {
    localStorage.clear()
  },
}

const browserDiagnostics = {
  logError(message: string, context?: Record<string, any>) {
    console.error('[ERROR]', message, context)
  },
  logWarning(message: string) {
    console.warn('[WARN]', message)
  },
  logInfo(message: string) {
    console.log('[INFO]', message)
  },
  trackEvent(eventName: string, data?: Record<string, any>) {
    // No-op in browser; could integrate analytics service
  },
}

const browserAudio = {
  async play(soundId: string) {
    // No-op (handled by app layer)
  },
  async stop(soundId: string) {
    // No-op
  },
  setVolume(level: number) {
    // No-op
  },
}

const browserDevice = {
  isOnline() {
    return navigator.onLine
  },
  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      isMobile: /iPhone|iPad|Android/i.test(navigator.userAgent),
      isTablet: /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent),
      isDesktop: !/iPhone|iPad|Android/i.test(navigator.userAgent),
      supportsHaptics: !!navigator.vibrate,
      supportsNotifications: !!('Notification' in window),
    }
  },
  onOrientationChange(callback) {
    const handler = () => {
      const orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      callback(orientation)
    }
    window.addEventListener('orientationchange', handler)
    return () => window.removeEventListener('orientationchange', handler)
  },
}

export function createBrowserPlatformApi(): PlatformApi {
  return {
    haptics: browserHaptics,
    storage: browserStorage,
    diagnostics: browserDiagnostics,
    audio: browserAudio,
    device: browserDevice,
    name: 'web',
  }
}
