import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const Create = () => {
  const [formValues, setFormValues] = useState({
    Empresa: '',
    Puesto: '',
    Paga: 0,
    Descripcion: '',
    location: null
  });
  
  const [mapCenter, setMapCenter] = useState({ lat: -33.01536390718795, lng: -71.55007224355586 });
  const navigate = useNavigate();
  const searchBoxRef = useRef();

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div>
            <h1>Crear Trabajo</h1>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const productsCollection = collection(db, 'products');
                await addDoc(productsCollection, formValues);
                navigate('/');
              }}
            >
              <div className="mb-3">
                <label htmlFor="Empresa" className="form-label">Empresa</label>
                <input
                  id="Empresa"
                  name="Empresa"
                  value={formValues.Empresa}
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="Puesto" className="form-label">Puesto</label>
                <input
                  id="Puesto"
                  name="Puesto"
                  value={formValues.Puesto}
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="Paga" className="form-label">Paga</label>
                <input
                  id="Paga"
                  name="Paga"
                  value={formValues.Paga}
                  onChange={handleChange}
                  type="number"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="Descripcion" className="form-label">Descripcion</label>
                <textarea
                  id="Descripcion"
                  name="Descripcion"
                  value={formValues.Descripcion}
                  onChange={handleChange}
                  className="form-control"
                  style={{ width: '60%' }}
                ></textarea>
              </div>
              <LoadScript googleMapsApiKey="AIzaSyC8Z1d1IF6LZzsnPECKOIT6VAf0LRwV2uw" libraries={["places"]}>
                <StandaloneSearchBox
                  onLoad={ref => searchBoxRef.current = ref}
                  onPlacesChanged={() => {
                    const place = searchBoxRef.current.getPlaces()[0];
                    const location = {
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng(),
                    };
                    setMapCenter(location);
                    setFormValues({ ...formValues, location });
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search location"
                    style={{ width: '100%', height: '40px', paddingLeft: '15px' }}
                  />
                </StandaloneSearchBox>
                <GoogleMap
                  center={mapCenter}
                  zoom={15}
                  mapContainerStyle={{ height: '400px', width: '100%' }} // Adjusted size
                  onClick={(e) => {
                    const location = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                    setMapCenter(location);
                    setFormValues({ ...formValues, location });
                  }}
                >
                  {mapCenter && <Marker
                    position={mapCenter}
                    icon={{
                      url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    }}
                  />}
                </GoogleMap>
              </LoadScript>
              <button type="submit" className="btn btn-primary">Publicar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
