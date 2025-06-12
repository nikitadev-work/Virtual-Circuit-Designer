FROM golang

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o api-service .

CMD ["./api-service"]