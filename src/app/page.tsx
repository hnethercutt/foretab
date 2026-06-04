'use client'
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <section className={styles.headings}>
            <h1>Everything saved. Only a few things in view.</h1>
            <p className={styles.subheading1}>
              Keep a few tasks at the front while the rest stays in your backlog.
            </p>
            <p className={styles.subheading2}>
              A calmer way to manage tasks and ideas.
            </p>
            <button className={styles.startBtn} onClick={() => router.push('/signup')}>Get organized</button>
          </section>
          {/* Will add some images here later and possibly change layout */}
        </div>
      </div>
      <div className={styles.features}></div>
      <div className={styles.callToAction}></div>
    </div>
  );
}
