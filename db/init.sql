--
-- PostgreSQL database dump
--

\restrict J4byOdfeHFrIH22biAIDJ0sdxHgbR9fpCV9x5tw25BofMGUdg8zwls3vqEePwqN

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-03-20 14:49:12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
--SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 16479)
-- Name: psicologia; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA psicologia;


ALTER SCHEMA psicologia OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16406)
-- Name: administradores; Type: TABLE; Schema: psicologia; Owner: postgres
--

CREATE TABLE psicologia.administradores (
    id integer NOT NULL,
    no_control integer NOT NULL,
    nombre character varying(255) NOT NULL,
    apellido character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    rol character varying(50) DEFAULT 'administrador'::character varying
);


ALTER TABLE psicologia.administradores OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16404)
-- Name: administradores_id_seq; Type: SEQUENCE; Schema: psicologia; Owner: postgres
--

CREATE SEQUENCE psicologia.administradores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE psicologia.administradores_id_seq OWNER TO postgres;

--
-- TOC entry 5074 (class 0 OID 0)
-- Dependencies: 222
-- Name: administradores_id_seq; Type: SEQUENCE OWNED BY; Schema: psicologia; Owner: postgres
--

ALTER SEQUENCE psicologia.administradores_id_seq OWNED BY psicologia.administradores.id;


--
-- TOC entry 223 (class 1259 OID 16405)
-- Name: administradores_no_control_seq; Type: SEQUENCE; Schema: psicologia; Owner: postgres
--

CREATE SEQUENCE psicologia.administradores_no_control_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE psicologia.administradores_no_control_seq OWNER TO postgres;

--
-- TOC entry 5075 (class 0 OID 0)
-- Dependencies: 223
-- Name: administradores_no_control_seq; Type: SEQUENCE OWNED BY; Schema: psicologia; Owner: postgres
--

ALTER SEQUENCE psicologia.administradores_no_control_seq OWNED BY psicologia.administradores.no_control;


--
-- TOC entry 228 (class 1259 OID 16443)
-- Name: agenda; Type: TABLE; Schema: psicologia; Owner: postgres
--

CREATE TABLE psicologia.agenda (
    id integer NOT NULL,
    no_control_user integer,
    no_control_admin integer,
    title character varying(50) NOT NULL,
    session_number integer NOT NULL,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    status character varying(100) DEFAULT 'Pendiente'::character varying,
    modality character varying(50) DEFAULT 'Presencial'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE psicologia.agenda OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16442)
-- Name: agenda_id_seq; Type: SEQUENCE; Schema: psicologia; Owner: postgres
--

CREATE SEQUENCE psicologia.agenda_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE psicologia.agenda_id_seq OWNER TO postgres;

--
-- TOC entry 5076 (class 0 OID 0)
-- Dependencies: 227
-- Name: agenda_id_seq; Type: SEQUENCE OWNED BY; Schema: psicologia; Owner: postgres
--

ALTER SEQUENCE psicologia.agenda_id_seq OWNED BY psicologia.agenda.id;


--
-- TOC entry 226 (class 1259 OID 16427)
-- Name: expediente; Type: TABLE; Schema: psicologia; Owner: postgres
--

CREATE TABLE psicologia.expediente (
    id integer NOT NULL,
    no_control integer NOT NULL,
    numero_sesiones integer,
    motivo_consulta character varying(255),
    desencadenantes_motivo character varying(255),
    plan_orientacion character varying(225),
    seguimiento character varying(225)
);


ALTER TABLE psicologia.expediente OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16426)
-- Name: expediente_id_seq; Type: SEQUENCE; Schema: psicologia; Owner: postgres
--

CREATE SEQUENCE psicologia.expediente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE psicologia.expediente_id_seq OWNER TO postgres;

--
-- TOC entry 5077 (class 0 OID 0)
-- Dependencies: 225
-- Name: expediente_id_seq; Type: SEQUENCE OWNED BY; Schema: psicologia; Owner: postgres
--

