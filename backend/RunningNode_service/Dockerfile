FROM golang

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o runningnode-service .

CMD ["./runningnode-service"]