'use client'
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.content}>
          <section className={styles.headings}>
            <h1>For brains with too many tabs open.</h1>
            <p className={styles.subheading1}>
              Keep every task and idea in one place and focus on one tab at a time.
            </p>
            <p className={styles.subheading2}>
              No more rigid planning. No more overwhelming to-do lists.
            </p>
            <button className={styles.startBtn} onClick={() => router.push('/signup')}>Get started</button>
          </section>
          {/* Will add some images here later and possibly change layout */}
        </div>
      </div>
      <div className={styles.problemSolution}>
        <div className={styles.content}>
          <h1>Task systems tend to lean toward one of two extremes</h1>
          <div className={styles.problemSolutionsContainer}>
            <div className={styles.problemSolutionCard}>
              <h2>Too much structure</h2>
              <ul>
                <li>Everything needs to be put on a schedule</li>
                <li>When life happens, tasks get skipped</li>
                <li>Staying organized is just another task to complete</li>
              </ul>
            </div>
            <div className={styles.problemSolutionCard}>
              <h2>Too little structure</h2>
              <ul>
                <li>Everything sits in one overwhelming list</li>
                <li>Nothing tells you what to look at right now</li>
                <li>Too many choices can make it hard to start anything</li>
              </ul>
            </div>
          </div>
          <p>For many people, neither approach fits well. Foretab sits in the middle.</p>
          <p>Enough structure to stay focused. Enough freedom to not feel pressured.</p>
        </div>
      </div>
      <div>
        <div className={styles.content}>
          <h1>How it works</h1>
          <div>
            <div>
              <h2>Get it out of your head</h2>
              <p>Dump tasks and ideas into one place so you don't have to hold them mentally</p>
            </div>
            <div>
              <h2>Move things into your current tab</h2>
              <p>Bring in what you want to work on over the next few weeks. This is just a way to guide your focus, not a deadline.</p>
            </div>
            <div>
              <h2>Work from your current tab</h2>
              <p>Everything else stays in your backlog while you focus</p>
            </div>
            <div>
              <h2>Nothing gets lost</h2>
              <p>Anything unfinished moves into your next tab automatically.</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.callToAction}>
        <div className={styles.content}>
          <div>
            <h2>You don't have to feel overwhelmed.</h2>
            <p>Work through things one tab at a time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
