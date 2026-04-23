// Wraps every page in a centered mobile-width container

interface MobileShellProps {
  children: React.ReactNode;
}

export default function MobileShell({ children }: MobileShellProps) {
  return (
    <div id="mobile-shell">
      <div id="page-content">{children}</div>
    </div>
  );
}
