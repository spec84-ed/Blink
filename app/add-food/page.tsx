"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Apple, Beef, Camera, ChefHat, Clock3, Copy, Egg, PackagePlus, Search, ScanLine, X, Wheat } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { FoodSearchCard } from "@/components/food-search-card";
import { PageHeader } from "@/components/page-header";
import { mealTypes, type Food, type MealType, useNutrivueStore } from "@/lib/app-store";

type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => {
  detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
};

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
}

const quickActions = [
  { label: "Barcode", detail: "Open Food Facts first", icon: ScanLine },
  { label: "Custom food", detail: "Create nutrition facts", icon: PackagePlus },
  { label: "Saved meal", detail: "Log a full recipe", icon: ChefHat },
  { label: "Copy day", detail: "Reuse yesterday", icon: Copy }
];

export default function AddFoodPage() {
  const { state, addEntry, addFoodAndEntry } = useNutrivueStore();
  const [selectedMeal, setSelectedMeal] = useState<MealType>("Breakfast");
  const [query, setQuery] = useState("");
  const [barcode, setBarcode] = useState("");
  const [barcodeStatus, setBarcodeStatus] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerStatus, setScannerStatus] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [customFood, setCustomFood] = useState({
    name: "",
    brand: "",
    servingSize: "1",
    servingUnit: "serving",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    sodium: ""
  });

  useEffect(() => {
    const meal = new URLSearchParams(window.location.search).get("meal");
    if (mealTypes.includes(meal as MealType)) {
      setSelectedMeal(meal as MealType);
    }
  }, []);

  useEffect(() => {
    if (!scannerOpen) {
      return;
    }

    let active = true;
    let detector: InstanceType<BarcodeDetectorConstructor> | null = null;

    async function openScanner() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setScannerStatus("Camera is not available on this device. Use manual barcode entry.");
        return;
      }

      if (!window.BarcodeDetector) {
        setScannerStatus("Live barcode detection is not supported here. Use manual barcode entry for now.");
        return;
      }

      try {
        detector = new window.BarcodeDetector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"] });
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setScannerStatus("Point the camera at the barcode.");
        scanLoop();
      } catch {
        setScannerStatus("Camera permission was blocked or unavailable.");
      }
    }

    async function scanLoop() {
      if (!active || !detector || !videoRef.current) {
        return;
      }

      try {
        const barcodes = await detector.detect(videoRef.current);
        const value = barcodes[0]?.rawValue;
        if (value) {
          active = false;
          setBarcode(value);
          closeScanner();
          void lookupBarcode(value);
          return;
        }
      } catch {
        setScannerStatus("Could not read barcode yet. Try better light or enter it manually.");
      }

      window.setTimeout(scanLoop, 350);
    }

    openScanner();

    return () => {
      active = false;
      stopCamera();
    };
  }, [scannerOpen]);

  const foods = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const sorted = [...state.foods].sort((a, b) => (b.lastUsedAt ?? "").localeCompare(a.lastUsedAt ?? ""));
    if (!normalized) {
      return sorted.slice(0, 8);
    }

    return sorted.filter((food) => `${food.name} ${food.brand ?? ""}`.toLowerCase().includes(normalized)).slice(0, 12);
  }, [query, state.foods]);

  function iconForFood(food: Food) {
    const name = food.name.toLowerCase();
    if (name.includes("egg")) return Egg;
    if (name.includes("banana") || name.includes("apple")) return Apple;
    if (name.includes("rice") || name.includes("oat") || name.includes("cereal")) return Wheat;
    return Beef;
  }

  function saveCustomFood() {
    if (!customFood.name.trim() || !customFood.calories) {
      return;
    }

    addFoodAndEntry(
      {
        name: customFood.name.trim(),
        brand: customFood.brand.trim() || undefined,
        source: "Custom",
        servingSize: Number(customFood.servingSize) || 1,
        servingUnit: customFood.servingUnit || "serving",
        calories: Number(customFood.calories) || 0,
        protein: Number(customFood.protein) || 0,
        carbs: Number(customFood.carbs) || 0,
        fat: Number(customFood.fat) || 0,
        sodium: Number(customFood.sodium) || 0
      },
      selectedMeal
    );

    setCustomFood({ name: "", brand: "", servingSize: "1", servingUnit: "serving", calories: "", protein: "", carbs: "", fat: "", sodium: "" });
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function closeScanner() {
    stopCamera();
    setScannerOpen(false);
  }

  async function startNativeScanner() {
    setScannerStatus("Opening scanner...");
    try {
      const importer = new Function("specifier", "return import(specifier)") as (specifier: string) => Promise<{
        BarcodeScanner: {
          checkPermissions: () => Promise<{ camera: string }>;
          requestPermissions: () => Promise<{ camera: string }>;
          scan: (options?: unknown) => Promise<{ barcodes?: Array<{ rawValue?: string; displayValue?: string }> }>;
        };
      }>;
      const { BarcodeScanner } = await importer("@capacitor-mlkit/barcode-scanning");
      const permission = await BarcodeScanner.checkPermissions();
      const finalPermission = permission.camera === "granted" ? permission : await BarcodeScanner.requestPermissions();

      if (finalPermission.camera !== "granted") {
        setScannerStatus("Camera permission is required to scan barcodes.");
        return;
      }

      const result = await BarcodeScanner.scan();
      const value = result.barcodes?.[0]?.rawValue ?? result.barcodes?.[0]?.displayValue;
      if (value) {
        setBarcode(value);
        await lookupBarcode(value);
        return;
      }

      setScannerStatus("No barcode found. Try again or enter it manually.");
    } catch {
      setScannerOpen(true);
    }
  }

  async function lookupBarcode(value = barcode) {
    if (!value.trim()) {
      return;
    }

    setBarcodeStatus("Searching barcode...");
    try {
      const response = await fetch(`/api/barcode/${encodeURIComponent(value.trim())}`);
      const data = await response.json();
      if (!response.ok || !data.food) {
        setBarcodeStatus("No complete product found. Create it as a custom food below.");
        return;
      }

      addFoodAndEntry(
        {
          name: data.food.name,
          brand: data.food.brand,
          source: data.food.source === "open_food_facts" ? "Open Food Facts" : "USDA",
          servingSize: data.food.servingSize || 1,
          servingUnit: data.food.servingUnit || "serving",
          calories: data.food.calories || 0,
          protein: data.food.proteinG || 0,
          carbs: data.food.carbsG || 0,
          fat: data.food.fatG || 0,
          fiber: data.food.fiberG,
          sugar: data.food.sugarG,
          sodium: data.food.sodiumMg,
          barcode: value.trim()
        },
        selectedMeal
      );
      setBarcodeStatus(`Added ${data.food.name} to ${selectedMeal}.`);
      setBarcode("");
    } catch {
      setBarcodeStatus("Barcode lookup failed. Check connection and try again.");
    }
  }

  return (
    <AppShell>
      <PageHeader eyebrow="Fast log" title="Add food" />
      <section className="rounded-[2rem] bg-ink p-5 text-white shadow-soft">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-ink">
          <Search className="h-5 w-5 text-ink/45" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent font-bold outline-none" placeholder="Search chicken breast, Big Mac, cereal..." />
        </div>
        <div className="mt-4 flex rounded-2xl bg-white/10 p-1">
          {mealTypes.map((mealType) => (
            <button
              key={mealType}
              onClick={() => setSelectedMeal(mealType)}
              className={`flex-1 rounded-xl px-2 py-2 text-xs font-black sm:text-sm ${selectedMeal === mealType ? "bg-lime text-ink" : "text-white/70"}`}
            >
              {mealType}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <button key={action.label} onClick={() => action.label === "Barcode" && void startNativeScanner()} className="rounded-[1.5rem] bg-white/10 p-4 text-left transition hover:bg-white/15">
              <action.icon className="h-6 w-6 text-lime" />
              <p className="mt-4 font-black">{action.label}</p>
              <p className="mt-1 text-sm font-semibold text-white/55">{action.detail}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-ink/10 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-ink">Barcode scanner</h2>
                <p className="text-sm font-semibold text-ink/45">Camera integration placeholder</p>
              </div>
              <Camera className="h-6 w-6 text-moss" />
            </div>
            <div className="mt-5 grid aspect-[4/3] place-items-center rounded-[1.5rem] border border-dashed border-ink/20 bg-field">
              <div className="text-center">
                <ScanLine className="mx-auto h-10 w-10 text-ink/35" />
                <p className="mt-3 text-sm font-black text-ink">Scan or enter barcode</p>
                <button onClick={startNativeScanner} className="mx-auto mt-3 rounded-2xl bg-lime px-4 py-3 text-sm font-black text-ink">
                  Open camera
                </button>
                <div className="mx-auto mt-3 flex max-w-sm gap-2 px-4">
                  <input value={barcode} onChange={(event) => setBarcode(event.target.value)} inputMode="numeric" className="min-w-0 flex-1 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold outline-none" placeholder="0123456789012" />
                  <button onClick={() => void lookupBarcode()} className="rounded-2xl bg-ink px-4 py-3 text-sm font-black text-white">Find</button>
                </div>
                <p className="mt-2 text-xs font-semibold text-ink/45">{barcodeStatus || "Camera scanner SDK comes next."}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-ink/10 bg-white p-5 shadow-card">
            <h2 className="text-xl font-black text-ink">Custom food</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input value={customFood.name} onChange={(event) => setCustomFood((current) => ({ ...current, name: event.target.value }))} className="rounded-2xl border border-ink/10 bg-field px-4 py-3 text-sm font-bold outline-none focus:border-moss" placeholder="Food name" />
              <input value={customFood.brand} onChange={(event) => setCustomFood((current) => ({ ...current, brand: event.target.value }))} className="rounded-2xl border border-ink/10 bg-field px-4 py-3 text-sm font-bold outline-none focus:border-moss" placeholder="Brand" />
              <input value={customFood.servingSize} onChange={(event) => setCustomFood((current) => ({ ...current, servingSize: event.target.value }))} inputMode="decimal" className="rounded-2xl border border-ink/10 bg-field px-4 py-3 text-sm font-bold outline-none focus:border-moss" placeholder="Serving size" />
              <input value={customFood.servingUnit} onChange={(event) => setCustomFood((current) => ({ ...current, servingUnit: event.target.value }))} className="rounded-2xl border border-ink/10 bg-field px-4 py-3 text-sm font-bold outline-none focus:border-moss" placeholder="Serving unit" />
              {(["calories", "protein", "carbs", "fat", "sodium"] as const).map((field) => (
                <input key={field} value={customFood[field]} onChange={(event) => setCustomFood((current) => ({ ...current, [field]: event.target.value }))} inputMode="decimal" className="rounded-2xl border border-ink/10 bg-field px-4 py-3 text-sm font-bold outline-none focus:border-moss" placeholder={field[0].toUpperCase() + field.slice(1)} />
              ))}
            </div>
            <button onClick={saveCustomFood} className="mt-4 w-full rounded-2xl bg-ink px-4 py-3 text-sm font-black text-white">Save and log to {selectedMeal}</button>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-moss" />
            <h2 className="text-xl font-black text-ink">Recent foods</h2>
          </div>
          <div className="space-y-3">
            {foods.map((food) => (
              <FoodSearchCard
                key={food.id}
                name={food.name}
                source={food.source}
                calories={food.calories}
                protein={food.protein}
                icon={iconForFood(food)}
                onAdd={() => addEntry(food.id, selectedMeal)}
              />
            ))}
          </div>
        </div>
      </section>

      {scannerOpen && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ink/90 p-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-ink">Scan barcode</h2>
                <p className="text-sm font-semibold text-ink/45">{scannerStatus}</p>
              </div>
              <button onClick={closeScanner} className="grid h-10 w-10 place-items-center rounded-2xl bg-field text-ink" aria-label="Close scanner">
                <X className="h-5 w-5" />
              </button>
            </div>
            <video ref={videoRef} className="aspect-[3/4] w-full rounded-[1.5rem] bg-ink object-cover" playsInline muted />
            <p className="mt-3 text-center text-xs font-semibold text-ink/45">If scanning does not start, enter the barcode manually.</p>
          </div>
        </div>
      )}
    </AppShell>
  );
}
