declare module "react-dom/server.browser" {
  import type { ReactNode } from "react";

  export function renderToReadableStream(children: ReactNode): Promise<
    ReadableStream<Uint8Array> & {
      allReady: Promise<void>;
    }
  >;
}
