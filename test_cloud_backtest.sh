#!/usr/bin/env bash
set -euo pipefail

# ------------------------------
# 1. Переменные
# ------------------------------
SERVER="http://localhost:8000"
EMAIL="ll@me.com"
PASSWORD="7777"

# Параметры бэктеста (подставь свои или оставь как пример)
INSTRUMENT_UID="e6123145-9665-43e0-8413-cd61b8aa9b13"
DATE_FROM="2026-06-05"
DATE_TO="2026-06-05"
INTERVAL="CANDLE_INTERVAL_1_MIN"
STRATEGY="volume_accumulation"
STOP_LOSS="0.5"
TAKE_PROFIT="1.0"

# ------------------------------
# 2. Авторизация
# ------------------------------
echo "=== Авторизация ==="
LOGIN_RESPONSE=$(curl -s -X POST "$SERVER/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Ошибка авторизации: $LOGIN_RESPONSE"
  exit 1
fi
echo "Токен получен: ${TOKEN:0:20}..."

# ------------------------------
# 3. Создание задачи
# ------------------------------
echo ""
echo "=== Создание задачи ==="
TASK_RESPONSE=$(curl -s -X POST "$SERVER/api/backtest/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"instrumentUid\": \"$INSTRUMENT_UID\",
    \"dateFrom\": \"$DATE_FROM\",
    \"dateTo\": \"$DATE_TO\",
    \"interval\": \"$INTERVAL\",
    \"params\": {
      \"strategyType\": \"$STRATEGY\",
      \"stopLossPercent\": $STOP_LOSS,
      \"takeProfitPercent\": $TAKE_PROFIT
    }
  }")

TASK_ID=$(echo "$TASK_RESPONSE" | grep -o '"taskId":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TASK_ID" ]; then
  echo "Ошибка создания задачи: $TASK_RESPONSE"
  exit 1
fi
echo "Задача создана: $TASK_ID"

# ------------------------------
# 4. Опрос статуса
# ------------------------------
echo ""
echo "=== Ожидание выполнения ==="
STATUS="pending"
while [ "$STATUS" == "pending" ] || [ "$STATUS" == "running" ]; do
  sleep 3
  STATUS_RESPONSE=$(curl -s "$SERVER/api/backtest/tasks/$TASK_ID" \
    -H "Authorization: Bearer $TOKEN")
  STATUS=$(echo "$STATUS_RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
  echo "  Статус: $STATUS"

  if [ "$STATUS" == "failed" ]; then
    ERROR=$(echo "$STATUS_RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
    echo "Ошибка выполнения: $ERROR"
    exit 1
  fi
done

# ------------------------------
# 5. Получение результата
# ------------------------------
echo ""
echo "=== Результат ==="
RESULT=$(curl -s "$SERVER/api/backtest/results/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "$RESULT" | python3 -m json.tool 2>/dev/null || echo "$RESULT"