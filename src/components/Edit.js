import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFirestore } from '../hooks/useFirestore';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

export const EditForm = ({ currentData, currentLocation, onSubmit }) => {
  const [newData, setNewData] = useState(currentData);
  const [newLocation, setNewLocation] = useState(currentLocation);
  const [mapCenter, setMapCenter] = useState({ lat: -33.01536390718795, lng: -71.55007224355586 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  const handleLocationChange = (location) => {
    setNewLocation(location);
  };

  const handleMapClick = (e) => {
    const location = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMapCenter(location);
    setNewLocation(location);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Editar Trabajo</h1>
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(newData, newLocation); }}>
            <div className="mb-3">
              <label className="form-label" htmlFor="Empresa">Empresa</label>
              <input
                id="Empresa"
                name="Empresa"
                value={newData.Empresa}
                onChange={handleChange}
                type="text"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="Puesto">Puesto</label>
              <input
                id="Puesto"
                name="Puesto"
                value={newData.Puesto}
                onChange={handleChange}
                type="text"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="Paga">Paga</label>
              <input
                id="Paga"
                name="Paga"
                value={newData.Paga}
                onChange={handleChange}
                type="number"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="Descripcion">Descripción</label>
              <textarea
                id="Descripcion"
                name="Descripcion"
                value={newData.Descripcion}
                onChange={handleChange}
                className="form-control"
                style={{ width: '60%' }}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="Location">Ubicación</label>
              <input
                id="Location"
                name="Location"
                value={newLocation}
                onChange={(e) => handleLocationChange(e.target.value)}
                type="text"
                className="form-control"
              />
            </div>

            <LoadScript googleMapsApiKey="AIzaSyC8Z1d1IF6LZzsnPECKOIT6VAf0LRwV2uw">
              <GoogleMap
                center={mapCenter}
                zoom={15}
                mapContainerStyle={{ height: '400px', width: '100%' }}
                onClick={handleMapClick}
              >
                {newLocation && (
                  <Marker
                    position={newLocation}
                  />
                )}
              </GoogleMap>
            </LoadScript>

            <button type="submit" className="btn btn-primary">Actualizar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const Edit = () => {
  const [currentData, setCurrentData] = useState({
    Empresa: '',
    Puesto: '',
    Paga: 0,
    Descripcion: '',
  });
  const [currentLocation, setCurrentLocation] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const { getProductById, updateProduct } = useFirestore();

  const update = useCallback(async (newData, newLocation) => {
    const data = {
      Empresa: newData.Empresa,
      Puesto: newData.Puesto,
      Paga: newData.Paga,
      Descripcion: newData.Descripcion,
      Location: newLocation, 
    };
    await updateProduct(id, data);
    navigate('/');
  }, [navigate, updateProduct, id]);

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await getProductById(id);
      if (product) {
        setCurrentData(product);
        setCurrentLocation(product.Location); 
      }
    };
    fetchProduct();
  }, [getProductById, id]);

  return <EditForm currentData={currentData} currentLocation={currentLocation} onSubmit={update} />
}

export default Edit;