ALTER SEQUENCE psicologia.expediente_id_seq OWNED BY psicologia.expediente.id;


--
-- TOC entry 221 (class 1259 OID 16390)
-- Name: usuario; Type: TABLE; Schema: psicologia; Owner: postgres
--

CREATE TABLE psicologia.usuario (
    no_control integer NOT NULL,
    nombre character varying(100),
    apellido character varying(100),
    sexo character varying(10),
    edad integer,
    estado_civil character varying(20),
    direccion character varying(255),
    telefono character varying(10),
    ingenieria character varying(100),
    modalidad character varying(50),
    semestre integer,
    fecha_registro date,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    rol character varying(50) DEFAULT 'usuario'::character varying
);


ALTER TABLE psicologia.usuario OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16389)
-- Name: usuario_no_control_seq; Type: SEQUENCE; Schema: psicologia; Owner: postgres
--

CREATE SEQUENCE psicologia.usuario_no_control_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE psicologia.usuario_no_control_seq OWNER TO postgres;

--
-- TOC entry 5078 (class 0 OID 0)
-- Dependencies: 220
-- Name: usuario_no_control_seq; Type: SEQUENCE OWNED BY; Schema: psicologia; Owner: postgres
--

ALTER SEQUENCE psicologia.usuario_no_control_seq OWNED BY psicologia.usuario.no_control;


--
-- TOC entry 230 (class 1259 OID 16463)
-- Name: usuarios; Type: TABLE; Schema: psicologia; Owner: postgres
--

CREATE TABLE psicologia.usuarios (
    id bigint NOT NULL,
    email character varying(255) NOT NULL,
    nombre character varying(255) NOT NULL,
    apellido character varying(255) NOT NULL,
    telefono character varying(80) NOT NULL,
    imagen character varying(255),
    password character varying(255) NOT NULL,
    is_available boolean,
    session_token character varying(255),
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);


ALTER TABLE psicologia.usuarios OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16462)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: psicologia; Owner: postgres
--

CREATE SEQUENCE psicologia.usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE psicologia.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5079 (class 0 OID 0)
-- Dependencies: 229
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: psicologia; Owner: postgres
--

ALTER SEQUENCE psicologia.usuarios_id_seq OWNED BY psicologia.usuarios.id;


--
-- TOC entry 4880 (class 2604 OID 16409)
-- Name: administradores id; Type: DEFAULT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.administradores ALTER COLUMN id SET DEFAULT nextval('psicologia.administradores_id_seq'::regclass);


--
-- TOC entry 4881 (class 2604 OID 16410)
-- Name: administradores no_control; Type: DEFAULT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.administradores ALTER COLUMN no_control SET DEFAULT nextval('psicologia.administradores_no_control_seq'::regclass);


--
-- TOC entry 4884 (class 2604 OID 16446)
-- Name: agenda id; Type: DEFAULT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.agenda ALTER COLUMN id SET DEFAULT nextval('psicologia.agenda_id_seq'::regclass);


--
-- TOC entry 4883 (class 2604 OID 16430)
-- Name: expediente id; Type: DEFAULT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.expediente ALTER COLUMN id SET DEFAULT nextval('psicologia.expediente_id_seq'::regclass);


--
-- TOC entry 4878 (class 2604 OID 16393)
-- Name: usuario no_control; Type: DEFAULT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.usuario ALTER COLUMN no_control SET DEFAULT nextval('psicologia.usuario_no_control_seq'::regclass);


--
-- TOC entry 4889 (class 2604 OID 16466)
-- Name: usuarios id; Type: DEFAULT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.usuarios ALTER COLUMN id SET DEFAULT nextval('psicologia.usuarios_id_seq'::regclass);


--
-- TOC entry 5062 (class 0 OID 16406)
-- Dependencies: 224
-- Data for Name: administradores; Type: TABLE DATA; Schema: psicologia; Owner: postgres
--

COPY psicologia.administradores (id, no_control, nombre, apellido, email, password, rol) FROM stdin;
3	100	Admin	Principal	admin@psicologia.edu	123456	admin
\.


