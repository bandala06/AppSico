import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/es";
import clienteAxios from '../../api/clienteAxios';
import { Expediente } from './Expediente'
import { MostrarExpediente } from './MostrarExpediente'

const localizer = momentLocalizer(moment);

export const Agend = () => {
  const location = useLocation()
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventModality, setEventModality] = useState("");
  const [sessionNumber, setSessionNumber] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventStatus, setEventStatus] = useState(""); 
  const [selectEvent, setSelectEvent] = useState(null);
  const [role, setRole] = useState("user");
  const [noControl, setNoControl] = useState(null);

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  // Función para obtener eventos (Ruta corregida con /api/agenda)
  const fetchEvents = async () => {
    try {
      let response;
      if (noControl || role === "admin") {
        response = await clienteAxios.get('/api/agenda/getAllEvents');
      }
      if (response?.data) {
        const formattedEvents = response.data.map((event) => ({
          ...event,
          start: new Date(event.start_time),
          end: new Date(event.end_time),
        }));
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Error al obtener los eventos:", error);
    }
  };

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedNoControl = localStorage.getItem('no_control');

    if (!storedRole || !storedNoControl) {
      console.warn("Sesión no iniciada");
      return;
    }

    setRole(storedRole);
    setNoControl(storedNoControl);
    
  }, []);

  useEffect(() => {
    if (role === "admin" || noControl) {
      fetchEvents();
    }
  }, [noControl, role]);

  const saveEvent = async () => {
    if (eventModality && selectedDate && eventTime && sessionNumber) {
      const [hours, minutes] = eventTime.split(':');

      const eventStart = selectEvent
        ? moment(selectEvent.start).set({ hour: hours, minute: minutes }).subtract(6, 'hours').toISOString()
        : moment(selectedDate).set({ hour: hours, minute: minutes }).subtract(6, 'hours').toISOString();

      const eventEnd = moment(eventStart).add(1, 'hours').toISOString();

      const updatedEvent = {
        title: `Sesión ${sessionNumber} - ${eventModality}`,
        session_number: parseInt(sessionNumber, 10),
        start_time: eventStart,
        end_time: eventEnd,
        no_control_user: role === "usuario" ? noControl : null,
        no_control_admin: role === "admin" ? noControl : null,
        status: eventStatus 
      };

      try {
        if (selectEvent) {
          // Ruta corregida con /api/agenda
          const response = await clienteAxios.put(`/api/agenda/updateEvent/${selectEvent.id}`, updatedEvent);
          if (response.status === 200) {
            setEvents(events.map((event) =>
              event.id === selectEvent.id
                ? { ...event, ...updatedEvent, start: new Date(eventStart), end: new Date(eventEnd) }
                : event
            ));
            setShowModal(false);
          } else {
            console.error('Error al actualizar la cita:', response);
          }
        } else {
          // Ruta corregida con /api/agenda
          const response = await clienteAxios.post('/api/agenda/createEvent', updatedEvent);
          if (response.status === 200 || response.status === 201) {
            setEvents([
              ...events,
              { ...updatedEvent, id: response.data.id, start: new Date(eventStart), end: new Date(eventEnd) },
            ]);
            setShowModal(false);
          } else {
            console.error('Error al crear la cita:', response);
          }
        }
      } catch (error) {
        console.error('Error al guardar el evento:', error);
      }
    } else {
      alert('Por favor, completa todos los campos antes de guardar.');
    }
  };

  const deleteEvent = async () => {
    if (selectEvent) {
      try {
        // Ruta corregida con /api/agenda
        await clienteAxios.delete(`/api/agenda/deleteEvent/${selectEvent.id}`);
        setEvents(events.filter((event) => event.id !== selectEvent.id));
        setShowModal(false);
      } catch (error) {
        console.error("Error al eliminar el evento:", error);
      }
    }
  };

  const handleSelectSlot = (slotInfo) => {
    const today = moment().startOf("day");
    const selectedDay = moment(slotInfo.start).startOf("day");

    if (selectedDay.isBefore(today)) {
      alert("No puedes agendar citas en días anteriores.");
      return;
    }

    if (role === "usuario" || role === "admin") {
      setShowModal(true);
      setSelectedDate(slotInfo.start);
      setSelectEvent(null);
      setEventModality("");
      setSessionNumber("");
      setEventTime("");
      setEventStatus(""); 
    }
  };

  const handleSelectEvent = (event) => {
    const today = moment().startOf("day");
    const eventDay = moment(event.start).startOf("day");

    if (eventDay.isBefore(today)) {
      alert("No puedes modificar citas en días anteriores.");
      return;
    }

    if (role === "admin") {
      setShowModal(true);
      setSelectEvent(event);
      setEventModality(event.title.split(" - ")[1] || "");
      setSessionNumber(event.session_number || "");
      setEventTime(moment(event.start).format("HH:mm"));
      setEventStatus(event.status || ""); 
    } else {
      setShowModal(true);
      setSelectEvent(event);
      setEventModality(event.title.split(" - ")[1] || "");
      setSessionNumber(event.session_number || "");
      setEventTime(moment(event.start).format("HH:mm"));
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let i = 8; i <= 20; i++) { 
      const hour = i < 10 ? `0${i}` : i;
      options.push(`${hour}:00`);
      options.push(`${hour}:30`);
    }
    return options;
  }

  return (
    <>
      <div className="divagenda">

        <div className="titulosagenda">
          {role === "admin" && (
            <div >
              <h2>Panel de Administración</h2>
              <p>Aquí puedes gestionar citas y eventos de forma avanzada.</p>
            </div>
          )}
          {role === "usuario" && (
            <div >
              <h2>Bienvenido, Usuario</h2>
              <p>Aquí puedes ver y agendar tus citas.</p>
            </div>
          )}
        </div>
        <hr className="hragenda" />
        <h2 className="tiagenda">
          Agenda
        </h2>
        <div className="calendario">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ margin: "20px" }}
            selectable={role === "usuario" || role === "admin"} 
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
          />
        </div>

        {role === "admin" && (
          <div>
            <hr className="hragenda" id="Expediente"/>
            <h2 className="tiagenda">
              Generación de expedientes
            </h2>
            <div className="extragenda">
              <div className="expedienteag">
                <Expediente />
              </div>
              <hr className="hragenda"  />
              <h2 id="MostrarExpediente" className="tiagenda">
                Búsqueda de expediente psicológico
              </h2>
              <div className="verexpedienteag">
                <MostrarExpediente />
              </div>

            </div>
          </div>
        )}

        {showModal && (
          <div
            className="modal"
            style={{
              display: "block",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {selectEvent ? "Editar cita" : "Agregar cita"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <label>Modalidad:</label>
                  <select
                    className="form-control"
                    value={eventModality}
                    onChange={(e) => setEventModality(e.target.value)}
                    readOnly={role !== "admin" && selectEvent} 
                  >
                    <option value="">Selecciona una modalidad</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                  </select>
                  <label>No. Sesión:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={sessionNumber}
                    onChange={(e) => setSessionNumber(e.target.value)}
                    readOnly={role !== "admin" && selectEvent} 
                  />
                  <label>Hora:</label>
                  <select
                    className="form-control"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    readOnly={role !== "admin" && selectEvent} 
                  >
                    <option value="">Selecciona una hora</option>
                    {generateTimeOptions().map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {role === "admin" && ( 
                    <>
                      <label>Número de Control:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectEvent ? selectEvent.no_control_user || selectEvent.no_control_admin : noControl} 
                        readOnly 
                      />
                      <label>Estatus:</label>
                      <select
                        className="form-control"
                        value={eventStatus}
                        onChange={(e) => setEventStatus(e.target.value)}
                      >
                        <option value="">Selecciona un estatus</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Confirmado">Confirmado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  {role === "admin" && selectEvent && (
                    <button
                      type="button"
                      className="btn btn-danger me-2"
                      onClick={deleteEvent}
                    >
                      Eliminar cita
                    </button>
                  )}
                  {role === "admin" || !selectEvent ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={saveEvent}
                    >
                      {selectEvent ? "Actualizar cita" : "Guardar cita"}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </>
  );
};