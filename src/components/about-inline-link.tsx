import type { ReactNode } from "react";

const LINK_CLASS =
  "text-primary underline-offset-2 hover:underline dark:text-sky-400 dark:hover:text-sky-300";

export const AboutInlineLink = ({
  href,
  title,
  children,
}: {
  href: string;
  title?: string;
  children: ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={LINK_CLASS}
    title={title}
  >
    {children}
  </a>
);

export const renderLinkedCopy = (
  text: string,
  href?: string,
  linkLabel?: string,
  linkTitle?: string,
): ReactNode => {
  if (!href || !linkLabel) return text;
  const parts = text.split(linkLabel);
  if (parts.length < 2) return text;
  return (
    <>
      {parts[0]}
      <AboutInlineLink href={href} title={linkTitle ?? linkLabel}>
        {linkLabel}
      </AboutInlineLink>
      {parts.slice(1).join(linkLabel)}
    </>
  );
};
