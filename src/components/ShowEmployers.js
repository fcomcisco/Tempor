import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useJobs } from '../hooks/useJobs';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const MySwal = withReactContent(Swal);

const ShowEmployers = () => {
  const { jobs, refresh, fetchJobs, deleteJob } = useJobs();
  const [currentUserID, setCurrentUserID] = useState(null);

  useEffect(() => {
    fetchJobs();
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserID(user.uid);
      } else {
        setCurrentUserID(null);
      }
    });
    return () => unsubscribe();
  }, [fetchJobs, refresh]);

  const confirmDelete = (id) => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás volver atrás',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, deseo borrarlo',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteJob(id);
        MySwal.fire('Borrado', 'Se ha borrado correctamente', 'success');
      }
    });
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col'>
          <h2 className='mb-4' style={{ textAlign: 'center' }}>Estos son tus trabajos</h2> 
          <LinkButton to='/create' className='btn btn-secondary mt-2 mb-2'>
            <i className='fas fa-plus'></i> Crear Trabajo
          </LinkButton>
          <JobTable jobs={jobs} onDeleteConfirm={confirmDelete} currentUserID={currentUserID} />
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

const JobTable = ({ jobs, onDeleteConfirm, currentUserID }) => {
  const userJobs = jobs.filter((job) => job.CreatorId === currentUserID);

  return (
    <table className='table table-dark table-hover'>
      <thead>
        <tr>
          <th>Empresa</th>
          <th>Puesto</th>
          <th>Paga</th>
          <th style={{ width: '20%' }}>Descripción</th>
          <th>Ubicación</th>
          <th>Fechas</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {userJobs.map((job) => (
          <JobRow key={job.id} job={job} onDeleteConfirm={onDeleteConfirm} />
        ))}
      </tbody>
    </table>
  );
};

const JobRow = ({ job, onDeleteConfirm }) => {
  const formatDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString('en-GB');
    }
    return '';
  };

  return (
    <tr>
      <td>{job.Empresa}</td>
      <td>{job.Puesto}</td>
      <td>{job.Paga}</td>
      <td>{job.Descripcion}</td>
      <td>
        {job.location && (
          <>
            <div>{job.location.address}</div>
            <LoadScript googleMapsApiKey="AIzaSyClqNKcEXF5otj2EPI4gmifCcsQ7n4dyag">
              <GoogleMap
                center={job.location}
                zoom={15}
                mapContainerStyle={{ height: "200px", width: "300px" }}
              >
                <Marker position={job.location} />
              </GoogleMap>
            </LoadScript>
          </>
        )}
      </td>
      <td>
        {job.startDate && <div>Inicio: {formatDate(job.startDate)}</div>}
        {job.endDate && <div>Fin: {formatDate(job.endDate)}</div>}
      </td>
      <td>
        <Link to={`/edit/${job.id}`} className='btn btn-light'>
          <i className='fas fa-edit'></i> Editar
        </Link>
        <button onClick={() => onDeleteConfirm(job.id)} className='btn btn-danger'>
          <i className='fas fa-trash'></i> Borrar
        </button>
        <Link to={`/postulates/${job.id}`} className='btn btn-info'>
          <i className='fas fa-users'></i> Candidatos
        </Link>
        <Link to={`/workers/${job.id}`} className='btn btn-primary'>
          <i className='fas fa-hard-hat'></i> Trabajadores
        </Link>
      </td>
    </tr>
  );
};



export default ShowEmployers;
