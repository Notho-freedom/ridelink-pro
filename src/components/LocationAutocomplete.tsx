import React, { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface LocationResult {
  city: string;
  address: string;
  lat: number;
  lng: number;
}

interface Props {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (result: LocationResult) => void;
  country?: string;
  className?: string;
  iconColor?: string;
}

const LocationAutocomplete = ({
  placeholder = "Rechercher un lieu...",
  value: externalValue,
  onChange,
  onSelect,
  country,
  className,
  iconColor = "text-primary",
}: Props) => {
  const [query, setQuery] = useState(externalValue || "");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (externalValue !== undefined) setQuery(externalValue);
  }, [externalValue]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("geocode-autocomplete", {
        body: { query: q, country: country || undefined },
      });
      if (!error && data?.features) {
        const mapped: LocationResult[] = data.features.map((f: any) => ({
          city: f.text || f.place_name?.split(",")[0] || "",
          address: f.place_name || "",
          lat: f.center?.[1] || 0,
          lng: f.center?.[0] || 0,
        }));
        setResults(mapped);
        setOpen(mapped.length > 0);
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  }, [country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange?.(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const handleSelect = (r: LocationResult) => {
    setQuery(r.address);
    onChange?.(r.address);
    onSelect?.(r);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <MapPin className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10", iconColor)} />
      <Input
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onFocus={() => results.length > 0 && setOpen(true)}
        className={cn("pl-10", className)}
      />
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading && (
            <div className="p-3 text-sm text-muted-foreground text-center">Recherche...</div>
          )}
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(r)}
              className="w-full text-left px-3 py-2.5 text-sm hover:bg-muted transition-colors flex items-center gap-2 min-h-[44px]"
            >
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{r.address}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
