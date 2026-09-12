#!/usr/bin/env bash
set -e

echo "Iniciando atualizacao dos containers Enkephalos..."
cd /var/www/enkephalos

echo "Verificando Docker Compose..."
if docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
else
  echo "Erro: Docker Compose nao encontrado na VPS."
  exit 1
fi

echo "Parando containers antigos..."
$COMPOSE_CMD down --remove-orphans || true

echo "Compilando e subindo novos containers (portas 8088 e 8089)..."
$COMPOSE_CMD up -d --build

echo "Limpando imagens antigas sem uso..."
docker image prune -f

echo "Verificando status dos containers..."
$COMPOSE_CMD ps

echo "Deploy concluido com sucesso em enkephalos.mubadev.com.br!"
