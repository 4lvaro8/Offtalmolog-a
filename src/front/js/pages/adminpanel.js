import React, { useContext, useState, useEffect } from 'react';
import { DateContext } from '../store/DateContext';
import { DoctorContext } from '../store/DoctorContext';
import { AvailabilityContext } from '../store/AvailabilityContext';
import DateTable from '../component/DateTable';
import DoctorTable from '../component/DoctorTable';
import AvailabilityTable from '../component/AvailabilityTable';
import { Button, Modal, Form, Spinner, Alert, Card, Row, Col } from 'react-bootstrap';
import { FaUserMd, FaCalendarAlt, FaClock } from 'react-icons/fa';

export const AdminPanel = () => {
  const { dates, addDate, updateDate, removeDate, loading: datesLoading, error: datesError } = useContext(DateContext);
  const { doctors, addDoctor, updateDoctor, removeDoctor, loading: doctorsLoading, error: doctorsError } = useContext(DoctorContext);
  const { availabilities, addAvailability, updateAvailability, removeAvailability, loading: availabilitiesLoading, error: availabilitiesError } = useContext(AvailabilityContext);

  // Estados para gestionar la apertura y cierre de modales
  const [showDateModal, setShowDateModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Estados para gestionar los datos actuales
  const [currentDate, setCurrentDate] = useState({ speciality: '', doctor: '', datetime: '', reason_for_appointment: '', date_type: '', user_id: '' });
  const [currentDoctor, setCurrentDoctor] = useState({ name: '', email: '', speciality: '', password: '', last_name: '', document_type: '', document_number: '', address: '', phone: '' });
  const [currentAvailability, setCurrentAvailability] = useState({ doctor_id: '', date: '', start_time: '', end_time: '', is_available: true });

  // Estado para gestionar la lista de usuarios
  const [users, setUsers] = useState([]);

  // Función para obtener la lista de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setUsers(data.user);  // Guardar la lista de usuarios en el estado
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Funciones para gestionar la apertura y cierre de modales
  const handleShowDateModal = (date = { speciality: '', doctor: '', datetime: '', reason_for_appointment: '', date_type: '', user_id: '' }) => {
    setCurrentDate(date);
    setEditMode(!!date.id);
    setShowDateModal(true);
  };

  const handleShowDoctorModal = (doctor = {}) => {
    setCurrentDoctor({
      name: '',
      email: '',
      speciality: '',
      password: '',
      last_name: '',
      document_type: '',
      document_number: '',
      address: '',
      phone: '',
      ...doctor
    });
    setEditMode(!!doctor.id);
    setShowDoctorModal(true);
  };

  const handleShowAvailabilityModal = (availability = { doctor_id: '', date: '', start_time: '', end_time: '', is_available: true }) => {
    setCurrentAvailability(availability);
    setEditMode(!!availability.id);
    setShowAvailabilityModal(true);
  };

  const handleCloseModal = () => {
    setShowDateModal(false);
    setShowDoctorModal(false);
    setShowAvailabilityModal(false);
  };

  // Handlers para gestionar los cambios en los formularios
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setCurrentDate({ ...currentDate, [name]: value });
  };

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    setCurrentDoctor({ ...currentDoctor, [name]: value });
  };

  const handleAvailabilityChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setCurrentAvailability({ ...currentAvailability, [name]: newValue });
  };

  // Funciones para manejar el envío de datos
  const handleDateSubmit = async (e) => {
    e.preventDefault();

    const newDate = {
      speciality: currentDate.speciality,
      doctor_id: currentDate.doctor,
      datetime: new Date(currentDate.datetime).toISOString(),
      reason_for_appointment: currentDate.reason_for_appointment,
      date_type: currentDate.date_type,
      user_id: currentDate.user_id
    };

    try {
      if (editMode) {
        await updateDate(newDate);
      } else {
        await addDate(newDate);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error creating/updating date:", error);
      alert("There was an error creating or updating the date.");
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    const { name, email, speciality, password } = currentDoctor;

    if (!name || !email || !speciality) {
      alert("Name, email, and speciality are required!");
      return;
    }

    if (!editMode && !password) {
      alert("Password is required for new doctors!");
      return;
    }

    try {
      if (editMode) {
        await updateDoctor(currentDoctor);
      } else {
        await addDoctor(currentDoctor);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error submitting doctor:", err);
    }
  };

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updateAvailability(currentAvailability);
    } else {
      await addAvailability(currentAvailability);
    }
    handleCloseModal();
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Admin Panel</h1>

      <Row>
        {/* Gestión de Citas */}
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <FaCalendarAlt className="me-2" /> Dates
              </Card.Title>
              <Button variant="primary" onClick={() => handleShowDateModal()}>
                <FaCalendarAlt className="me-2" /> Add Date
              </Button>

              {datesLoading && <Spinner animation="border" variant="primary" className="d-block mx-auto mt-3" />}
              {datesError && <Alert variant="danger" className="mt-3">{datesError}</Alert>}

              <DateTable dates={dates} handleShowModal={handleShowDateModal} removeDate={removeDate} />
            </Card.Body>
          </Card>
        </Col>

        {/* Gestión de Doctores */}
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <FaUserMd className="me-2" /> Doctors
              </Card.Title>
              <Button variant="primary" onClick={() => handleShowDoctorModal()}>
                <FaUserMd className="me-2" /> Add Doctor
              </Button>

              {doctorsLoading && <Spinner animation="border" variant="primary" className="d-block mx-auto mt-3" />}
              {doctorsError && <Alert variant="danger" className="mt-3">{doctorsError}</Alert>}

              <DoctorTable doctors={doctors} handleShowModal={handleShowDoctorModal} removeDoctor={removeDoctor} />
            </Card.Body>
          </Card>
        </Col>

        {/* Gestión de Disponibilidad */}
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <FaClock className="me-2" /> Availability
              </Card.Title>
              <Button variant="primary" onClick={() => handleShowAvailabilityModal()}>
                <FaClock className="me-2" /> Add Availability
              </Button>

              {availabilitiesLoading && <Spinner animation="border" variant="primary" className="d-block mx-auto mt-3" />}
              {availabilitiesError && <Alert variant="danger" className="mt-3">{availabilitiesError}</Alert>}

              <AvailabilityTable availabilities={availabilities} handleShowModal={handleShowAvailabilityModal} removeAvailability={removeAvailability} doctors={doctors} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para agregar/editar cita */}
      <Modal show={showDateModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{editMode ? 'Edit Date' : 'Add Date'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleDateSubmit}>
            <Form.Group controlId="formSpeciality" className="mb-3">
              <Form.Label>Speciality</Form.Label>
              <Form.Control
                type="text"
                name="speciality"
                value={currentDate.speciality}
                onChange={handleDateChange}
                placeholder="Enter speciality"
                required
              />
            </Form.Group>

            <Form.Group controlId="formDoctor" className="mb-3">
              <Form.Label>Doctor</Form.Label>
              <Form.Control
                as="select"
                name="doctor"
                value={currentDate.doctor}
                onChange={handleDateChange}
                required
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formDateTime" className="mb-3">
              <Form.Label>Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="datetime"
                value={currentDate.datetime}
                onChange={handleDateChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formReason" className="mb-3">
              <Form.Label>Reason for Appointment</Form.Label>
              <Form.Control
                as="textarea"
                name="reason_for_appointment"
                value={currentDate.reason_for_appointment}
                onChange={handleDateChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formDateType" className="mb-3">
              <Form.Label>Type of Appointment</Form.Label>
              <Form.Control
                type="text"
                name="date_type"
                value={currentDate.date_type}
                onChange={handleDateChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formUserId" className="mb-3">
              <Form.Label>User</Form.Label>
              <Form.Control
                as="select"
                name="user_id"
                value={currentDate.user_id}
                onChange={handleDateChange}
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.last_name} (ID: {user.id})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3 w-100">
              {editMode ? 'Update Date' : 'Add Date'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para agregar/editar doctor */}
      <Modal show={showDoctorModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Doctor' : 'Add Doctor'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleDoctorSubmit}>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentDoctor.name}
                onChange={handleDoctorChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentDoctor.email}
                onChange={handleDoctorChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDocumentType" className="mb-3">
              <Form.Label>Document Type</Form.Label>
              <Form.Control
                type="text"
                name="document_type"
                value={currentDoctor.document_type}
                onChange={handleDoctorChange}
                placeholder="Enter document type"
                required
              />
            </Form.Group>

            <Form.Group controlId="formSpeciality" className="mb-3">
              <Form.Label>Speciality</Form.Label>
              <Form.Control
                type="text"
                name="speciality"
                value={currentDoctor.speciality}
                onChange={handleDoctorChange}
                required
              />
            </Form.Group>

            {!editMode && (
              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={currentDoctor.password}
                  onChange={handleDoctorChange}
                  required={!editMode}
                />
              </Form.Group>
            )}

            <Form.Group controlId="formLastName" className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={currentDoctor.last_name}
                onChange={handleDoctorChange}
              />
            </Form.Group>

            <Form.Group controlId="formPhone" className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={currentDoctor.phone}
                onChange={handleDoctorChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3 w-100">
              {editMode ? 'Update Doctor' : 'Add Doctor'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para agregar/editar disponibilidad */}
      <Modal show={showAvailabilityModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Availability' : 'Add Availability'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAvailabilitySubmit}>
            <Form.Group controlId="formDoctorId" className="mb-3">
              <Form.Label>Doctor</Form.Label>
              <Form.Control
                as="select"
                name="doctor_id"
                value={currentAvailability.doctor_id}
                onChange={handleAvailabilityChange}
                required
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formDate" className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={currentAvailability.date}
                onChange={handleAvailabilityChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formStartTime" className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="start_time"
                value={currentAvailability.start_time}
                onChange={handleAvailabilityChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEndTime" className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="end_time"
                value={currentAvailability.end_time}
                onChange={handleAvailabilityChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formIsAvailable" className="mb-3">
              <Form.Check
                type="checkbox"
                name="is_available"
                label="Is Available"
                checked={currentAvailability.is_available}
                onChange={handleAvailabilityChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3 w-100">
              {editMode ? 'Update Availability' : 'Add Availability'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default AdminPanel;
