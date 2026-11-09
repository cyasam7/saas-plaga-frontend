import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import clsx from 'clsx';

type PageLayoutProps = {
  header?: ReactNode;
  content: ReactNode;
  /**
   * `page` (default): the whole page grows and the window scrolls.
   * `content`: the page fills the viewport, the header stays fixed and only the content scrolls.
   */
  scroll?: 'page' | 'content';
  className?: string;
};

/**
 * Standard page frame for feature screens: a header bar (paper background + divider) above the content.
 */
function PageLayout(props: PageLayoutProps) {
  const { header, content, scroll = 'page', className } = props;
  const isContentScroll = scroll === 'content';

  return (
    <Box
      className={clsx(
        'relative flex w-full min-w-0 flex-auto flex-col',
        isContentScroll ? 'h-full' : 'min-h-full',
        className
      )}
      sx={{ backgroundColor: 'background.default' }}
    >
      <div
        className={clsx('z-10 flex min-w-0 flex-auto flex-col', isContentScroll && 'absolute inset-0 overflow-hidden')}
      >
        {header && (
          <Box
            className="flex flex-none"
            sx={{
              backgroundColor: 'background.paper',
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <div className="container">{header}</div>
          </Box>
        )}

        <div className="container flex min-h-0 flex-auto items-start overflow-y-auto">{content}</div>
      </div>
    </Box>
  );
}

export default PageLayout;
