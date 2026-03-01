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
      if (typeof image.decode !== "function") {
        finish("loaded");
        return;
      }
      image.decode().then(
        () => finish("loaded"),
        () => finish("loaded"),
      );
    };
    image.onerror = () => finish("error");
    image.src = src;

    if (image.complete) {
      if (image.naturalWidth > 0) {
        if (typeof image.decode !== "function") {
          finish("loaded");
        } else {
          image.decode().then(
            () => finish("loaded"),
            () => finish("loaded"),
          );
        }
      } else {
        finish("error");
      }
    }
  });

  promiseBySrc.set(src, task);
  return task;
}
