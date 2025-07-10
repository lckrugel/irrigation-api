USER_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzZTBhMWRhYi1hYTkxLTQ1OTEtYmQ4YS0yOGI4NGU2NDZjODkiLCJpYXQiOjE3NTIxNjc1MjQsImV4cCI6MTc1Mjc3MjMyNCwic3ViIjoiM2UwYTFkYWItYWE5MS00NTkxLWJkOGEtMjhiODRlNjQ2Yzg5In0.SXT1pP2oBQH5aMyQj2juM26vxrWDXFHWIVesWn6Egg8

# CRIA UM NOVO PIVÔ
echo "Criando um novo pivô..."
curl -X POST http://localhost:3333/pivots \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $USER_TOKEN" \
-d '{
  "description": "Descrição de exemplo para o pivô",
  "flowRate": 10,
  "minApplicationDepth": 5.0
}'
