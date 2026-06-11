import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMap } from "react-map-gl/mapbox";
import { useDrawingRoute } from "./use-drawing-route";
import { findClosestSegmentIndex, getDistance, MIN_DISTANCE } from "./utils";
import { useTranslation } from "react-i18next";

// ─────────────────────────────────────────────────────────────
// 🔥 Hook ULTRA PERF Mapbox (ligne + points)
// ─────────────────────────────────────────────────────────────

//utiliser Mapbox Type pour la source GeoJSON
type coordinate = {
  coords: {
    longitude: number;
    latitude: number;
  };
  timestamp: number;
};

type mapPoint = {
  x: number;
  y: number;
  index: number;
  [key: string]: any;
} | null;


const useUltraPolyline = (id: string) => {
  const { current: map } = useMap();
  const pendingUpdate = useRef<{ coords: coordinate[], isClosed: boolean, selectedPoints: number[] } | null>(null);
  // const [styleLoaded, setStyleLoaded] = useState(false);
  const mapStyleLoaded = useDrawingRoute((s) => s.mapIsReady);
  const setMapStyleLoaded = useDrawingRoute((s) => s.setIsMapReady);

  const buildLine = (coords: coordinate[] = [], isClosed: boolean = false): GeoJSON.FeatureCollection<GeoJSON.LineString, { isClosingSegment: boolean }> => {
    const segments: GeoJSON.Feature<GeoJSON.LineString, { isClosingSegment: boolean }>[] = [];

    for (let i = 0; i < coords.length - 1; i++) {
      segments.push({
        type: "Feature",
        properties: {
          isClosingSegment: false,
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [coords[i].coords.longitude, coords[i].coords.latitude],
            [coords[i + 1].coords.longitude, coords[i + 1].coords.latitude],
          ],
        },
      });
    }

    // 🔥 segment de fermeture
    if (isClosed && coords.length >= 3) {
      const lastCoord = coords.at(-1);
      if (lastCoord) {
        segments.push({
          type: "Feature",
          properties: {
            isClosingSegment: true,
          },
          geometry: {
            type: "LineString",
            coordinates: [
              [lastCoord.coords.longitude, lastCoord.coords.latitude],
              [coords[0].coords.longitude, coords[0].coords.latitude],
            ],
          },
        });
      }
    }

    return {
      type: "FeatureCollection",
      features: segments,
    };
  };

  const buildPoints = (coords: coordinate[], selectedPoints: number[]): GeoJSON.FeatureCollection<GeoJSON.Point, { index: number; selected: boolean }> => ({
    type: "FeatureCollection",
    features: coords.map((c, i) => ({
      type: "Feature",
      properties: {
        index: i,
        selected: selectedPoints.includes(i), // 🔥 clé
      },
      geometry: {
        type: "Point",
        coordinates: [c.coords.longitude, c.coords.latitude],
      },
    })),
  });


  useEffect(() => {
    if (!map) return;
    const onLoad = () => setMapStyleLoaded(true);

    if (map.isStyleLoaded()) {
      setMapStyleLoaded(true);
    } else {
      map.once("style.load", onLoad);
      return () => {
        map.off("style.load", onLoad);
      };
    }
  }, [map]);


  useEffect(() => {
    if (!map) return;
    const mapInstance = map.getMap();

    // 🔥 référence pour cleanup du listener
    const init = () => {
      if (!map.isStyleLoaded()) return;
      if (mapInstance.getSource(id)) return;
      // line
      mapInstance.addSource(id, {
        type: "geojson",
        data: buildLine([], false) as GeoJSON.FeatureCollection<GeoJSON.Geometry>,
      });

      mapInstance.addLayer({
        id: `${id}-line`,
        type: "line",
        source: id,
        paint: {
          "line-color": [
            "case",
            ["get", "isClosingSegment"],
            "#f59756", // 🔥 segment fermeture
            "#f97316",
          ],
          "line-width": 3,
        },
      });

      mapInstance.addLayer({
        id: `${id}-line-hitbox`,
        type: "line",
        source: id,
        metadata: {
          isHitbox: true,
        },
        paint: {
          "line-color": "transparent",
          "line-width": 20,
        },
      });

      // points
      mapInstance.addSource(`${id}-points`, {
        type: "geojson",
        data: buildPoints([], []) as GeoJSON.FeatureCollection<GeoJSON.Geometry>,
      });

      mapInstance.addLayer({
        id: `${id}-points-layer`,
        type: "circle",
        source: `${id}-points`,
        paint: {
          "circle-radius": [
            "case",
            ["get", "selected"],
            9,  // sélectionné
            6,  // normal
          ],
          "circle-color": [
            "case",
            ["get", "selected"],
            "#f59756", // 🔥 sélection
            "#ff8c00", // normal
          ],
          "circle-stroke-width": [
            "case",
            ["get", "selected"],
            4,
            2,
          ],
          "circle-stroke-color": "#ffffff",
        },
      });
      // preview closing segment
      mapInstance.addSource(`${id}-preview`, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      mapInstance.addLayer({
        id: `${id}-preview-line`,
        type: "line",
        source: `${id}-preview`,
        paint: {
          "line-color": "#f59756",
          "line-width": 2,
          "line-dasharray": [4, 3],
          "line-opacity": 0.7,
        },
      });
      setMapStyleLoaded(true);
    };
    // ✅ si déjà prêt
    // ✅ init direct si déjà prêt
    if (map.isStyleLoaded()) {
      init();
    }

    // 🔥 réinit quand le style est rechargé (setStyle, changement de thème, etc.)
    map.on("style.load", init);

    return () => {
      if (!map) return;
      const mapInstance = map.getMap();
      // 🔥 annule le listener si le style n'avait pas encore chargé
      // if (initListener) {
      //   map.off("style.load", initListener);
      // }
      setMapStyleLoaded(false);
      map.off("style.load", init);
      if (mapInstance.getLayer(`${id}-line`))
        mapInstance.removeLayer(`${id}-line`);
      if (mapInstance.getLayer(`${id}-points-layer`))
        mapInstance.removeLayer(`${id}-points-layer`);
      if (mapInstance.getLayer(`${id}-line-hitbox`))
        mapInstance.removeLayer(`${id}-line-hitbox`);

      if (mapInstance.getSource(id)) mapInstance.removeSource(id);
      if (mapInstance.getSource(`${id}-points`))
        mapInstance.removeSource(`${id}-points`);
      if (mapInstance.getLayer(`${id}-preview-line`))
        mapInstance.removeLayer(`${id}-preview-line`);
      if (mapInstance.getSource(`${id}-preview`))
        mapInstance.removeSource(`${id}-preview`);
    };
  }, [map, id]);

  // update ultra fluide

  const flushPending = useCallback(() => {
    if (!map || !pendingUpdate.current) return;
    const mapInstance = map.getMap();
    const lineSource = mapInstance.getSource(id);
    const pointSource = mapInstance.getSource(`${id}-points`);
    if (!lineSource || !pointSource) return;

    const { coords, isClosed, selectedPoints } = pendingUpdate.current;
    pendingUpdate.current = null;


    if ("setData" in lineSource)
      (lineSource as mapboxgl.GeoJSONSource).setData(buildLine(coords, isClosed));
    if ("setData" in pointSource)
      (pointSource as mapboxgl.GeoJSONSource).setData(buildPoints(coords, selectedPoints));

    setMapStyleLoaded(true);
  }, [map, id]);

  // 🔥 flush dès que le style/sources sont rechargés
  useEffect(() => {
    if (!map) return;
    map.on("style.load", flushPending);
    map.on("sourcedata", flushPending);
    return () => {
      map.off("style.load", flushPending);
      map.off("sourcedata", flushPending);
    };
  }, [map, flushPending]);

  const update = useCallback((coords: coordinate[], isClosed: boolean, selectedPoints: number[]) => {
    pendingUpdate.current = { coords, isClosed, selectedPoints };
    flushPending();
  }, [map, id, flushPending]);


  const updatePreview = useCallback((coords: coordinate[]) => {
    if (!map) return;
    const previewSource = map.getMap().getSource(`${id}-preview`);
    if (!previewSource || !("setData" in previewSource)) return;

    if (coords.length < 2) {
      (previewSource as mapboxgl.GeoJSONSource).setData({
        type: "FeatureCollection", features: [],
      });
      return;
    }

    const first = coords[0];
    const last = coords.at(-1)!;

    (previewSource as mapboxgl.GeoJSONSource).setData({
      type: "FeatureCollection",
      features: [{
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [last.coords.longitude, last.coords.latitude],
            [first.coords.longitude, first.coords.latitude],
          ],
        },
      }],
    });
  }, [map, id]);

  return { update, updatePreview, isInitialized: mapStyleLoaded };
};