--
-- TOC entry 5066 (class 0 OID 16443)
-- Dependencies: 228
-- Data for Name: agenda; Type: TABLE DATA; Schema: psicologia; Owner: postgres
--

COPY psicologia.agenda (id, no_control_user, no_control_admin, title, session_number, start_time, end_time, status, modality, created_at, updated_at) FROM stdin;
16	\N	\N	Sesión 1 - Presencial	1	2026-02-07 20:30:00	2026-02-07 21:30:00	Pendiente	Presencial	2026-02-08 14:48:10.414723	2026-02-08 14:48:10.414723
\.


--
-- TOC entry 5064 (class 0 OID 16427)
-- Dependencies: 226
-- Data for Name: expediente; Type: TABLE DATA; Schema: psicologia; Owner: postgres
--

COPY psicologia.expediente (id, no_control, numero_sesiones, motivo_consulta, desencadenantes_motivo, plan_orientacion, seguimiento) FROM stdin;
2	22940028	1	salud	ansiedada	xxxx	ssss
\.


--
-- TOC entry 5059 (class 0 OID 16390)
-- Dependencies: 221
-- Data for Name: usuario; Type: TABLE DATA; Schema: psicologia; Owner: postgres
--

COPY psicologia.usuario (no_control, nombre, apellido, sexo, edad, estado_civil, direccion, telefono, ingenieria, modalidad, semestre, fecha_registro, email, password, rol) FROM stdin;
99999999	Test	User	masculino	25	soltero	test 123	1234567890	isc	escolarizado	5	2024-02-04	test999@test.com	123456	usuario
22940058	Luis	Carmona	masculino	23	casado	test	1234567890	isc	escolarizado	8	2024-02-04	luis@gmail.com	123456	usuario
22940028	Lore	Carmona	femenino	22	casado	2ce	1234567899	iem	escolarizado	6	2026-03-09	lorena@gmail.com	123456	usuario
22940033	juan	gonzales	masculino	21	soltero	xxxxx	1234567890	isc	escolarizado	8	2026-02-04	juan@gmail.com	123456	usuario
22940021	michel	betancourt lopez	femenino	21	soltero	sin direccion	1234567891	isc	escolarizado	8	2026-02-09	michel@gmail.com	123456	usuario
22940022	Sarah	betancourt lopez	femenino	21	soltero	sin direccion	1234567891	isc	escolarizado	9	2026-02-04	sarah@gmail.com	123456	usuario
22940050	Gaby	perez	femenino	21	soltero	zazaza	2761335243	iia	escolarizado	5	2026-04-09	gaby@gmail.com	123456	usuario
22940010	Sam	Lopez	masculino	20	soltero	hihihi	1234567895	iias	escolarizado	6	2026-02-09	sam@gmail.com	123456	usuario
22940024	Lorely	Carmona Vazquez	Femenino	21	Soltera	XXXXX	2761335243	Sistemas Computacionales	Escolarizada	8	\N	22940024@itt.edu	123456	usuario
22940030	sam	lopez	femenino	34	casado	lkasjddkj	1987365268	iia	escolarizado	5	2026-02-09	lopez@gmail.com	123456	usuario
\.


--
-- TOC entry 5068 (class 0 OID 16463)
-- Dependencies: 230
-- Data for Name: usuarios; Type: TABLE DATA; Schema: psicologia; Owner: postgres
--

COPY psicologia.usuarios (id, email, nombre, apellido, telefono, imagen, password, is_available, session_token, created_at, updated_at) FROM stdin;
1	admin@example.com	Manuel	Hernandez	99946464	\N	123456	\N	\N	2021-01-14 12:00:00	2021-01-14 12:00:00
\.


--
-- TOC entry 5080 (class 0 OID 0)
-- Dependencies: 222
-- Name: administradores_id_seq; Type: SEQUENCE SET; Schema: psicologia; Owner: postgres
--

SELECT pg_catalog.setval('psicologia.administradores_id_seq', 3, true);


