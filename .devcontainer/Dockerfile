FROM mcr.microsoft.com/devcontainers/javascript-node:18-bookworm

# Install extra dependencies (mostly for Cypress)
RUN apt-get update \
  && export DEBIAN_FRONTEND=noninteractive \
  && apt-get install --assume-yes --no-install-recommends \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    postgresql-client \
    vim \
    xauth \
    xvfb
