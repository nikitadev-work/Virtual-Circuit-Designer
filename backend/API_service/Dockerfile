FROM golang

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o api-service .

RUN chmod +x api-service

CMD ["./api-service"]