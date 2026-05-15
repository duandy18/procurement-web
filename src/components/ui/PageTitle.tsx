import type { ReactNode } from "react";

export interface PageTitleProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}

export default function PageTitle({
  title,
  description,
  actions,
  children,
}: PageTitleProps) {
  return (
    <div className="page-title">
      <div className="page-title-main">
        <div>
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
        {actions ? <div className="page-title-actions">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}
