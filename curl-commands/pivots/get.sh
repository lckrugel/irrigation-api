USER_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMTMyZjc1My1kNzJkLTQxOTctOTQyYy00M2EzOWQ3MjZiOGYiLCJpYXQiOjE3NTIxNjU4NDgsImV4cCI6MTc1Mjc3MDY0OCwic3ViIjoiYjEzMmY3NTMtZDcyZC00MTk3LTk0MmMtNDNhMzlkNzI2YjhmIn0.KgL4LqCdpCaJ4ZDM6uWWpzQA5gTrjdQHO_i0c52TyW0
PIVOT_ID=dfd86240-407c-4588-b864-112b66dc0559

# BUSCA PIVÔ POR ID
echo "Buscando pivô por ID..."
curl -X GET http://localhost:3333/pivots/$PIVOT_ID \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $USER_TOKEN"
