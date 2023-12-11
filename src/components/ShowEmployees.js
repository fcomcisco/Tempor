import React, { useEffect, useState, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useJobs } from '../hooks/useJobs';
import { updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig/firebase';
import { Form, Row, Col, Button } from 'react-bootstrap';

const filterJobs = (jobs, filters, showNotPostulated) => {
  let filteredJobs = jobs;
  if (filters.Empresa) {
    filteredJobs = filteredJobs.filter(job => job.Empresa.toLowerCase().includes(filters.Empresa.toLowerCase()));
  }
  if (filters.Puesto) {
    filteredJobs = filteredJobs.filter(job => job.Puesto.toLowerCase().includes(filters.Puesto.toLowerCase()));
  }
  if (filters.Paga) {
    filteredJobs = filteredJobs.filter(job => job.Paga.toString() === filters.Paga);
  }
  if (filters.Location) {
    filteredJobs = filteredJobs.filter(job => job.location && job.location.address.toLowerCase().includes(filters.Location.toLowerCase()));
  }
  if (showNotPostulated) {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    filteredJobs = filteredJobs.filter(job => !job.interestedUsers?.includes(userId));
  }
  return filteredJobs;
};

const ShowEmployees = () => {
  const { jobs, fetchJobs } = useJobs();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showNotPostulated, setShowNotPostulated] = useState(false);
  const [filters, setFilters] = useState({
    Empresa: '',
    Puesto: '',
    Paga: '',
    Location: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const memoizedFilteredJobs = useMemo(() => filterJobs(jobs, filters, showNotPostulated), [jobs, filters, showNotPostulated]);

  useEffect(() => {
    setFilteredJobs(memoizedFilteredJobs);
  }, [memoizedFilteredJobs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyClqNKcEXF5otj2EPI4gmifCcsQ7n4dyag">
      <div className='container'>
        <div className='row my-3'>
          <div className='col'>
            <Button onClick={() => setShowFilters(!showFilters)} variant="primary">
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </Button>
            {showFilters && (
              <Form>
                <Row className="mt-3">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Empresa</Form.Label>
                      <Form.Control type="text" placeholder="Empresa" name="Empresa" value={filters.Empresa} onChange={handleFilterChange} />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Puesto</Form.Label>
                      <Form.Control type="text" placeholder="Puesto" name="Puesto" value={filters.Puesto} onChange={handleFilterChange} />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Paga</Form.Label>
                      <Form.Control type="text" placeholder="Paga" name="Paga" value={filters.Paga} onChange={handleFilterChange} />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Ubicación</Form.Label>
                      <Form.Control type="text" placeholder="Location" name="Location" value={filters.Location} onChange={handleFilterChange} />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            )}
          </div>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={showNotPostulated} onChange={() => setShowNotPostulated(!showNotPostulated)} />
            Solo mostrar trabajos a los que no he postulado
          </label>
        </div>
        {filteredJobs.length > 0 ? (
          <JobTable jobs={filteredJobs} />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', fontSize: '2rem' }}>
            No hay trabajos disponibles 😞
          </div>
        )}
      </div>
    </LoadScript>
  );
};

const JobTable = React.memo(({ jobs }) => (
  <table className='table table-dark table-hover'>
    <thead>
      <tr>
        <th>Empresa</th>
        <th>Puesto</th>
        <th>Paga</th>
        <th style={{ width: '20%' }}>Descripcion</th>
        <th>Ubicacion</th>
        <th>Postular</th>
      </tr>
    </thead>
    <tbody>
      {jobs.map(job => (
        <JobRow key={job.id} job={job} />
      ))}
    </tbody>
  </table>
));

const JobRow = React.memo(({ job }) => {
  const [isPostulated, setIsPostulated] = useState(false);

  useEffect(() => {
    const checkIfPostulated = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      const jobRef = doc(db, 'Jobs', job.id);
      const jobDoc = await getDoc(jobRef);
      if (jobDoc.exists() && jobDoc.data().interestedUsers?.includes(user.uid)) {
        setIsPostulated(true);
      }
    };

    checkIfPostulated();
  }, [job.id]);

  const handlePostulate = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    const jobRef = doc(db, 'Jobs', job.id);
    await updateDoc(jobRef, {
      interestedUsers: arrayUnion(user.uid),
    });
    setIsPostulated(true);
  };

  return (
    <tr>
      <td>{job.Empresa}</td>
      <td>{job.Puesto}</td>
      <td>{job.Paga}</td>
      <td>{job.Descripcion}</td>
      <td>
        {job.location && (
          <GoogleMap center={job.location} zoom={15} mapContainerStyle={{ height: '200px', width: '300px' }}>
            <Marker position={job.location} />
          </GoogleMap>
        )}
      </td>
      <td>
        <button className='btn btn-primary' onClick={handlePostulate} disabled={isPostulated}>
          {isPostulated ? 'Ya estas postulado' : 'Postular'}
        </button>
      </td>
    </tr>
  );
});

export default ShowEmployees;
