INSERT INTO roles (name) VALUES 
    ('ROLE_ADMIN'), 
    ('ROLE_DOCTOR'), 
    ('ROLE_PATIENT')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- TEST CREDENTIALS FOR POSTMAN:
-- All test users use the same password: "password"
-- BCrypt hash: $2a$10$eAccYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORr7x.hWETncCzof9G
-- 
-- Doctor: sarah.smith@mindwell.com / password
-- Patient: john.doe@mindwell.com / password
-- Patient: jane.roe@mindwell.com / password
-- Admin: admin@mindwell.com / password
-- ============================================================================

INSERT INTO users (email, password_hash, full_name, role_id)
SELECT 
    'admin@mindwell.com', 
    '$2a$10$eAccYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORr7x.hWETncCzof9G', 
    'System Administrator',
    r.id
FROM roles r WHERE r.name = 'ROLE_ADMIN'
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password_hash, full_name, role_id)
SELECT 
    'sarah.smith@mindwell.com', 
    '$2a$10$eAccYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORr7x.hWETncCzof9G', 
    'Dr. Sarah Smith',
    r.id
FROM roles r WHERE r.name = 'ROLE_DOCTOR'
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password_hash, full_name, role_id)
SELECT 
    'john.doe@mindwell.com', 
    '$2a$10$eAccYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORr7x.hWETncCzof9G', 
    'John Doe',
    r.id
FROM roles r WHERE r.name = 'ROLE_PATIENT'
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password_hash, full_name, role_id)
SELECT 
    'jane.roe@mindwell.com', 
    '$2a$10$eAccYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORr7x.hWETncCzof9G', 
    'Jane Roe',
    r.id
FROM roles r WHERE r.name = 'ROLE_PATIENT'
ON CONFLICT (email) DO NOTHING;


-- Assign patients to doctors
INSERT INTO assigned_patients (doctor_id, patient_id, assigned_at)
SELECT 
    d.id, 
    p.id, 
    CURRENT_TIMESTAMP - INTERVAL '10 days'
FROM users d, users p
WHERE d.email = 'sarah.smith@mindwell.com' 
  AND p.email = 'john.doe@mindwell.com'
ON CONFLICT (patient_id) DO NOTHING;

INSERT INTO assigned_patients (doctor_id, patient_id, assigned_at)
SELECT 
    d.id, 
    p.id, 
    CURRENT_TIMESTAMP - INTERVAL '8 days'
FROM users d, users p
WHERE d.email = 'sarah.smith@mindwell.com' 
  AND p.email = 'jane.roe@mindwell.com'
ON CONFLICT (patient_id) DO NOTHING;


INSERT INTO exercises (title, description, content_url, created_by_user_id)
SELECT 
    '5-4-3-2-1 Grounding Technique', 
    'A mindfulness technique to cope with anxiety. Acknowledge 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste.', 
    'https://mindwell-resources.com/grounding.pdf',
    u.id
FROM users u WHERE u.email = 'sarah.smith@mindwell.com';

INSERT INTO exercises (title, description, content_url, created_by_user_id)
SELECT 
    'Progressive Muscle Relaxation', 
    'Tense and then relax each muscle group, starting from your toes and moving up to your head.', 
    'https://mindwell-resources.com/pmr-audio.mp3',
    u.id
FROM users u WHERE u.email = 'sarah.smith@mindwell.com';

INSERT INTO exercises (title, description, content_url, created_by_user_id)
SELECT 
    'Gratitude Journaling', 
    'Write down three things you are grateful for today. Focus on small details.',  
    NULL,
    u.id
FROM users u WHERE u.email = 'sarah.smith@mindwell.com';


INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 8, 'Feeling great after the morning run.', CURRENT_TIMESTAMP - INTERVAL '5 days'
FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 6, 'A bit tired but okay.', CURRENT_TIMESTAMP - INTERVAL '4 days'
FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 4, 'Had a stressful meeting at work.', CURRENT_TIMESTAMP - INTERVAL '3 days'
FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 7, 'Recovered well, feeling balanced.', CURRENT_TIMESTAMP - INTERVAL '2 days'
FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 9, 'Fantastic day!', CURRENT_TIMESTAMP - INTERVAL '1 day'
FROM users WHERE email = 'john.doe@mindwell.com';


INSERT INTO patient_exercises (patient_id, exercise_id, assigned_by_user_id, status, assigned_at, completed_at)
SELECT 
    p.id, e.id, d.id, 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 day'
FROM users p, exercises e, users d
WHERE p.email = 'john.doe@mindwell.com' 
  AND e.title = '5-4-3-2-1 Grounding Technique'
  AND d.email = 'sarah.smith@mindwell.com';

INSERT INTO patient_exercises (patient_id, exercise_id, assigned_by_user_id, status, assigned_at)
SELECT 
    p.id, e.id, d.id, 'PENDING', CURRENT_TIMESTAMP
FROM users p, exercises e, users d
WHERE p.email = 'john.doe@mindwell.com' 
  AND e.title = 'Progressive Muscle Relaxation'
  AND d.email = 'sarah.smith@mindwell.com';