run-local:
	echo "Running the application...!"
	docker compose --env-file=./.env up --build
run-local-prune:
	echo "Docker System Prune...!"
	docker system prune -a -f --volumes
