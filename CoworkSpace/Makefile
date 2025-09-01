# Makefile pour CoworkSpace

.PHONY: help dev prod stop clean logs db test

# Afficher l'aide
help:
	@echo "CoworkSpace - Commandes Docker disponibles:"
	@echo ""
	@echo "  make dev     - Démarrer en mode développement"
	@echo "  make prod    - Démarrer en mode production"
	@echo "  make stop    - Arrêter tous les conteneurs"
	@echo "  make clean   - Nettoyer conteneurs et volumes"
	@echo "  make logs    - Afficher les logs"
	@echo "  make db      - Se connecter à la base de données"
	@echo "  make test    - Lancer les tests"

# Mode développement
dev:
	@echo "🚀 Démarrage en mode développement..."
	docker-compose -f docker-compose.dev.yml up --build

# Mode production
prod:
	@echo "🚀 Démarrage en mode production..."
	docker-compose up --build -d
	@echo "✅ Application démarrée !"
	@echo "🌐 Frontend: http://localhost:3001"
	@echo "🔌 API: http://localhost:3000/api"

# Arrêter les conteneurs
stop:
	@echo "⏹️ Arrêt des conteneurs..."
	docker-compose down
	docker-compose -f docker-compose.dev.yml down

# Nettoyer
clean:
	@echo "🧹 Nettoyage des conteneurs et volumes..."
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.dev.yml down -v --rmi all
	docker system prune -f

# Logs
logs:
	docker-compose logs -f

# Base de données
db:
	docker exec -it coworkspace-db-dev mongosh -u admin -p password

# Tests
test:
	docker-compose exec backend npm run test