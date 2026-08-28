'use client';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useLoading } from '@/hooks/use-loading';
import { useEffect } from 'react';
import { Frown, NotebookPen, SmilePlus, AppWindow, Repeat } from 'lucide-react';
import Foretab from '@/components/home/foretab';

export default function Home() {
  const router = useRouter();
  const currentUser = useAuth();
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    startLoading();

    const loadingTimer = setTimeout(() => {
      stopLoading();
    }, 800);

    return () => clearTimeout(loadingTimer);
  }, []);

  return (
    <div>
      {currentUser === null ? (
        <div className={styles.container}>
          <div className={styles.hero}>
            <div className={styles.content}>
              <section className={styles.headings}>
                <h1>For brains with too many tabs open.</h1>
                <p className={styles.subheading1}>
                  Keep every task and idea in one place and focus on one tab at
                  a time.
                </p>
                <p className={styles.subheading2}>
                  No more rigid planning. No more overwhelming to-do lists.
                </p>
                <button
                  className={styles.startBtn}
                  onClick={() => router.push('/signup')}
                >
                  Get started
                </button>
              </section>
              {/* Will add some images here later and possibly change layout */}
            </div>
          </div>
          <div className={styles.problemSolution}>
            <div className={styles.content}>
              <h1>Task systems tend to lean toward one of two extremes:</h1>
              <div className={styles.problemsContainer}>
                <div className={`${styles.problemCard} ${styles.lightBlueBackground}`}>
                  <h2>Too much structure</h2>
                  <ul>
                    <li>
                      <Frown className={styles.problemIcon} />
                      <span>Everything needs to be put on a schedule.</span>
                    </li>
                    <li>
                      <Frown className={styles.problemIcon} />
                      When life happens, tasks get skipped.
                    </li>
                    <li>
                      <Frown className={styles.problemIcon} />
                      Staying organized becomes a lot of work.
                    </li>
                  </ul>
                </div>
                <div className={`${styles.problemCard} ${styles.lightGreenBackground}`}>
                  <h2>Too little structure</h2>
                  <ul>
                    <li>
                      <Frown className={styles.problemIcon} />
                      Everything sits in one overwhelming list.
                    </li>
                    <li>
                      <Frown className={styles.problemIcon} />
                      Nothing tells you what to look at right now.
                    </li>
                    <li>
                      <Frown className={styles.problemIcon} />
                      Too many choices can make it hard to start anything.
                    </li>
                  </ul>
                </div>
              </div>
              <div className={styles.headings}>
                <p className={styles.subheading1}>
                  For many people, neither approach fits well. Foretab sits in
                  the middle.
                </p>
                <p className={styles.subheading2}>
                  Enough structure to stay focused. Enough freedom to not feel
                  pressured.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.features}>
            <div className={styles.content}>
              <h1>Your mind is already chaotic. You don't need features that cause more chaos.</h1>
            </div>
          </div>
          <div className={styles.howItWorks}>
            <div className={styles.content}>
              <div className={styles.howItWorksContainer}>
                <div className={styles.howItWorksCard}>
                  <div className={styles.stepRow}>
                    <div className={styles.numberedStep}>01</div>
                    <NotebookPen className={styles.icon} />
                  </div>
                  <h2>Get it out of your head</h2>
                  <p className={styles.subheading2}>
                    Dump tasks and ideas from your mental backlog into one
                    place.
                  </p>
                </div>
                <div className={styles.howItWorksCard}>
                  <div className={styles.stepRow}>
                    <div className={styles.numberedStep}>02</div>
                    <SmilePlus className={styles.icon} />
                  </div>
                  <h2>Add things to your current tab</h2>
                  <p className={styles.subheading2}>
                    Bring in what you want to work on over the next few weeks.
                  </p>
                </div>
                <div className={styles.howItWorksCard}>
                  <div className={styles.stepRow}>
                    <div className={styles.numberedStep}>03</div>
                    <AppWindow className={styles.icon} />
                  </div>
                  <h2>Complete tasks from your tab at your own pace</h2>
                  <p className={styles.subheading2}>
                    Everything else stays in your backlog while you focus.
                  </p>
                </div>
                <div className={styles.howItWorksCard}>
                  <div className={styles.stepRow}>
                    <div className={styles.numberedStep}>04</div>
                    <Repeat className={styles.icon} />
                  </div>
                  <h2>Repeat the cycle</h2>
                  <p className={styles.subheading2}>
                    Anything unfinished moves into your next tab automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className={styles.callToAction}>
          <div className={styles.content}>
            <div>
              <h2>You don't have to feel overwhelmed.</h2>
              <p>Work through things one tab at a time</p>
            </div>
          </div>
        </div> */}
        </div>
      ) : (
        <div><Foretab /></div>
      )}
    </div>
  );
}
