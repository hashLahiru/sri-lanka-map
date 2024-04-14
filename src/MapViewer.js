import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import TileWMS from "ol/source/TileWMS";
import { fromLonLat } from "ol/proj";
import "bootstrap/dist/css/bootstrap.min.css";
import "./WMSMap.css";

function zoomIn(map) {
  const view = map.getView();
  const zoom = view.getZoom();
  view.setZoom(zoom + 1);
}

function zoomOut(map) {
  const view = map.getView();
  const zoom = view.getZoom();
  view.setZoom(zoom - 1);
}

const MapViewer = () => {
  const mapRef = useRef();

  const [activeLayers, setActiveLayers] = useState({
    srilanka_1: true,
    gadm41_LKA_2: false,
    gadm41_LKA_1: false,
  });

  useEffect(() => {
    const mapLayers = [];

    if (activeLayers["srilanka_1"]) {
      mapLayers.push(
        new TileLayer({
          source: new TileWMS({
            url: "http://localhost:8080/geoserver/srilanka/wms",
            params: { LAYERS: "srilanka:srilanka_1", TILED: true },
            serverType: "geoserver",
          }),
        })
      );
    }

    if (activeLayers["gadm41_LKA_2"]) {
      mapLayers.push(
        new TileLayer({
          source: new TileWMS({
            url: "http://localhost:8080/geoserver/srilanka/wms",
            params: { LAYERS: "srilanka:gadm41_LKA_2", TILED: true },
            serverType: "geoserver",
          }),
        })
      );
    }

    if (activeLayers["gadm41_LKA_1"]) {
      mapLayers.push(
        new TileLayer({
          source: new TileWMS({
            url: "http://localhost:8080/geoserver/srilanka/wms",
            params: { LAYERS: "srilanka:gadm41_LKA_1", TILED: true },
            serverType: "geoserver",
          }),
        })
      );
    }

    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        ...mapLayers,
      ],
      controls: [],
      view: new View({
        center: fromLonLat([80.6511, 7.8742]),
        zoom: 7,
      }),
    });

    mapRef.current = map;

    return () => map.setTarget(undefined);
  }, [activeLayers]);

  const handleLayerToggle = (layerName) => {
    setActiveLayers({
      ...activeLayers,
      [layerName]: !activeLayers[layerName],
    });
  };

  return (
    <div className="d-flex justify-content mt-3">
      <div id="map" className="map border"></div>
      <div className="d-flex flex-column ms-3">
        <button
          onClick={() => zoomIn(mapRef.current)}
          className="btn btn-secondary mb-2 "
        >
          Zoom In
        </button>
        <button
          onClick={() => zoomOut(mapRef.current)}
          className="btn btn-secondary mb-2"
        >
          Zoom Out
        </button>
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="srilanka"
            checked={activeLayers["srilanka_1"]}
            onChange={() => handleLayerToggle("srilanka_1")}
          />
          <label className="form-check-label" htmlFor="sriLanka">
            Sri Lanka
          </label>
        </div>
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="states"
            checked={activeLayers["gadm41_LKA_1"]}
            onChange={() => handleLayerToggle("gadm41_LKA_1")}
          />
          <label className="form-check-label" htmlFor="states">
            SL - States
          </label>
        </div>
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="district"
            checked={activeLayers["gadm41_LKA_2"]}
            onChange={() => handleLayerToggle("gadm41_LKA_2")}
          />
          <label className="form-check-label" htmlFor="district">
            SL - Districts
          </label>
        </div>
      </div>
    </div>
  );
};

export default MapViewer;
