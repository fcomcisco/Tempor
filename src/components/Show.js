import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import { useProducts } from '../hooks/useProducts';

const MySwal = withReactContent(Swal);

const Show = () => {
  const { products, refresh, fetchProducts, deleteProduct } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, refresh]);

  const confirmDelete = (id) => {
    MySwal.fire({
      title: 'Estas seguro?',
      text: 'No podrás volver atrás',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, deseo borrarlo',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(id);
        MySwal.fire('Borrado', 'Se ha borrado correctamente', 'success');
      }
    });
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col'>
          <LinkButton to='/create' className='btn btn-secondary mt-2 mb-2'>
            <i className='fas fa-plus'></i> Create
          </LinkButton>
          <ProductTable products={products} onDeleteConfirm={confirmDelete} />
        </div>
      </div>
    </div>
  );
};

const LinkButton = ({ to, children, className }) => (
  <div className='d-grid gap-2'>
    <Link to={to} className={className}>
      {children}
    </Link>
  </div>
);

const ProductTable = ({ products, onDeleteConfirm }) => (
  <table className='table table-dark table-hover'>
    <thead>
      <tr>
        <th>Empresa</th>
        <th>Puesto</th>
        <th>Paga</th>
        <th style={{width: '20%'}}>Descripcion</th>
        <th>Location</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {products.map((product) => (
        <ProductRow key={product.id} product={product} onDeleteConfirm={onDeleteConfirm} />
      ))}
    </tbody>
  </table>
);

const ProductRow = ({ product, onDeleteConfirm }) => (
  <tr>
    <td>{product.Empresa}</td>
    <td>{product.Puesto}</td>
    <td>{product.Paga}</td>
    <td>{product.Descripcion}</td>
    <td>
      {product.location && (
        <LoadScript googleMapsApiKey="AIzaSyC8Z1d1IF6LZzsnPECKOIT6VAf0LRwV2uw">
          <GoogleMap
            center={product.location}
            zoom={15}
            mapContainerStyle={{ height: "200px", width: "300px" }}
          >
            <Marker position={product.location} />
          </GoogleMap>
        </LoadScript>
      )}
    </td>
    <td>
      <Link to={`/edit/${product.id}`} className='btn btn-light'>
        <i className='fas fa-edit'></i> Editar
      </Link>
      <button onClick={() => onDeleteConfirm(product.id)} className='btn btn-danger'>
        <i className='fas fa-trash'></i> Borrar
      </button>
    </td>
  </tr>
);

export default Show;
