import type { ReactNode } from 'react';

export default function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <div className="title">{title}</div>
      <div className="body">{children}</div>
    </>
  );
}
