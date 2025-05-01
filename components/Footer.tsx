import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t px-4">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-10 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link
            href="/privacy-policy"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-use"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Terms of Use
          </Link>
        </div>
        <Link
          target="_blank"
          href={"https://www.intplus.co/"}
          className="flex items-center gap-1 text-xs text-muted-foreground"
        >
          <span>Powered By</span>
          <p className="text-primary/50">int+</p>
        </Link>
      </div>
    </footer>
  );
}
