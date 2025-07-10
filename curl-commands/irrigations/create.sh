USER_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzZTBhMWRhYi1hYTkxLTQ1OTEtYmQ4YS0yOGI4NGU2NDZjODkiLCJpYXQiOjE3NTIxNjc1MjQsImV4cCI6MTc1Mjc3MjMyNCwic3ViIjoiM2UwYTFkYWItYWE5MS00NTkxLWJkOGEtMjhiODRlNjQ2Yzg5In0.SXT1pP2oBQH5aMyQj2juM26vxrWDXFHWIVesWn6Egg8
PIVOT_ID=e4fefafc-cffe-446f-b220-e6d3b5443fea

# CRIA UMA NOVA IRRIGAÇÃO
echo "Criando uma nova irrigação..."
curl -X POST http://localhost:3333/irrigations \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $USER_TOKEN" \
-d '{
  "pivotId": "'$PIVOT_ID'",
  "applicationAmount": 350,
  "irrigationDate": "2023-03-15T12:00:00Z"
}'
