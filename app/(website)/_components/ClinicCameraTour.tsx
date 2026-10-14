"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { sizedImage } from "@/lib/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/website/common/Section";
import useScrollProgress from "@/components/website/common/useScrollProgress";
import { easeInOut, pad } from "../_lib/clinic-tour";
import type { ClinicPhoto } from "@/domain/clinic-photo/clinic-photo.types";

/*
 * "Camera across a contact sheet" (desktop). All photos lie on one loose,
 * non-overlapping sheet. The stage pins below the navbar and scrolling moves
 * a camera over the sheet: it flies into photo 01 until it fills the screen,
 * pulls back and glides to 02, and so on, then zooms out to the whole sheet.
 * Only the sheet's transform changes per frame; the room's name and
 * description rise in (CSS transitions) while the camera rests on it.
 *
 * Clicking a photo on the sheet flies straight to that one photo (not through
 * the ones before it). Scrolling, Esc, clicking again or the close button
 * flies back to wherever the scroll tour is.
 */

// Scroll timeline, in units of UNIT_VH of scrolling
const START_HOLD = 0.35; // whole sheet before the first move
const PHOTO_HOLD = 0.9; // camera rests on a photo
const END_HOLD = 0.6; // whole sheet again at the end
const TRAVEL = 1; // one camera move
const UNIT_VH = 60;

// Clicked photo
const FOCUS_MS = 1100; // flight to / from it
const LEAVE_SCROLL = 80; // px of scrolling that closes it

// Loose-layout pattern, repeated: photo size within its cell and where it sits (0 = start, 1 = end)
const SIZES = [0.94, 0.7, 0.84, 0.76, 0.9, 0.66, 0.8, 0.72];
const ALIGN_X = [0.1, 0.9, 0.45, 0.05, 0.75, 0.35, 1, 0.55];
const ALIGN_Y = [0.85, 0.1, 0.6, 0.3, 0.95, 0.2, 0.7, 0.45];
const CAPTION = "2rem"; // space under each photo for its small label

const STAGE_HEIGHT = "(100svh - 5rem)"; // below the h-20 navbar

/** Camera view: centre point on the sheet + how much of the sheet's width is visible */
type View = { x: number; y: number; w: number };

/** A clicked photo: where the flight started, and whether it's flying back out */
type Focus = { index: number; from: View; startedAt: number; leaving: boolean; scrollY: number };

const timeline = (count: number) => {
  const holds = [START_HOLD, ...Array(count).fill(PHOTO_HOLD), END_HOLD];
  const total = holds.reduce((sum, hold) => sum + hold, 0) + (holds.length - 1) * TRAVEL;
  return { holds, total };
};

/** Positions on the sheet: a grid of cells (last row centred), each photo loose inside its cell */
const sheetLayout = (count: number): CSSProperties[] => {
  const cols = Math.max(1, Math.round(Math.sqrt(count * 1.6)));
  const rows = Math.ceil(count / cols);
  const cw = 100 / cols;
  const ch = 100 / rows;

  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / cols);
    const inRow = row === rows - 1 ? count - row * cols : cols;
    const x = ((i % cols) + (cols - inRow) / 2) * cw;
    const y = row * ch;
    const size = SIZES[i % SIZES.length];
    return {
      "--w": `min(${cw * size}cqw, (${ch * size}cqh - ${CAPTION}) * 1.5)`,
      width: "var(--w)",
      left: `calc(${x}cqw + (${cw}cqw - var(--w)) * ${ALIGN_X[i % ALIGN_X.length]})`,
      top: `calc(${y}cqh + (${ch}cqh - var(--w) / 1.5 - ${CAPTION}) * ${ALIGN_Y[i % ALIGN_Y.length]})`,
    } as CSSProperties;
  });
};

/**
 * Smooth zoom + pan between two views: pulls back while travelling, like a
 * camera operator would (van Wijk & Nuij; the same maths as d3.interpolateZoom).
 */
const zoomPath = (a: View, b: View) => {
  const RHO = Math.SQRT2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d2 = dx * dx + dy * dy;

  if (d2 < 1e-6) {
    const S = Math.log(b.w / a.w) / RHO;
    return (t: number): View => ({ x: a.x + t * dx, y: a.y + t * dy, w: a.w * Math.exp(RHO * t * S) });
  }

  const d1 = Math.sqrt(d2);
  const b0 = (b.w * b.w - a.w * a.w + 4 * d2) / (2 * a.w * 2 * d1);
  const b1 = (b.w * b.w - a.w * a.w - 4 * d2) / (2 * b.w * 2 * d1);
  const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
  const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
  const S = (r1 - r0) / RHO;
  const coshR0 = Math.cosh(r0);

  return (t: number): View => {
    const s = t * S;
    const u = (a.w / (2 * d1)) * (coshR0 * Math.tanh(RHO * s + r0) - Math.sinh(r0));
    return { x: a.x + u * dx, y: a.y + u * dy, w: (a.w * coshR0) / Math.cosh(RHO * s + r0) };
  };
};

