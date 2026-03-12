import { cx } from '@/ui/utils/cssModules'

import styles from './LoadingScreen.module.css'

export function LoadingScreen() {
  return (
    <div className={styles.root}>
      <div className={styles.logo}>
        <div className={styles.coinStack}>
          <div className={styles.coin} />
          <div className={styles.coin} />
          <div className={styles.coin} />
        </div>
      </div>
      <h2 className={cx(styles.text)}>Loading...</h2>
    </div>
  )
}
