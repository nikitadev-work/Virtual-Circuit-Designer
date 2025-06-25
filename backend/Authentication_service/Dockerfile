FROM golang

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o auth-service .

CMD ["./auth-service"]