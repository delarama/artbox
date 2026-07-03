"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import {
  adminAdvanceOrder,
  createNewOrder,
  deleteOrderPhotoApi,
  fetchCurrentOrder,
  fetchMe,
  patchOrder,
  uploadOrderPhoto,
} from "./api-client";
import { STORAGE_KEY } from "./constants";
import { defaultOrderState } from "./defaults";
import { fileToWebpDataUrl } from "./image-client";
import { clientStateToOrderPatch } from "./order-serialization";
import type { AuthMode, DiyFormat, OrderState, Photo, Route, Speed, Upgrades } from "./types";

type PersistedState = Omit<OrderState, "photos">;

type OrderContextValue = {
  state: OrderState;
  productionMode: boolean;
  isAdmin: boolean;
  setAuthMode: (mode: AuthMode) => void;
  setAuth: (auth: Partial<OrderState["auth"]>) => void;
  setRoute: (route: Route) => void;
  setQty: (qty: number) => void;
  toggleReturnArt: () => void;
  toggleUpgrade: (key: keyof Upgrades) => void;
  setSpeed: (speed: Speed) => void;
  setDiyFormat: (format: DiyFormat) => void;
  setPromoCode: (code: string) => void;
  applyPromo: () => void;
  setShip: (ship: Partial<OrderState["ship"]>) => void;
  setCard: (card: Partial<OrderState["card"]>) => void;
  addPhotos: (files: FileList | File[]) => void;
  removePhoto: (id: string) => void;
  completeAuth: () => void;
  placeOrder: () => Promise<void>;
  approveProof: () => void;
  advanceStage: () => Promise<void>;
  payInvoice: () => void;
  resetOrder: () => Promise<void>;
  signOut: () => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);