--
-- TOC entry 5081 (class 0 OID 0)
-- Dependencies: 223
-- Name: administradores_no_control_seq; Type: SEQUENCE SET; Schema: psicologia; Owner: postgres
--

SELECT pg_catalog.setval('psicologia.administradores_no_control_seq', 1, false);


--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 227
-- Name: agenda_id_seq; Type: SEQUENCE SET; Schema: psicologia; Owner: postgres
--

SELECT pg_catalog.setval('psicologia.agenda_id_seq', 65, true);


--
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 225
-- Name: expediente_id_seq; Type: SEQUENCE SET; Schema: psicologia; Owner: postgres
--

SELECT pg_catalog.setval('psicologia.expediente_id_seq', 6, true);


--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 220
-- Name: usuario_no_control_seq; Type: SEQUENCE SET; Schema: psicologia; Owner: postgres
--

SELECT pg_catalog.setval('psicologia.usuario_no_control_seq', 1, false);


--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 229
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: psicologia; Owner: postgres
--

SELECT pg_catalog.setval('psicologia.usuarios_id_seq', 1, true);


--
-- TOC entry 4895 (class 2606 OID 16425)
-- Name: administradores administradores_email_key; Type: CONSTRAINT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.administradores
    ADD CONSTRAINT administradores_email_key UNIQUE (email);


--
-- TOC entry 4897 (class 2606 OID 16423)
-- Name: administradores administradores_no_control_key; Type: CONSTRAINT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.administradores
    ADD CONSTRAINT administradores_no_control_key UNIQUE (no_control);


--
-- TOC entry 4899 (class 2606 OID 16421)
-- Name: administradores administradores_pkey; Type: CONSTRAINT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.administradores
    ADD CONSTRAINT administradores_pkey PRIMARY KEY (id);


--
-- TOC entry 4905 (class 2606 OID 16451)
-- Name: agenda agenda_pkey; Type: CONSTRAINT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.agenda
    ADD CONSTRAINT agenda_pkey PRIMARY KEY (id);


--
-- TOC entry 4901 (class 2606 OID 16510)
-- Name: expediente expediente_no_control_unique; Type: CONSTRAINT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.expediente
    ADD CONSTRAINT expediente_no_control_unique UNIQUE (no_control);


--
-- TOC entry 4903 (class 2606 OID 16436)
-- Name: expediente expediente_pkey; Type: CONSTRAINT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.expediente
    ADD CONSTRAINT expediente_pkey PRIMARY KEY (id);


--
-- TOC entry 4891 (class 2606 OID 16403)
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- TOC entry 4893 (class 2606 OID 16401)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (no_control);


--
-- TOC entry 4907 (class 2606 OID 16478)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4908 (class 2606 OID 16437)
-- Name: expediente expediente_no_control_fkey; Type: FK CONSTRAINT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.expediente
    ADD CONSTRAINT expediente_no_control_fkey FOREIGN KEY (no_control) REFERENCES psicologia.usuario(no_control) ON DELETE CASCADE;


--
-- TOC entry 4909 (class 2606 OID 16457)
-- Name: agenda fk_no_control_admin; Type: FK CONSTRAINT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.agenda
    ADD CONSTRAINT fk_no_control_admin FOREIGN KEY (no_control_admin) REFERENCES psicologia.administradores(no_control) ON DELETE CASCADE;


--
-- TOC entry 4910 (class 2606 OID 16452)
-- Name: agenda fk_no_control_user; Type: FK CONSTRAINT; Schema: psicologia; Owner: postgres
--

ALTER TABLE ONLY psicologia.agenda
    ADD CONSTRAINT fk_no_control_user FOREIGN KEY (no_control_user) REFERENCES psicologia.usuario(no_control) ON DELETE CASCADE;


-- Completed on 2026-03-20 14:49:13

--
-- PostgreSQL database dump complete
--

\unrestrict J4byOdfeHFrIH22biAIDJ0sdxHgbR9fpCV9x5tw25BofMGUdg8zwls3vqEePwqN

