curl -X POST http://localhost:3333/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "password": "password",
  "name": "User Name"
}'
