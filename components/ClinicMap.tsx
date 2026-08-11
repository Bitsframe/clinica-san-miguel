"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";
import { Loader2, MapPin } from "lucide-react";

export interface ClinicPin {
  id: number | string;
  name: string;
  address?: string | null;
  lat: number;
  lng: number;
}

interface ClinicMapProps {
  pins: ClinicPin[];
  /** Pixel height used as a min-height; the map fills its parent. */
  height?: number;
  /** Optional click handler (e.g. open the directions modal). */
  onPinClick?: (id: ClinicPin["id"]) => void;
}

const BRAND = "#C1001F";
// Center of Texas — fallback view when there are no pins to fit.
const TEXAS_CENTER: L.LatLngExpression = [31.0, -99.0];
const TEXAS_ZOOM = 5;

function brandPinIcon(): L.DivIcon {
  return L.divIcon({
    className: "clinic-pin",
    html: `<svg width="30" height="40" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 8.5 12 20 12 20s12-11.5 12-20c0-6.627-5.373-12-12-12z" fill="${BRAND}"/>
      <circle cx="12" cy="12" r="4.5" fill="#ffffff"/>
    </svg>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -36],
  });
}

export default function ClinicMap({ pins, height = 580, onPinClick }: ClinicMapProps) {
  const t = useTranslations("contact_page");
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const onPinClickRef = useRef(onPinClick);
  const [ready, setReady] = useState(false);

  onPinClickRef.current = onPinClick;

  // Stable signature so the marker effect only re-runs when the pins truly change.
  const pinsKey = useMemo(
    () => pins.map((p) => `${p.id}:${p.lat},${p.lng}`).join("|"),
    [pins]
  );

  // Initialize the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    }).setView(TEXAS_CENTER, TEXAS_ZOOM);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    setReady(true);

    // The panel may mount before its final size is known (lazy reveal / tab switch).
    const sizeTimer = setTimeout(() => map.invalidateSize(), 60);

    return () => {
      clearTimeout(sizeTimer);
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  // Render markers whenever the pins change.
  useEffect(() => {
    const map = mapRef.current;
    const layer = markerLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    if (pins.length === 0) {
      map.setView(TEXAS_CENTER, TEXAS_ZOOM);
      return;
    }

    const latLngs: L.LatLngExpression[] = [];
    for (const pin of pins) {
      const marker = L.marker([pin.lat, pin.lng], { icon: brandPinIcon() });
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pin.lat},${pin.lng}`;
      marker.bindPopup(
        `<div style="font-family:inherit;min-width:160px">
          <strong style="display:block;color:#19192C;font-size:13px;line-height:1.3">${escapeHtml(pin.name)}</strong>
          ${pin.address ? `<span style="display:block;color:#3D3D3C;font-size:12px;margin-top:2px">${escapeHtml(pin.address)}</span>` : ""}
          <a href="${directionsUrl}" target="_blank" rel="noreferrer" style="display:inline-block;margin-top:6px;color:${BRAND};font-size:12px;font-weight:600">Get Directions →</a>
        </div>`
      );
      if (onPinClickRef.current) {
        marker.on("click", () => onPinClickRef.current?.(pin.id));
      }
      marker.addTo(layer);
      latLngs.push([pin.lat, pin.lng]);
    }

    map.invalidateSize();
    if (latLngs.length === 1) {
      map.setView(latLngs[0], 13);
    } else {
      map.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40], maxZoom: 13 });
    }
  }, [pinsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative h-full w-full" style={{ minHeight: height }}>
      <div ref={containerRef} className="h-full w-full" style={{ minHeight: height }} />

      {!ready && (
        <div
          className="absolute inset-0 z-[500] flex flex-col items-center justify-center gap-2 bg-[#F4F5F6] text-[#6C7582]"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin text-[#C1001F]" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium font-poppins">
            <MapPin className="h-3.5 w-3.5 text-[#C1001F]" />
            <span>{t("loading_map")}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