export default function ClinicCameraTour({ photos, className }: { photos: ClinicPhoto[]; className?: string }) {
  const count = photos.length;
  const { holds, total } = useMemo(() => timeline(count), [count]);
  const layout = useMemo(() => sheetLayout(count), [count]);

  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const photoRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Measured on resize: stage size, one view per stop, one path per move.
  // Stops are [sheet, photo 0, …, photo n-1, sheet].
  const scene = useRef<{ width: number; height: number; stops: View[]; paths: ((t: number) => View)[] } | null>(null);
  const progress = useRef(0);
  const lastView = useRef<View | null>(null);
  const focus = useRef<Focus | null>(null);
  const frame = useRef(0);

  const [active, setActive] = useState(-1); // photo whose text shows, -1 = none
  const [zoomed, setZoomed] = useState(false);
  const [focused, setFocused] = useState(-1); // clicked photo, -1 = none

  /** Where the scroll tour puts the camera right now, and which photo it rests on */
  const scrollView = useCallback(() => {
    const s = scene.current!;
    let u = progress.current * total;
    for (let i = 0; i < s.stops.length; i++) {
      if (u <= holds[i] || i === s.stops.length - 1) return { view: s.stops[i], resting: i - 1 };
      u -= holds[i];
      if (u <= TRAVEL) {
        const t = u / TRAVEL;
        // Text shows a touch before arriving and stays a touch after leaving
        return { view: s.paths[i](easeInOut(t)), resting: t < 0.12 ? i - 1 : t > 0.88 ? i : -1 };
      }
      u -= TRAVEL;
    }
    return { view: s.stops[s.stops.length - 1], resting: -1 };
  }, [holds, total]);

  const draw = useCallback((view: View) => {
    const s = scene.current;
    const sheet = sheetRef.current;
    if (!s || !sheet) return;
    const scale = s.width / view.w;
    const x = s.width / 2 - view.x * scale;
    const y = s.height / 2 - view.y * scale;
    sheet.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress.current})`;
    lastView.current = view;
    setZoomed(scale > 1.2);
  }, []);

  const renderScroll = useCallback(() => {
    if (!scene.current || focus.current) return;
    const { view, resting } = scrollView();
    draw(view);
    setActive(resting >= 0 && resting < count ? resting : -1);
  }, [count, draw, scrollView]);

  /** Runs the flight to (or back from) the clicked photo */
  const fly = useCallback(() => {
    cancelAnimationFrame(frame.current);
    const step = (now: number) => {
      const f = focus.current;
      const s = scene.current;
      if (!f || !s) return;

      const t = Math.min(1, (now - f.startedAt) / FOCUS_MS);
      // Flying back aims at the live scroll position, so scrolling mid-flight stays smooth
      const target = f.leaving ? scrollView().view : s.stops[f.index + 1];
      draw(zoomPath(f.from, target)(easeInOut(t)));
      setActive(!f.leaving && t > 0.75 ? f.index : -1);

      if (t < 1) {
        frame.current = requestAnimationFrame(step);
      } else if (f.leaving) {
        focus.current = null;
        setFocused(-1);
        renderScroll();
      }
    };
    frame.current = requestAnimationFrame(step);
  }, [draw, renderScroll, scrollView]);

  const open = (index: number) => {
    if (focus.current || !lastView.current) return;
    focus.current = { index, from: lastView.current, startedAt: performance.now(), leaving: false, scrollY: window.scrollY };
    setFocused(index);
    fly();
  };

  const close = useCallback(() => {
    const f = focus.current;
    if (!f || f.leaving || !lastView.current) return;
    focus.current = { ...f, from: lastView.current, startedAt: performance.now(), leaving: true };
    fly();
    photoRefs.current[f.index]?.focus({ preventScroll: true });
  }, [fly]);

  // Measure photo positions (layout, not transformed) and build the camera path
  useEffect(() => {
    const stage = stageRef.current;
    const area = areaRef.current;
    if (!stage || !area) return;

    const measure = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (!width || !height) return;

      const sheetView: View = { x: width / 2, y: height / 2, w: width };
      const photoViews = photoRefs.current.slice(0, count).map((photo, i): View => {
        const frame = frameRefs.current[i];
        const x = area.offsetLeft + (photo?.offsetLeft ?? 0);
        const y = area.offsetTop + (photo?.offsetTop ?? 0);
        const w = frame?.offsetWidth || 1;
        const h = frame?.offsetHeight || 1;
        // Fill the stage (cover), centred on the photo
        const scale = Math.max(width / w, height / h);
        return { x: x + w / 2, y: y + h / 2, w: width / scale };
      });

      const stops = [sheetView, ...photoViews, sheetView];
      const paths = stops.slice(0, -1).map((view, i) => zoomPath(view, stops[i + 1]));
      scene.current = { width, height, stops, paths };

      const f = focus.current;
      if (f && !f.leaving) draw(stops[f.index + 1]);
      else renderScroll();
    };

    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [count, draw, renderScroll]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  useScrollProgress(trackRef, stageRef, (p) => {
    progress.current = p;
    const f = focus.current;
    if (!f) return renderScroll();
    if (!f.leaving && Math.abs(window.scrollY - f.scrollY) > LEAVE_SCROLL) close();
  });

  // While a clicked photo is open: Esc closes it, and keyboard focus moves to the close button
  useEffect(() => {
    if (focused < 0) return;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused, close]);

  return (
    <div
      ref={trackRef}
      className={cn("relative", className)}
      style={{ height: `calc(${STAGE_HEIGHT} + ${total * UNIT_VH}vh)` }}
    >
      <div
        ref={stageRef}
        onClick={close}
        className={cn(
          "sticky top-20 h-[calc(100svh-5rem)] overflow-hidden bg-white",
          focused >= 0 && "cursor-zoom-out"
        )}
      >
        {/* The sheet — the only thing the camera moves */}
        <div ref={sheetRef} className="absolute inset-0 origin-top-left">
          <div
            ref={areaRef}
            className="absolute top-6 bottom-12 inset-x-[max(2rem,calc((100%-76rem)/2))] [container-type:size]"
          >
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                ref={(el) => {
                  photoRefs.current[i] = el;
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  open(i);
                }}
                aria-label={`View ${photo.heading}`}
                className={cn(
                  "group absolute block cursor-zoom-in text-left",
                  (zoomed || focused >= 0) && "pointer-events-none"
                )}
                style={layout[i]}
              >
                <div
                  ref={(el) => {
                    frameRefs.current[i] = el;
                  }}
                  className="relative aspect-3/2 w-full overflow-hidden rounded-md bg-zinc-100"
                >
                  <Image
                    src={sizedImage(photo.image, 1920)}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    sizes="100vw"
                  />
                </div>
                <span aria-hidden="true" className="mt-2 flex items-baseline gap-2 font-heading text-xs tracking-tight">
                  <span className="text-brand tabular-nums">{pad(i + 1)}</span>
                  <span className="truncate text-zinc-900">{photo.heading}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Shade so the room's text reads over the photo */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-black/0 transition-opacity duration-700",
            active >= 0 ? "opacity-100" : "opacity-0"
          )}
        />

        {/* The room the camera rests on */}
        <Container className="pointer-events-none absolute inset-x-0 bottom-0 pb-14">
          <div className="grid">
            {photos.map((photo, i) => (
              <div key={photo.id} data-active={active === i} className="tour-text [grid-area:1/1] self-end">
                <p className="tour-fade font-heading text-sm tabular-nums text-white/70">
                  <span className="text-white">{pad(i + 1)}</span> / {pad(count)}
                </p>
                <h3 className="tour-line mt-3 font-heading text-6xl font-medium leading-none tracking-tight text-white xl:text-8xl">
                  <span>{photo.heading}</span>
                </h3>
                {photo.description && (
                  <p className="tour-fade mt-5 max-w-lg text-lg leading-normal text-white/85">{photo.description}</p>
                )}
              </div>
            ))}
          </div>
        </Container>

        {/* Close a clicked photo */}
        <button
          ref={closeRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
          aria-label="Close photo"
          tabIndex={focused >= 0 ? 0 : -1}
          className={cn(
            "absolute top-6 right-[max(2rem,calc((100%-76rem)/2))] flex size-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-[opacity,transform,background-color] duration-500 hover:bg-black/60",
            focused >= 0 && active === focused ? "opacity-100" : "pointer-events-none scale-75 opacity-0"
          )}
        >
          <X className="size-5" />
        </button>

        {/* Tour progress, blended so it reads on the white sheet and on photos */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[max(2rem,calc((100%-76rem)/2))] bottom-6 h-px w-40 bg-white/30 mix-blend-difference"
        >
          <span ref={barRef} className="absolute inset-0 origin-left bg-white" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}
