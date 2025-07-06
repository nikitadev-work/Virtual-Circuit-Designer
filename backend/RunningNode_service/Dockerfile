FROM golang:latest

WORKDIR /app
COPY . .

RUN go mod download && \
    go build -o runningnode-service . && \
    chmod +x runningnode-service

# Устанавливаем file и зависимости
RUN mkdir -p /app/files

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3 \
        iverilog \
        file && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
    
CMD ["./runningnode-service"]