function loadPersistedState(): PersistedState {
  if (typeof window === "undefined") return defaultOrderState;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as PersistedState | null;
    if (saved && saved.up && "route" in saved) {
      return { ...defaultOrderState, ...saved };
    }
  } catch {
    // ignore invalid storage
  }
  return defaultOrderState;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [state, setState] = useState<OrderState>(defaultOrderState);
  const [productionMode, setProductionMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    setState((prev) => ({ ...loadPersistedState(), photos: prev.photos }));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || status !== "authenticated") return;
    Promise.all([fetchCurrentOrder(), fetchMe()])
      .then(([orderData, me]) => {
        setIsAdmin(me.isAdmin);
        if (orderData.mode === "production" && orderData.order) {
          setProductionMode(true);
          const order = orderData.order;
          setState((prev) => ({
            ...prev,
            orderId: order.orderId,
            orderNo: order.orderNo ?? prev.orderNo,
            route: prev.route ?? order.route ?? null,
            qty: prev.qty !== defaultOrderState.qty ? prev.qty : (order.qty ?? prev.qty),
            returnArt: order.returnArt ?? prev.returnArt,
            up: { ...defaultOrderState.up, ...(order.up ?? {}) },
            speed: order.speed ?? prev.speed,
            diyFormat: order.diyFormat ?? prev.diyFormat,
            promoCode: order.promoCode ?? prev.promoCode,
            promoApplied: order.promoApplied ?? prev.promoApplied,
            ship: { ...defaultOrderState.ship, ...(order.ship ?? {}) },
            approved: order.approved ?? prev.approved,
            stageIndex: order.stageIndex ?? prev.stageIndex,
            photos: order.photos ?? prev.photos,
          }));
        }
      })
      .catch(() => {
        // stay in demo mode if API unavailable
      });
  }, [hydrated, status]);

  const syncOrder = useCallback(async (next: OrderState) => {
    if (!productionMode || !next.orderId) return;
    try {
      await patchOrder(next.orderId, clientStateToOrderPatch(next));
    } catch {
      // keep optimistic UI; retry on next change
    }
  }, [productionMode]);

  const applyAndSync = useCallback(
    (updater: (state: OrderState) => OrderState) => {
      setState((current) => {
        const next = updater(current);
        void syncOrder(next);
        return next;
      });
    },
    [syncOrder],
  );

  useEffect(() => {
    if (!hydrated || productionMode) return;
    const { photos, ...persisted } = state;
    void photos;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  }, [state, hydrated, productionMode]);

  useEffect(() => {
    if (!hydrated || !productionMode) return;
    const timer = window.setTimeout(() => {
      void syncOrder(stateRef.current);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [state, hydrated, productionMode, syncOrder]);

  const setAuthMode = useCallback((authMode: AuthMode) => {
    setState((s) => ({ ...s, authMode }));
  }, []);

  const setAuth = useCallback((auth: Partial<OrderState["auth"]>) => {
    setState((s) => ({ ...s, auth: { ...s.auth, ...auth } }));
  }, []);

  const setRoute = useCallback((route: Route) => {
    applyAndSync((s) => ({ ...s, route }));
  }, [applyAndSync]);

  const setQty = useCallback((qty: number) => {
    applyAndSync((s) => ({ ...s, qty: Math.min(9, Math.max(1, qty)) }));
  }, [applyAndSync]);

  const toggleReturnArt = useCallback(() => {
    applyAndSync((s) => ({ ...s, returnArt: !s.returnArt }));
  }, [applyAndSync]);

  const toggleUpgrade = useCallback((key: keyof Upgrades) => {
    applyAndSync((s) => ({ ...s, up: { ...s.up, [key]: !s.up[key] } }));
  }, [applyAndSync]);

  const setSpeed = useCallback((speed: Speed) => {
    applyAndSync((s) => ({ ...s, speed }));
  }, [applyAndSync]);

  const setDiyFormat = useCallback((diyFormat: DiyFormat) => {
    setState((s) => ({ ...s, diyFormat }));
  }, []);

  const setPromoCode = useCallback((promoCode: string) => {
    setState((s) => ({ ...s, promoCode }));
  }, []);

  const applyPromo = useCallback(() => {
    setState((s) => ({
      ...s,
      promoApplied: s.promoCode.trim().toUpperCase() === "ARTKIVE",
    }));
  }, []);

  const setShip = useCallback((ship: Partial<OrderState["ship"]>) => {
    setState((s) => ({ ...s, ship: { ...s.ship, ...ship } }));
  }, []);

  const setCard = useCallback((card: Partial<OrderState["card"]>) => {
    setState((s) => ({ ...s, card: { ...s.card, ...card } }));
  }, []);

  const addPhotos = useCallback((fileList: FileList | File[]) => {
    const files = Array.from(fileList)
      .filter((f) => /image\/(png|jpe?g)/i.test(f.type))
      .slice(0, 30);

    files.forEach((file) => {
      const orderId = stateRef.current.orderId;
      if (productionMode && orderId) {
        void uploadOrderPhoto(orderId, file).then(({ photo }) => {
          setState((s) => ({
            ...s,
            photos: [...s.photos, { id: photo.id, url: photo.url, name: photo.name }],
          }));
        });
        return;
      }

      void fileToWebpDataUrl(file)
        .then((url) => {
          const photo: Photo = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            url,
            name: file.name.replace(/\.[^.]+$/, ".webp"),
          };
          setState((s) => ({ ...s, photos: [...s.photos, photo] }));
        })
        .catch(() => {
          // skip unreadable files
        });
    });
  }, [productionMode]);

  const removePhoto = useCallback((id: string) => {
    const orderId = stateRef.current.orderId;
    if (productionMode && orderId) {
      void deleteOrderPhotoApi(orderId, id);
    }
    setState((s) => ({ ...s, photos: s.photos.filter((p) => p.id !== id) }));
  }, [productionMode]);

  const completeAuth = useCallback(() => {
    setState((s) => ({
      ...s,
      ship: {
        ...s.ship,
        first: s.auth.name || s.ship.first,
        email: s.auth.email || s.ship.email,
      },
    }));
  }, []);

  const placeOrder = useCallback(async () => {
    setState((s) => ({ ...s, stageIndex: 1, approved: false }));
    await syncOrder({ ...stateRef.current, stageIndex: 1, approved: false });
  }, [syncOrder]);

  const approveProof = useCallback(() => {
    applyAndSync((s) => {
      const maxStage = s.route === "diy" ? 3 : 6;
      return { ...s, approved: true, stageIndex: maxStage };
    });
  }, [applyAndSync]);

  const advanceStage = useCallback(async () => {
    const current = stateRef.current;
    if (productionMode && current.orderId && isAdmin) {
      const { order } = await adminAdvanceOrder(current.orderId);
      setState((s) => ({ ...s, stageIndex: order.stageIndex }));
      return;
    }
    applyAndSync((s) => {
      const maxStage = s.route === "diy" ? 3 : 6;
      return { ...s, stageIndex: Math.min(maxStage, s.stageIndex + 1) };
    });
  }, [applyAndSync, productionMode, isAdmin]);

  const payInvoice = useCallback(() => {
    applyAndSync((s) => ({
      ...s,
      stageIndex: Math.max(s.stageIndex, s.route === "diy" ? 2 : 5),
    }));
  }, [applyAndSync]);

  const resetOrder = useCallback(async () => {
    if (productionMode) {
      try {
        const created = await createNewOrder();
        setState({ ...defaultOrderState, orderId: created.orderId, orderNo: created.orderNo, photos: [] });
        return;
      } catch {
        // fall through to local reset
      }
    }
    localStorage.removeItem(STORAGE_KEY);
    setState({ ...defaultOrderState, photos: [] });
  }, [productionMode]);

  const signOut = useCallback(() => {
    setState((s) => ({
      ...defaultOrderState,
      photos: [],
      ship: s.ship,
    }));
    setProductionMode(false);
  }, []);

  const value = useMemo(
    () => ({
      state,
      productionMode,
      isAdmin,
      setAuthMode,
      setAuth,
      setRoute,
      setQty,
      toggleReturnArt,
      toggleUpgrade,
      setSpeed,
      setDiyFormat,
      setPromoCode,
      applyPromo,
      setShip,
      setCard,
      addPhotos,
      removePhoto,
      completeAuth,
      placeOrder,
      approveProof,
      advanceStage,
      payInvoice,
      resetOrder,
      signOut,
    }),
    [
      state,
      productionMode,
      isAdmin,
      setAuthMode,
      setAuth,
      setRoute,
      setQty,
      toggleReturnArt,
      toggleUpgrade,
      setSpeed,
      setDiyFormat,
      setPromoCode,
      applyPromo,
      setShip,
      setCard,
      addPhotos,
      removePhoto,
      completeAuth,
      placeOrder,
      approveProof,
      advanceStage,
      payInvoice,
      resetOrder,
      signOut,
    ],
  );

  if (!hydrated) {
    return <div className="min-h-screen bg-canvas" />;
  }

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
}

export { defaultOrderState } from "./defaults";
