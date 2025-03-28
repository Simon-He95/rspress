import { Link } from '@theme';
import { useLocaleSiteData } from '../../logic/useLocaleSiteData';
import * as styles from './index.module.scss';

interface PrevNextPageProps {
  type: 'prev' | 'next';
  text: string;
  href: string;
}

export function PrevNextPage(props: PrevNextPageProps) {
  const { type, text, href } = props;
  const { prevPageText = 'Previous Page', nextPageText = 'Next Page' } =
    useLocaleSiteData();
  const pageText = type === 'prev' ? prevPageText : nextPageText;
  const linkClassName =
    type === 'prev' ? styles.pagerLink : `${styles.pagerLink} ${styles.next}`;

  return (
    <Link href={href} className={linkClassName}>
      <span className={styles.desc}>{pageText}</span>
      <span className={styles.title}>{text}</span>
    </Link>
  );
}
