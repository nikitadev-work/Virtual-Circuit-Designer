dev-up:
	docker compose -f docker-compose.dev.yml up -d --build

dev-down:
	docker compose -f docker-compose.dev.yml down
	docker compose down -v --remove-orphans

dev-logs:
	docker compose logs

prune:
	docker system prune -a --volumes --force