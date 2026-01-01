CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

ALTER TABLE roles 
    ADD CONSTRAINT uq_roles_name UNIQUE (name);


CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users 
    ADD CONSTRAINT uq_users_email UNIQUE (email);


CREATE TABLE IF NOT EXISTS users_roles (
    user_id BIGINT NOT NULL,
    role_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

ALTER TABLE users_roles 
    ADD CONSTRAINT fk_users_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE users_roles 
    ADD CONSTRAINT fk_users_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE;


CREATE TABLE IF NOT EXISTS mood_entries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    mood_value INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE mood_entries 
    ADD CONSTRAINT fk_mood_entries_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE mood_entries 
    ADD CONSTRAINT chk_mood_value_range CHECK (mood_value BETWEEN 1 AND 10);


CREATE TABLE IF NOT EXISTS exercises (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    content_url VARCHAR(255), -- Link to video/pdf if needed
    created_by_user_id BIGINT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE exercises 
    ADD CONSTRAINT fk_exercises_creator FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL;


CREATE TABLE IF NOT EXISTS patient_exercises (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    exercise_id BIGINT NOT NULL,
    assigned_by_user_id BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING or COMPLETED
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

ALTER TABLE patient_exercises 
    ADD CONSTRAINT fk_patient_exercises_patient FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE patient_exercises 
    ADD CONSTRAINT fk_patient_exercises_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE;
ALTER TABLE patient_exercises 
    ADD CONSTRAINT fk_patient_exercises_doctor FOREIGN KEY (assigned_by_user_id) REFERENCES users(id) ON DELETE SET NULL;


-- Speed up login lookups by email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Speed up retrieving mood history for a specific user (important for charts)
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date ON mood_entries(user_id, created_at);

-- Speed up retrieving a patient's exercise list (Dashboard view)
CREATE INDEX IF NOT EXISTS idx_patient_exercises_patient_status ON patient_exercises(patient_id, status);

-- Speed up doctors seeing whom they assigned exercises to
CREATE INDEX IF NOT EXISTS idx_patient_exercises_doctor ON patient_exercises(assigned_by_user_id);