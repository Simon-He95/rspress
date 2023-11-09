import React from 'react';
import {
  matchRoutes,
  useLocation,
  useNavigate,
  normalizeHrefInRuntime as normalizeHref,
  normalizeRoutePath,
  withBase,
  isEqualPath,
} from '@rspress/runtime';
import nprogress from 'nprogress';
import { routes } from 'virtual-routes';
import styles from './index.module.scss';
import { scrollToTarget } from '@/logic';

export interface LinkProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
}

nprogress.configure({ showSpinner: false });

const EXTERNAL_URL_RE = /^(https?:)?\/\//;

export function Link(props: LinkProps) {
  const { href = '/', children, className = '', onNavigate } = props;
  const isExternal = EXTERNAL_URL_RE.test(href);
  const target = isExternal ? '_blank' : '';
  const rel = isExternal ? 'noopener noreferrer' : undefined;
  const withBaseUrl = isExternal ? href : withBase(normalizeHref(href));
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const inCurrentPage = isEqualPath(pathname, withBaseUrl);
  const handleNavigate = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault();
    // handle hash link in current page
    const hash = withBaseUrl.split('#')[1];
    if (!isExternal && inCurrentPage && hash) {
      const el = document.getElementById(hash);
      if (el) {
        scrollToTarget(el, true);
      }
      return;
    }

    // handle normal link
    if (!process.env.__SSR__) {
      const matchedRoutes = matchRoutes(
        routes,
        normalizeRoutePath(withBaseUrl),
      );
      if (matchedRoutes?.length) {
        const timer = setTimeout(() => {
          nprogress.start();
        }, 200);
        await matchedRoutes[0].route.preload();
        clearTimeout(timer);
        nprogress.done();
      }
      onNavigate?.();
      navigate(withBaseUrl, { replace: false });
    }
  };

  if (!isExternal) {
    return (
      <a
        className={`${styles.link} ${className} cursor-pointer`}
        rel={rel}
        target={target}
        onClick={handleNavigate}
        href={withBaseUrl}
      >
        {children}
      </a>
    );
  } else {
    return (
      <a
        href={withBaseUrl}
        target={target}
        rel={rel}
        className={`${styles.link} ${className}`}
      >
        {children}
      </a>
    );
  }
}
