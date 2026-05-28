import { gallery } from "@/data/gallery";
import { cn } from "@/lib/utils";

import { PlaceholderImage } from "./PlaceholderImage";
import { SectionHead } from "./SectionHead";

const mobileSpanClass: Record<3 | 6, string> = {
  3: "col-span-3",
  6: "col-span-6",
};

const desktopSpanClass: Record<2 | 3 | 4, string> = {
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
};

export function GallerySection() {
  return (
    <section
      id="galeri"
      className="relative scroll-mt-24 overflow-hidden bg-surface-muted py-16 lg:py-26"
    >
      <div className="relative mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-16">
        <SectionHead
          accent="sun"
          eyebrow="Galeri"
          title="Suasana kelas kami sehari-hari."
          sub="Semua foto diambil di kolam sendiri — bukan stok. Kalau anak kamu ada di sini, hubungi kami untuk minta foto resmi."
        />

        <ul className="grid grid-cols-6 gap-3 md:gap-4">
          {gallery.map((item, idx) => {
            const span = item.span ?? { mobile: 3, desktop: 2 };
            return (
              <li
                key={item.id}
                className={cn(
                  mobileSpanClass[span.mobile],
                  desktopSpanClass[span.desktop],
                )}
              >
                <PlaceholderImage
                  caption={item.caption}
                  alt={item.alt}
                  tone={item.tone === "sky" ? "sky" : item.tone}
                  blob={item.blob}
                  ratio={item.ratio}
                  rotateDeg={idx % 2 === 0 ? -0.8 : 0.8}
                  className="transition-[transform,box-shadow] duration-200 hover:!rotate-0 hover:scale-[1.02] hover:shadow-md"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
