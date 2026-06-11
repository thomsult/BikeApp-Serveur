import { useAllBikes } from "@/lib/api/equipments";
import type { ComponentBike, ComponentBikeType } from "@/lib/api/equipments/bike";
import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import LabelBadge from "./label-badge";
import { Check, X } from "lucide-react";
import { Popover, PopoverAnchor, PopoverContent } from "./popover";
import { cn } from "@/lib/utils";
import { ActivityIndicator } from "./activity-indicator";
import { Input } from "./input";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchAccessoriesInputProps {
  onSelect?: (ComponentBike: ComponentBike) => void;
  onReset?: () => void;
  placeholder?: string;
  components?: ComponentBike[];
  // selectChildren?: (
  //   selectedItem: ComponentBike | null,
  //   handleClear: () => void,
  // ) => React.ReactNode;
  global?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const SearchAccessoriesInput = ({
  onSelect,
  onReset,
  placeholder,
  components = [],
}: SearchAccessoriesInputProps) => {
  const { t } = useTranslation();
  const { data: bikes } = useAllBikes();

  const [allComponents, setAllComponents] = useState<ComponentBike[]>([]);
  const [filteredItems, setFilteredItems] = useState<ComponentBike[]>([]);
  const [selectedItem, setSelectedItem] = useState<ComponentBike | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ComponentBikeType["label"] | "all">("all");
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // ─── Load & filter source data ──────────────────────────────────────────────

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    try {
      const results = components
      setAllComponents(results);
      setFilteredItems(results);
    } catch (err) {
      setError(t("components.search_accessory.accessories_error"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [components, t, bikes]);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleSearch = useCallback(
    (text: string) => {
      setSearchText(text);
      setIsOpen(true);

      const base = selectedCategory === "all"
        ? allComponents
        : allComponents.filter((i) => i.type.label === selectedCategory);

      if (text.trim() === "") {
        setFilteredItems(base);
        return;
      }

      const q = text.toLowerCase();
      setFilteredItems(
        base.filter((item) =>
          item.model.toLowerCase().includes(q) ||
          String(item.brand.label).toLowerCase().includes(q) ||
          String(item.type.label).toLowerCase().includes(q),
        ),
      );
    },
    [allComponents, selectedCategory],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value),
    [handleSearch],
  );

  const handleOpenClick = useCallback(() => {
    setIsOpen(true);
    inputRef.current?.focus();
  }, []);

  const handleFocus = useCallback(() => setIsOpen(true), []);

  const handlePreventMouseDown = useCallback((e: React.MouseEvent) => e.preventDefault(), []);

  const handleCategorySelect = useCallback(
    (type: ComponentBikeType["label"] | "all") => {
      setSelectedCategory(type);


      // Re-filter current search text against new category
      const base = type === "all"
        ? allComponents
        : allComponents.filter((i) => i.type.label === type);

      if (searchText.trim() === "") {
        setFilteredItems(base);
        return;
      }

      const q = searchText.toLowerCase();
      setFilteredItems(
        base.filter((item) =>
          item.model.toLowerCase().includes(q) ||
          String(item.brand.label).toLowerCase().includes(q) ||
          String(item.type.label).toLowerCase().includes(q),
        ),
      );
    },
    [allComponents, searchText, onSelect],
  );

  const handleSelectItem = useCallback(
    (item: ComponentBike) => {
      setSelectedItem(item);
      setSearchText(item.model);
      setIsOpen(false);
      onSelect?.(item);
    },
    [onSelect],
  );

  const handleClear = useCallback(() => {
    setSearchText("");
    setSelectedItem(null);
    setFilteredItems(allComponents);
    setSelectedCategory("all");
    setIsOpen(false);
    onReset?.();
  }, [allComponents, onReset]);

  // ─── Derived state ───────────────────────────────────────────────────────────

  const groupedComponents = useMemo(
    () =>
      filteredItems.reduce(
        (groups, item) => {
          const key = item.type?.label ?? "Autres";
          if (!groups[key]) groups[key] = [];
          groups[key].push(item);
          return groups;
        },
        {} as Record<string, ComponentBike[]>,
      ),
    [filteredItems],
  );

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(allComponents.map((i) => i.type.label)))],
    [allComponents],
  );

  const hasAddon = searchText.length > 0 || selectedCategory !== "all";
  const hasResults = filteredItems.length > 0;
  const showEmpty = !isLoading && !error && !hasResults;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverAnchor asChild>
          <div
            className={cn(
              "flex w-full items-center gap-2 rounded-xl border border-border bg-card",
              "h-11 px-3 shadow-sm transition-all duration-150",
              "focus-within:ring-2 focus-within:ring-ring/30 focus-within:border-ring",
              isOpen && "rounded-b-none border-b-transparent ring-2 ring-ring/30",
            )}
          >
            {/* Search icon */}
            <button
              type="button"
              className="flex shrink-0 items-center text-muted-foreground hover:text-foreground transition-colors"
              onClick={handleOpenClick}
              tabIndex={-1}
              aria-label="Ouvrir la recherche"
            >
              <MagnifyingGlassIcon className="size-4" />
            </button>

            {/* Text input */}
            <Input

              ref={inputRef}
              value={searchText}
              onChange={handleInputChange}
              onFocus={handleFocus}
              placeholder={placeholder ?? t("components.search_accessory.placeholder")}
              className="flex-1 dark:bg-card focus-visible:ring-ring/0  bg-card border-none  text-sm outline-none placeholder:text-muted-foreground/60"
              autoComplete="off"
              inputMode="search"
            />

            {/* Right addons */}
            <div className="flex shrink-0 items-center gap-1.5">
              {isLoading && <ActivityIndicator size="sm" />}

              {!isLoading && selectedCategory !== "all" && (
                <LabelBadge size="extraSmall" text={selectedCategory} type="muted" />
              )}

              {hasAddon && (
                <button
                  type="button"
                  onClick={handleClear}
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full",
                    "text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                  )}
                  aria-label={t("components.search_accessory.clear_search")}
                >
                  <X size={13} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        </PopoverAnchor>

        <PopoverContent
          className={cn(
            "w-[var(--radix-popover-trigger-width)]",
            "rounded-t-none rounded-b-xl border-t-0",
            "bg-card shadow-xl shadow-black/8",
            "overflow-hidden",
          )}
          align="start"
          side="bottom"
          avoidCollisions={false}
          sideOffset={0}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* ── Category filter pills ───────────────────────────── */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-1.5 px-3 py-2.5 border-b border-border/60">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onMouseDown={handlePreventMouseDown}
                  onClick={() => handleCategorySelect(cat as ComponentBikeType["id"] | "all")}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-all duration-100",
                    "border",
                    selectedCategory === cat
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/50 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {cat === "all" ? t("common.filters.all") : cat}
                </button>
              ))}
            </div>
          )}

          {/* ── Error ───────────────────────────────────────────── */}
          {error && (
            <p className="px-4 py-3 text-sm text-destructive">{error}</p>
          )}

          {/* ── Results counter ─────────────────────────────────── */}
          {!isLoading && !error && searchText && hasResults && (
            <p className="px-4 py-2 text-xs text-muted-foreground border-b border-border/40">
              {t("components.search_accessory.results_count", {
                count: filteredItems.length,
                search: searchText,
              })}
            </p>
          )}

          {/* ── Loading skeleton ─────────────────────────────────── */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <ActivityIndicator size="sm" />
            </div>
          )}

          {/* ── Grouped results ──────────────────────────────────── */}
          {!isLoading && !error && (
            <div className="max-h-72 overflow-y-auto">
              {Object.entries(groupedComponents).map(([type, items]) => (
                <div key={type}>
                  {/* Group header */}
                  <div className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm px-4 py-1.5 border-b border-border/40">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {type}
                      <span className="ml-1.5 font-normal opacity-60">({items.length})</span>
                    </span>
                  </div>

                  {/* Items */}
                  {items.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseDown={handlePreventMouseDown}
                        onClick={() => handleSelectItem(item)}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                          "hover:bg-muted/60",
                          isSelected && "bg-primary/5",
                        )}
                        aria-pressed={isSelected}
                        aria-label={`${item.model} — ${item.brand.label} · ${item.type.label}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "truncate text-sm font-medium",
                            isSelected ? "text-primary" : "text-foreground",
                          )}>
                            {item.model}
                          </p>
                          <p className="truncate text-xs text-muted-foreground mt-0.5">
                            {item.brand.label} · {item.type.label}
                          </p>
                        </div>

                        {isSelected && (
                          <Check size={14} className="shrink-0 text-primary" strokeWidth={2.5} />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* ── Empty states ─────────────────────────────────────── */}
          {showEmpty && searchText && (
            <p className="px-4 py-5 text-center text-sm text-muted-foreground">
              {t("components.search_accessory.no_accessories_for", { search: searchText })}
            </p>
          )}

          {showEmpty && !searchText && (
            <p className="px-4 py-5 text-center text-sm text-muted-foreground">
              {t("components.search_accessory.no_accessories_found")}
            </p>
          )}

          {/* ── Clear footer ─────────────────────────────────────── */}
          {hasAddon && (
            <div className="border-t border-border/40">
              <button
                type="button"
                onMouseDown={handlePreventMouseDown}
                onClick={handleClear}
                className={cn(
                  "flex w-full items-center justify-center gap-1.5",
                  "px-4 py-2.5 text-xs text-muted-foreground",
                  "hover:bg-muted/60 hover:text-foreground transition-colors",
                )}
              >
                <X size={11} />
                {t("components.search_accessory.clear_search")}
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};