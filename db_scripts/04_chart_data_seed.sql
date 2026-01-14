-- 30 days of mood entries for testing
INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 7, 'Feeling good today.', CURRENT_TIMESTAMP - INTERVAL '30 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 6, 'A little tired but okay.', CURRENT_TIMESTAMP - INTERVAL '29 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 5, 'Had a stressful meeting.', CURRENT_TIMESTAMP - INTERVAL '28 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 8, 'Feeling energetic.', CURRENT_TIMESTAMP - INTERVAL '27 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 4, 'A bit down today.', CURRENT_TIMESTAMP - INTERVAL '26 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 7, 'Recovered well.', CURRENT_TIMESTAMP - INTERVAL '25 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 9, 'Fantastic day!', CURRENT_TIMESTAMP - INTERVAL '24 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 5, 'Feeling a bit anxious.', CURRENT_TIMESTAMP - INTERVAL '23 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 6, 'Work was productive.', CURRENT_TIMESTAMP - INTERVAL '22 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 8, 'Had a fun evening.', CURRENT_TIMESTAMP - INTERVAL '21 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 4, 'Feeling stressed.', CURRENT_TIMESTAMP - INTERVAL '20 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 7, 'Good mood overall.', CURRENT_TIMESTAMP - INTERVAL '19 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 6, 'Slightly tired but okay.', CURRENT_TIMESTAMP - INTERVAL '18 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 5, 'Had some challenges today.', CURRENT_TIMESTAMP - INTERVAL '17 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 8, 'Feeling great!', CURRENT_TIMESTAMP - INTERVAL '16 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 7, 'Mood is stable.', CURRENT_TIMESTAMP - INTERVAL '15 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 4, 'Had a rough day.', CURRENT_TIMESTAMP - INTERVAL '14 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 9, 'Super productive!', CURRENT_TIMESTAMP - INTERVAL '13 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 6, 'Feeling okay.', CURRENT_TIMESTAMP - INTERVAL '12 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 5, 'A bit stressed.', CURRENT_TIMESTAMP - INTERVAL '11 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 7, 'Feeling balanced.', CURRENT_TIMESTAMP - INTERVAL '10 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 8, 'Good energy today.', CURRENT_TIMESTAMP - INTERVAL '9 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 4, 'A bit low on mood.', CURRENT_TIMESTAMP - INTERVAL '8 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 6, 'Feeling okay.', CURRENT_TIMESTAMP - INTERVAL '7 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 7, 'Had a good day.', CURRENT_TIMESTAMP - INTERVAL '6 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 8, 'Feeling motivated.', CURRENT_TIMESTAMP - INTERVAL '5 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 5, 'Some stress today.', CURRENT_TIMESTAMP - INTERVAL '4 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 6, 'Mood is okay.', CURRENT_TIMESTAMP - INTERVAL '3 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 7, 'Feeling good.', CURRENT_TIMESTAMP - INTERVAL '2 days' FROM users WHERE email = 'john.doe@mindwell.com';

INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT id, 9, 'Great energy today!', CURRENT_TIMESTAMP - INTERVAL '1 day' FROM users WHERE email = 'john.doe@mindwell.com';
