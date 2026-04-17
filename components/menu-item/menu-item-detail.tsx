"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, MessageCircle, ArrowLeft } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { Badge, getTagVariant } from "@/components/ui/badge";
import { urlFor } from "@/sanity/lib/image";
import type { MenuItem } from "@/types/menu-types";

interface MenuItemDetailProps {
  item: MenuItem;
}

export function MenuItemDetail({ item }: MenuItemDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || "";

  const mainImage = item.images?.[selectedImage]
    ? urlFor(item.images[selectedImage]).width(800).height(600).url()
    : "https://placehold.co/800x600/1A1A1A/666?text=No+Image";

  const whatsappMessage = encodeURIComponent(
    `Hi! I'd like to order: ${item.title}${item.sizes?.[0] ? ` (${item.sizes[0].sizeName} - ${item.sizes[0].price})` : ""}`,
  );

  const specs = getItemSpecs(item);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/menu"
        className="inline-flex items-center gap-2 text-sm text-brand-text-secondary hover:text-brand-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Menu
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
            <img
              src={mainImage}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          </div>
          {item.images && item.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {item.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? "border-brand-primary" : "border-white/10 opacity-60 hover:opacity-100"}`}
                >
                  <img
                    src={urlFor(img).width(80).height(80).url()}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant={getTagVariant(tag)}>
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl text-brand-text mb-2">
              {item.title}
            </h1>
            {!item.isAvailable && (
              <Badge variant="unavailable" className="text-sm">
                Currently Unavailable
              </Badge>
            )}
          </div>

          {/* Specs */}
          {specs.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {specs.map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-lg bg-brand-elevated px-3 py-2"
                >
                  <span className="text-xs text-brand-text-muted block">
                    {label}
                  </span>
                  <span className="text-sm font-[family-name:var(--font-accent)] text-brand-text">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Sizes & Prices */}
          {item.sizes && item.sizes.length > 0 && (
            <div>
              <h3 className="font-[family-name:var(--font-accent)] text-sm font-semibold text-brand-text-secondary uppercase tracking-wider mb-3">
                Sizes & Prices
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {item.sizes.map((size, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-brand-elevated p-4 text-center"
                  >
                    <p className="text-sm text-brand-text-secondary">
                      {size.sizeName}
                    </p>
                    <p className="font-[family-name:var(--font-accent)] text-xl font-bold text-brand-yellow mt-1">
                      {size.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="prose prose-invert prose-sm max-w-none text-brand-text-secondary">
            <PortableText value={item.description} />
          </div>

          {/* CTAs */}
          {item.isAvailable && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-[family-name:var(--font-accent)] font-semibold text-white transition-all hover:bg-[#128C7E] hover:shadow-lg"
              >
                <MessageCircle className="h-5 w-5" /> Order on WhatsApp
              </a>
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 font-[family-name:var(--font-accent)] font-semibold text-brand-text transition-all hover:border-brand-primary hover:text-brand-primary"
              >
                <Phone className="h-5 w-5" /> Call to Order
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getItemSpecs(item: MenuItem): { label: string; value: string }[] {
  const specs: { label: string; value: string }[] = [];

  if ("itemType" in item && item.itemType)
    specs.push({ label: "Type", value: item.itemType });
  if ("flavorProfile" in item && item.flavorProfile)
    specs.push({ label: "Flavor", value: item.flavorProfile });
  if ("drinkType" in item && item.drinkType)
    specs.push({ label: "Type", value: item.drinkType });
  if ("fizzType" in item && item.fizzType)
    specs.push({ label: "Fizz Type", value: item.fizzType });
  if ("flavor" in item && item.flavor)
    specs.push({ label: "Flavor", value: item.flavor });
  if ("protein" in item && item.protein)
    specs.push({ label: "Protein", value: item.protein });
  if ("spiceLevel" in item && item.spiceLevel)
    specs.push({ label: "Spice Level", value: item.spiceLevel });
  if ("milkOption" in item && item.milkOption)
    specs.push({ label: "Milk", value: item.milkOption });
  if (item._type === "teaCoffee" && "isHot" in item)
    specs.push({ label: "Served", value: item.isHot ? "Hot" : "Cold" });
  if (item._type === "limca" && "isCarbonated" in item)
    specs.push({
      label: "Carbonated",
      value: item.isCarbonated ? "Yes" : "No",
    });
  if ("isVegan" in item && item.isVegan)
    specs.push({ label: "Diet", value: "Vegan" });
  if (item.calories)
    specs.push({ label: "Calories", value: `~${item.calories} kcal` });
  if ("toppings" in item && item.toppings?.length)
    specs.push({ label: "Toppings", value: item.toppings.join(", ") });

  return specs;
}
