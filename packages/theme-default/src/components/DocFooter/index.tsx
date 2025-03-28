import {
  normalizeHrefInRuntime as normalizeHref,
  usePageData,
} from '@rspress/runtime';
import { EditLink, LastUpdated, PrevNextPage } from '@theme';
import { useLocaleSiteData } from '../../logic/useLocaleSiteData';
import { usePrevNextPage } from '../../logic/usePrevNextPage';
import * as styles from './index.module.scss';

export function DocFooter() {
  const { prevPage, nextPage } = usePrevNextPage();
  const { lastUpdated: localesLastUpdated = false } = useLocaleSiteData();
  const { siteData } = usePageData();
  const { themeConfig } = siteData;
  const showLastUpdated = themeConfig.lastUpdated || localesLastUpdated;

  return (
    <footer className="mt-8">
      <div className="xs:flex pb-5 px-2 justify-end items-center">
        {showLastUpdated && <LastUpdated />}
      </div>
      <div className="flex flex-col">
        <EditLink />
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-around gap-4 pt-6">
        <div className={`${styles.prev} flex flex-col`}>
          {prevPage && Boolean(prevPage.text) ? (
            <PrevNextPage
              type="prev"
              text={prevPage.text}
              href={normalizeHref(prevPage.link)}
            />
          ) : null}
        </div>
        <div className={`${styles.next} flex flex-col`}>
          {nextPage && Boolean(nextPage.text) ? (
            <PrevNextPage
              type="next"
              text={nextPage.text}
              href={normalizeHref(nextPage.link)}
            />
          ) : null}
        </div>
      </div>
    </footer>
  );
}