// ─────────────────────────────────────────────────────────────
// 🚀 MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export const PolylineDrawer = () => {
  const { current: map } = useMap();


  const [lockedTooltip, setLockedTooltip] = useState<mapPoint>(null);

  const [hoverTooltip, setHoverTooltip] = useState<mapPoint>(null);

  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);

  const {
    routeCoordinates,
    moveCoordinate,
    addCoordinate,
    insertCoordinate,
    removeCoordinate,
    isEditMode,
    // isReadOnly,
    setIsClosed,
    isClosed,
    replaceCoordinates,
  } = useDrawingRoute();

  const { update, updatePreview, isInitialized } = useUltraPolyline("polyline-main");

  // update rendu GPU
  useEffect(() => {
    console.log("update route", routeCoordinates.length, "points");

    update(routeCoordinates, isClosed, selectedPoints);

  }, [routeCoordinates, update, isClosed, selectedPoints]);



  // ─────────────────────────────────────────
  // ⚡ DRAG ULTRA FLUIDE
  // ─────────────────────────────────────────

  const dragFrame = useRef<number | null>(null);

  const handleDrag = useCallback(
    (index: number, lng: number, lat: number) => {
      if (dragFrame.current) return;

      dragFrame.current = requestAnimationFrame(() => {
        moveCoordinate(index, {
          coords: {
            longitude: lng,
            latitude: lat,
          },
          timestamp: Date.now(),
        });
        dragFrame.current = null;
      });
    },
    [moveCoordinate]
  );

  // ─────────────────────────────────────────
  // 🎯 CLICK MAP
  // ─────────────────────────────────────────

  useEffect(() => {
    if (!map) return undefined;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      // if (!isEditMode || isReadOnly) return;
      if (!isEditMode) return;

      const features = map.queryRenderedFeatures(e.point, {
        layers: [
          "polyline-main-points-layer",
          "polyline-main-line-hitbox",
        ]
      });

      const { lng, lat } = e.lngLat;
      const clicked: [number, number] = [lng, lat];

      // ─────────────────────────────
      // 🎯 CLICK SUR POINT
      // ─────────────────────────────
      const pointFeature = features.find(
        (f) => f.layer && f.layer.id === "polyline-main-points-layer"
      );

      if (pointFeature) {
        const index = pointFeature.properties?.index;

        if (index === undefined) return;


        if (selectedPoints.length >= 2) {
          // 🔥 max 2 points sélectionnés
          setSelectedPoints([index]);
          return;
        }
        if (selectedPoints.includes(index)) {

          // 🔥 déjà sélectionné → désélectionne
          setSelectedPoints((prev) => prev.filter((i) => i !== index));
          setLockedTooltip(null);
          return;
        }

        // sélection
        setSelectedPoints((prev) => {
          if (prev.includes(index)) {
            return prev.filter((i) => i !== index);
          }
          return [...prev, index];
        });


        // lock tooltip
        setLockedTooltip({
          x: e.point.x,
          y: e.point.y,
          index,
        });

        return;
      }
      const isTooClose = routeCoordinates.some((c) =>
        getDistance(c.coords, { longitude: lng, latitude: lat }) < MIN_DISTANCE
      );

      // ─────────────────────────────
      // 🔥 CLICK SUR LIGNE → INSERT
      // ─────────────────────────────
      const lineFeature = features.filter(
        (f: any) => f.layer.id === "polyline-main-line-hitbox"
      )[0];

      if (lineFeature && (routeCoordinates.length >= 2)) {
        if (lineFeature.properties && lineFeature.properties.isClosingSegment) {
          // 🔥 click sur segment de fermeture → ajoute avant le premier

          if (isTooClose || lockedTooltip) return;

          insertCoordinate(0, {
            coords: { longitude: lng, latitude: lat },
            timestamp: Date.now(),
          });
          return;
        }
        const index = findClosestSegmentIndex(routeCoordinates, clicked);

        insertCoordinate(index + 1, {
          coords: { longitude: lng, latitude: lat },
          timestamp: Date.now(),
        });

        return;
      }

      // ─────────────────────────────
      // 🟢 CLICK VIDE → AJOUT NORMAL
      // ─────────────────────────────
      setSelectedPoints([]);
      setLockedTooltip(null);

      if (isTooClose || lockedTooltip) return;

      addCoordinate({
        coords: { longitude: lng, latitude: lat },
        timestamp: Date.now(),
      });
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [
    map,
    isEditMode,
    selectedPoints,
    lockedTooltip,
    routeCoordinates,
    addCoordinate,
    insertCoordinate,
  ]);

  // ─────────────────────────────────────────
  // 🎯 DRAG via Mapbox events
  // ─────────────────────────────────────────

  useEffect(() => {
    if (!map) return undefined;

    let draggingIndex: number | null = null;

    const onMouseDown = (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["polyline-main-points-layer"],
      });

      if (!features.length) return;

      const index = features[0].properties?.index;
      if (index === undefined) return;

      draggingIndex = index;

      // 🔥 bloque le déplacement de la map
      map.getMap().dragPan.disable();
      map.getCanvas().style.cursor = "grabbing";
    };

    const onMouseMove = (e: mapboxgl.MapMouseEvent) => {
      if (draggingIndex === null || !isEditMode) return;

      handleDrag(draggingIndex, e.lngLat.lng, e.lngLat.lat);
    };

    const onMouseUp = () => {
      if (draggingIndex !== null || !isEditMode) {
        draggingIndex = null;

        // 🔥 réactive la map
        map.getMap().dragPan.enable();
        map.getCanvas().style.cursor = "";
      }
    };

    map.on("mousedown", onMouseDown);
    map.on("mousemove", onMouseMove);
    map.on("mouseup", onMouseUp);

    return () => {
      map.off("mousedown", onMouseDown);
      map.off("mousemove", onMouseMove);
      map.off("mouseup", onMouseUp);
    };
  }, [map, handleDrag, isEditMode]);

  useEffect(() => {
    if (!map) return undefined;

    const enter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const leave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("mouseenter", "polyline-main-points-layer", enter);
    map.on("mouseleave", "polyline-main-points-layer", leave);
    map.on("mouseenter", "polyline-main-line-hitbox", enter);
    map.on("mouseleave", "polyline-main-line-hitbox", leave);

    return () => {
      map.off("mouseenter", "polyline-main-points-layer", enter);
      map.off("mouseleave", "polyline-main-points-layer", leave);
      map.off("mouseenter", "polyline-main-line-hitbox", enter);
      map.off("mouseleave", "polyline-main-line-hitbox", leave);
    };
  }, [map]);

  // ─────────────────────────────────────────
  // 📏 DISTANCE OPTIMISÉE O(n)
  // ─────────────────────────────────────────

  const distances = useMemo(() => {
    let cumul = 0;
    if (routeCoordinates.length === 0) return [];
    return routeCoordinates?.map((c, i) => {
      if (i === 0) return 0;
      cumul += getDistance(
        routeCoordinates[i - 1].coords,
        c.coords
      );
      return cumul;
    });
  }, [routeCoordinates]);


  // ─────────────────────────────────────────
  // 🎯 TOOLTIP au survol d'une ligne 
  // ─────────────────────────────────────────


  const [hoverLineTooltip, setHoverLineTooltip] = useState<mapPoint>(null);

  useEffect(() => {

    if (!map) return undefined;

    const leave = () => {
      setHoverLineTooltip(null);
    };
    const hover = (e: mapboxgl.MapMouseEvent) => {
      // if (moveFrame.current) return;

      // if (index === undefined) return;
      setHoverLineTooltip({
        x: e.point.x,
        y: e.point.y,
        index: 0, // 🔥 à remplacer par la distance
      });
    };

    map.on('mousemove', "polyline-main-line-hitbox", hover);
    map.on("mouseleave", "polyline-main-line-hitbox", leave);

    return () => {
      map.off('mousemove', "polyline-main-line-hitbox", hover);
      map.off("mouseleave", "polyline-main-line-hitbox", leave);
    };
  }, [map, routeCoordinates, isClosed]);


  // ─────────────────────────────────────────
  // 🎯 TOOLTIP au survol d'un point (index + distance)
  // ─────────────────────────────────────────



  // 🔥 vérifie si les 2 points extrêmes sont sélectionnés
  const selectionInfo = useMemo(() => {
    if (selectedPoints.length !== 2) return null;

    const [a, b] = [...selectedPoints].sort((x, y) => x - y);
    const first = 0;
    const last = routeCoordinates.length - 1;

    const isExtremes = a === first && b === last;
    const areAdjacent = b - a === 1 || isExtremes; // 🔥 extrêmes = aussi adjacents dans un tracé fermé

    return { a, b, isExtremes, areAdjacent };
  }, [selectedPoints, routeCoordinates.length]);

  const moveFrame = useRef<number | null>(null);
  useEffect(() => {
    if (!map) return undefined;

    const enter = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      map.getCanvas().style.cursor = !isEditMode ? "pointer" : "grab";

      const feature = e.features?.[0];
      if (!feature) return;
      const index = feature.properties?.index;
      if (index === undefined) return;

      setHoverTooltip({
        x: e.point.x,
        y: e.point.y,
        index,
      });
    };

    const leave = () => {
      map.getCanvas().style.cursor = "";
      setHoverTooltip(null);
    };

    // 🔥 mise à jour position pendant le déplacement de la souris sur le point
    const move = (e: mapboxgl.MapMouseEvent) => {
      if (moveFrame.current) return;
      moveFrame.current = requestAnimationFrame(() => {
        setHoverTooltip((prev) =>
          prev ? { ...prev, x: e.point.x, y: e.point.y } : null
        );
        setLockedTooltip((prev) =>
          prev ? { ...prev, x: e.point.x, y: e.point.y } : null
        );
        moveFrame.current = null;

      });
    };

    const moveMapStart = () => {
      setLockedTooltip(null);
      setHoverTooltip(null);
    }

    map.on("mouseenter", "polyline-main-points-layer", enter);
    map.on("mouseleave", "polyline-main-points-layer", leave);
    map.on("mousemove", "polyline-main-points-layer", move);
    map.on("movestart", moveMapStart);

    return () => {
      map.off("mouseenter", "polyline-main-points-layer", enter);
      map.off("mouseleave", "polyline-main-points-layer", leave);
      map.off("mousemove", "polyline-main-points-layer", move);
      map.off("movestart", moveMapStart);
    };
  }, [map, isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      setLockedTooltip(null);
      setSelectedPoints([]);
      setHoverTooltip(null);
    }
  }, [isEditMode]);

  useEffect(() => {
    if (!isInitialized) return;
    if (selectionInfo?.isExtremes && !isClosed) {
      updatePreview(routeCoordinates);
    } else {
      updatePreview([]); // 🔥 efface la preview
    }
  }, [selectionInfo, isClosed, routeCoordinates, updatePreview, isInitialized]);


  const { t } = useTranslation();
  const activeTooltip = lockedTooltip ?? hoverTooltip;

  return (
    <>
      {hoverLineTooltip && !activeTooltip && (

        <div
          style={{
            position: "absolute",
            left: hoverLineTooltip.x,
            top: hoverLineTooltip.y,
            transform: "translate(-50%, -120%)",
            zIndex: 1000,
          }}
        >
          <div className="bg-card rounded-xl shadow-md px-3 py-2 text-sm">
            <span>
              Cliquez pour ajouter un nouveau point !
            </span>
          </div>
          <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white mx-auto" />
        </div>

      )}
      {activeTooltip && (
        <div
          style={{
            position: "absolute",
            left: activeTooltip.x,
            top: activeTooltip.y,
            transform: "translate(-50%, -120%)",
            pointerEvents: lockedTooltip ? "auto" : "none",
            zIndex: 1000,
          }}
        >
          <div className="bg-card rounded-xl shadow-md px-3 py-2 text-sm flex items-center gap-2">
            <span className="font-bold">
              {/* {activeTooltip.index + 1} */}
              {activeTooltip.index === 0
                ? t("components.map.waypoints.start")
                : activeTooltip.index === routeCoordinates.length - 1
                  ? t("components.map.waypoints.end")
                  : t("components.map.waypoints.via", { index: `#${activeTooltip.index + 1}` })
              }
            </span>

            <div className="w-px h-4 bg-gray-200" />

            <span>
              {distances[activeTooltip.index] >= 1000
                ? `${(distances[activeTooltip.index] / 1000).toFixed(1)} km`
                : `${Math.round(distances[activeTooltip.index])} m`}
            </span>

            {/* 🔥 bouton delete si lock */}
            {lockedTooltip && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeCoordinate(activeTooltip.index);
                  setLockedTooltip(null);
                  setSelectedPoints((prev) => prev.filter((i) => i !== activeTooltip.index));
                }}
                className="ml-2 text-red-500"
              >
                ✕
              </button>
            )}
          </div>

          <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white mx-auto" />
        </div>
      )}
      {selectionInfo && isEditMode && (
        <div style={{
          position: "absolute", bottom: 20, left: "50%",
          transform: "translateX(-50%)", zIndex: 1000, pointerEvents: "auto",
        }}>
          {/* Extrêmes → fermer/ouvrir */}
          {selectionInfo.isExtremes && (
            <button onClick={() => { setIsClosed(!isClosed); setSelectedPoints([]); }}
              className="bg-card shadow-lg rounded-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              🔗 {isClosed ? t("components.map.waypoints.openWaypoint") : t("components.map.waypoints.closeWaypoint")}
            </button>
          )}

          {/* Adjacents → fusionner les deux points en un seul (point médian) */}
          {selectionInfo.areAdjacent && !selectionInfo.isExtremes && isClosed && (
            <div className="flex gap-2">
              {/* coupe entre a et b → rotation du tableau */}
              <button onClick={() => {
                const { a, b } = selectionInfo;
                // 🔥 repart de b, repasse par 0, se termine en a
                const reordered = [
                  ...routeCoordinates.slice(b),
                  ...routeCoordinates.slice(0, a + 1),
                ];
                replaceCoordinates(reordered);
                setIsClosed(false);
                setSelectedPoints([]);
                setLockedTooltip(null);
              }}
                className="bg-card  shadow-lg rounded-full px-4 py-2 text-sm  hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                ✂️ {t("components.map.waypoints.cutHere")}
              </button>

              {/* fusion point médian — comme avant */}
              <button onClick={() => {
                const { a, b } = selectionInfo;
                const ca = routeCoordinates[a].coords;
                const cb = routeCoordinates[b].coords;
                const mid = {
                  coords: {
                    longitude: (ca.longitude + cb.longitude) / 2,
                    latitude: (ca.latitude + cb.latitude) / 2,
                  },
                  timestamp: Date.now(),
                };
                removeCoordinate(b);
                moveCoordinate(a, mid);
                setSelectedPoints([]);
                setLockedTooltip(null);
              }}
                className="bg-card shadow-lg rounded-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                🔀 {t("components.map.waypoints.mergePoints")}
              </button>
            </div>
          )}

          {/* Non-adjacents → couper le chemin entre eux (garder seulement le segment a→b) */}
          {!selectionInfo.areAdjacent && !selectionInfo.isExtremes && (
            <div className="flex gap-2">
              <button onClick={() => {
                const { a, b } = selectionInfo;
                // 🔥 supprime les points entre a et b (exclus)
                Array.from({ length: b - a - 1 }, (_, i) => a + 1 + i)
                  .sort((x, y) => y - x)
                  .forEach((i) => removeCoordinate(i));
                setSelectedPoints([]);
                setLockedTooltip(null);
              }}
                className="bg-card shadow-lg rounded-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                🗜️ {t("components.map.waypoints.flattenSegment")}
              </button>
            </div>
          )}
        </div>
      )}
      {isEditMode && routeCoordinates.length > 0 && !selectionInfo && (<div style={{
        position: "absolute", bottom: 20, left: "50%",
        transform: "translateX(-50%)", zIndex: 1000, pointerEvents: "auto",
      }}>
        <div className="flex gap-2">
          <button onClick={() => {
            // 🔥 supprime Tous
            replaceCoordinates([]);
            setSelectedPoints([]);
            setLockedTooltip(null);

          }}
            className="bg-card shadow-lg rounded-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {t("components.map.waypoints.clearAll")}
          </button>
        </div>
      </div>)}

    </>
  );
};