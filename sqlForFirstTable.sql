CREATE TABLE tbl_tasks (
    fld_task_id integer NOT NULL,
    fld_task_desc character varying(80),
    fld_task_due date,
    fld_task_priority character varying(10),
    fld_task_status character varying(10)
);
CREATE SEQUENCE tbl_tasks_fld_task_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE tbl_tasks_fld_task_id_seq OWNED BY tbl_tasks.fld_task_id;
ALTER TABLE ONLY tbl_tasks ALTER COLUMN fld_task_id SET DEFAULT nextval('tbl_tasks_fld_task_id_seq'::regclass);

ALTER TABLE ONLY tbl_tasks
    ADD CONSTRAINT tbl_tasks_pkey PRIMARY KEY (fld_task_id);

CREATE TABLE tbl_priorities (
    fld_priority_id integer NOT NULL,
    fld_priority_label character varying(20),
    fld_priority_code integer
);

CREATE SEQUENCE tbl_priorities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tbl_priorities_id_seq OWNED BY tbl_priorities.fld_priority_id;
ALTER TABLE ONLY tbl_priorities ALTER COLUMN fld_priority_id SET DEFAULT nextval('tbl_priorities_id_seq'::regclass);
ALTER TABLE ONLY tbl_priorities
    ADD CONSTRAINT tbl_priorities_pkey PRIMARY KEY (fld_priority_id);

INSERT INTO tbl_priorities (fld_priority_label, fld_priority_code) VALUES ('None','0');
INSERT INTO tbl_priorities (fld_priority_label, fld_priority_code) VALUES ('Low','1');
INSERT INTO tbl_priorities (fld_priority_label, fld_priority_code) VALUES ('Medium','2');
INSERT INTO tbl_priorities (fld_priority_label, fld_priority_code) VALUES ('High','3');
