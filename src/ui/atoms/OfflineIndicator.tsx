import { useI18nContext, useOnlineStatus } from '@/app'

import styles from './OfflineIndicator.module.css'

export function OfflineIndicator() {
  const online = useOnlineStatus()
  const { t } = useI18nContext()
  if (online) {
    return null
  }
  return (
    <div className={styles.banner} role="status" aria-live="polite">
      {t('offline.banner')}
    </div>
  )
}
