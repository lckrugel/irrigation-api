curl -X POST http://localhost:3333/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "password": "password"
}'
