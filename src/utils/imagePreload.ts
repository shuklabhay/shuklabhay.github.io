import type { PostMeta } from "./types";

const AVIF_PROBE =
  "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAAD5bWV0YQAAAAAAAAAvaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAFBpY3R1cmVIYW5kbGVyAAAAAA5waXRtAAAAAAABAAAAHmlsb2MAAAAARAAAAQABAAAAAQAAASEAAAAWAAAAKGlpbmYAAAAAAAEAAAAaaW5mZQIAAAAAAQAAYXYwMUNvbG9yAAAAAGppcHJwAAAAS2lwY28AAAAUaXNwZQAAAAAAAAACAAAAAgAAABBwaXhpAAAAAAMICAgAAAAMYXYxQ4EADAAAAAATY29scm5jbHgAAgACAAIAAAAAF2lwbWEAAAAAAAAAAQABBAECgwQAAAAebWRhdAoFGAA2wCAyDRgAAABQAAAAALATSyg=";

export type ImagePreloadStatus = "loading" | "loaded" | "error";

const statusBySrc = new Map<string, ImagePreloadStatus>();
const promiseBySrc = new Map<string, Promise<ImagePreloadStatus>>();

export function getImagePreloadStatus(src: string) {
  return statusBySrc.get(src);
}

export function preloadImage(src: string): Promise<ImagePreloadStatus> {
  if (!src) return Promise.resolve("error");

  const existingStatus = statusBySrc.get(src);
  if (existingStatus === "loaded" || existingStatus === "error") {
    return Promise.resolve(existingStatus);
  }

  const inFlight = promiseBySrc.get(src);
  if (inFlight) return inFlight;

  statusBySrc.set(src, "loading");

  const task = new Promise<ImagePreloadStatus>((resolve) => {
    const image = new Image();
    let settled = false;

    const finish = (status: ImagePreloadStatus) => {
      if (settled) return;
      settled = true;
      statusBySrc.set(src, status);
      promiseBySrc.delete(src);
      image.onload = null;
      image.onerror = null;
      resolve(status);
    };

    image.onload = () => {
      if (typeof image.decode === "function") {
        image.decode().catch(() => undefined);
      }
      finish("loaded");
    };
    image.onerror = () => finish("error");
    image.src = src;

    if (image.complete) {
      if (image.naturalWidth > 0) {
        if (typeof image.decode === "function") {
          image.decode().catch(() => undefined);
        }
        finish("loaded");
      } else {
        finish("error");
      }
    }
  });

  promiseBySrc.set(src, task);
  return task;
}

let avifSupport: Promise<boolean> | null = null;

export function supportsAvif(): Promise<boolean> {
  avifSupport ??= new Promise<boolean>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image.width > 0);
    image.onerror = () => resolve(false);
    image.src = AVIF_PROBE;
  });
  return avifSupport;
}

export function preloadPostCover(
  post: Pick<PostMeta, "cover" | "coverAvif">,
): Promise<ImagePreloadStatus | undefined> {
  const { cover, coverAvif } = post;
  if (!cover) return Promise.resolve(undefined);
  if (!coverAvif) return preloadImage(cover);
  return supportsAvif().then((supported) =>
    preloadImage(supported ? coverAvif : cover),
  );
}
