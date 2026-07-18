FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

# Jalan sbg non-root -- image dasarnya default root, ini bukan opsional.
RUN useradd --create-home --shell /usr/sbin/nologin appuser
USER appuser

EXPOSE 8000
# Shell form (bukan exec-form array) SENGAJA -- perlu ekspansi $PORT dari
# shell. Heroku nge-assign port dinamis lewat env var ini dan router-nya
# nyambung ke situ, bukan ke port yang di-hardcode; exec-form gak pernah
# nge-expand env var jadi bakal selalu listen di 8000 walau Heroku ngarahin
# trafik ke port lain -- persis kejadian pas nyoba deploy pertama kali.
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
