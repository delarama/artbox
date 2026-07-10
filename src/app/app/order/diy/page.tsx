"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressHeader, StickyFooter } from "@/components/layout/StickyFooter";
import { MobileFrame } from "@/components/layout/MobileFrame";
import { Button } from "@/components/ui/Button";
import { PhotoThumb } from "@/components/ui/PhotoThumb";
import { useOrder } from "@/lib/order-context";

export default function DiyGalleryPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { state, setRoute, addPhotos, removePhoto } = useOrder();
  const noPhotos = state.photos.length === 0;

  useEffect(() => {
    setRoute("diy");
  }, [setRoute]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    addPhotos(e.dataTransfer.files);
  };

  return (
    <MobileFrame>
      <div className="flex min-h-screen flex-col">
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addPhotos(e.target.files);
            e.target.value = "";
          }}
        />
        <ProgressHeader
          accent="purple"
          backHref="/app/choose"
          step1={{ label: "Photos", done: false }}
          step2={{ label: "Book & checkout", active: false }}
        />

        <div className="flex-1 px-4 py-6 sm:px-5">
          <div className="mb-1.5 flex items-baseline gap-2.5">
            <h1 className="m-0 text-2xl font-bold tracking-tight">Your gallery</h1>
            <span className="text-sm font-medium text-muted">
              {state.photos.length === 1 ? "1 image" : `${state.photos.length} images`}
            </span>
          </div>
          <p className="mb-[22px] text-sm leading-relaxed text-[#615f5b]">
            Upload photos of your child&apos;s artwork. We optimize them as WebP for fast loading — JPG or PNG in.
          </p>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            onDrop={onDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            className="flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-[34px_20px] text-center transition-colors"
            style={{
              borderColor: dragActive ? "#7F77DD" : "#D9D2EC",
              background: dragActive ? "#EFEEFB" : "#FaF9Fc",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7F77DD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-3" aria-hidden>
              <path d="M12 15V3" />
              <path d="M8 11l4 4 4-4" />
              <path d="M4 15v4a2 2 0 002 2h12a2 2 0 002-2v-4" />
            </svg>
            <div className="mb-1.5 text-base font-bold">Drag &amp; drop your photos here</div>
            <div className="mb-4 text-[13px] text-muted">Accepted file types: JPG or PNG</div>
            <span className="inline-flex items-center justify-center rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-white">
              Browse files
            </span>
          </button>

          {state.photos.length > 0 ? (
            <div className="mt-[22px] grid grid-cols-3 gap-2.5">
              {state.photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square overflow-hidden rounded-xl bg-[#F3EEF0] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <PhotoThumb src={photo.url} alt={photo.name} />
                  <button
                    type="button"
                    title="Remove"
                    onClick={() => removePhoto(photo.id)}
                    className="absolute right-0.5 top-0.5 ab-icon-tap rounded-full border-0 bg-transparent p-0"
                    aria-label="Remove photo"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(44,44,42,0.72)] text-sm leading-none text-white">
                      ×
                    </span>
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <StickyFooter className="flex items-center gap-3.5">
          <div className="shrink-0">
            <div className="text-[11px] font-medium text-muted">Uploaded</div>
            <div className="text-lg font-bold">{state.photos.length}</div>
          </div>
          <Button
            fullWidth
            className="flex-1"
            variant="purple"
            disabled={noPhotos}
            onClick={() => !noPhotos && router.push("/app/checkout")}
            style={{ background: noPhotos ? "#D7CFE9" : undefined, cursor: noPhotos ? "not-allowed" : "pointer" }}
          >
            Create book <span className="text-[17px]">→</span>
          </Button>
        </StickyFooter>
      </div>
    </MobileFrame>
  );
}
