import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const isStagedDomain = (domain?: string | null): boolean => {
  const stagedRegex = /.*staged.*/gim;

  return domain ? stagedRegex.test(domain) : false;
};

export const isStagedUrlRequest = (request: NextRequest) =>
  isStagedDomain(
    request?.headers.get("host") || request?.headers.get(":authority")
  );

export function middleware(request: NextRequest) {
  const staged = isStagedUrlRequest(request);

  if (request.nextUrl.pathname.includes("rewrite")) {
    return NextResponse.rewrite(
      new URL(
        `/abgroup-${staged ? "/staged" : ""}${request.nextUrl.pathname}`,
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|favicon.ico|fonts|images|icons/favicon|static/css).*)",
    "/",
  ],
};
