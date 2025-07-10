USER_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzZTBhMWRhYi1hYTkxLTQ1OTEtYmQ4YS0yOGI4NGU2NDZjODkiLCJpYXQiOjE3NTIxNjc1MjQsImV4cCI6MTc1Mjc3MjMyNCwic3ViIjoiM2UwYTFkYWItYWE5MS00NTkxLWJkOGEtMjhiODRlNjQ2Yzg5In0.SXT1pP2oBQH5aMyQj2juM26vxrWDXFHWIVesWn6Egg8

# LISTA TODOS OS PIVÔS
echo "Listando todos os pivôs..."
curl -X GET http://localhost:3333/pivots \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $USER_TOKEN"
