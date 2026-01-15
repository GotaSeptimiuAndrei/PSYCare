INSERT INTO mood_entries (user_id, mood_value, description, created_at)
SELECT
    u.id,
    FLOOR(RANDOM() * 10 + 1)::INT AS mood_value,  -- values 1–10
    'Auto-generated mood entry.' AS description,
    CURRENT_DATE - gs.day AS created_at
FROM users u
CROSS JOIN generate_series(0, 364) AS gs(day)
WHERE u.email = 'john.doe@mindwell.com';
