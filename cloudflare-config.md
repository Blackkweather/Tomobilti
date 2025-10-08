# CloudFlare Configuration for ShareWheelz
# This file contains the optimal CloudFlare settings for maximum performance

# Page Rules for ShareWheelz
# These rules optimize caching and performance

# Static Assets - Cache for 1 year
# URL: sharewheelz.uk/assets/*
# Settings: Cache Level: Cache Everything, Edge Cache TTL: 1 year

# API Endpoints - Cache for 5 minutes
# URL: sharewheelz.uk/api/cars
# Settings: Cache Level: Cache Everything, Edge Cache TTL: 5 minutes

# Images - Cache for 1 month
# URL: sharewheelz.uk/images/*
# Settings: Cache Level: Cache Everything, Edge Cache TTL: 1 month

# HTML Pages - Cache for 1 hour
# URL: sharewheelz.uk/*
# Settings: Cache Level: Cache Everything, Edge Cache TTL: 1 hour

# Security Settings
# SSL/TLS: Full (Strict)
# Always Use HTTPS: On
# HTTP Strict Transport Security (HSTS): On
# Minimum TLS Version: TLS 1.2

# Performance Settings
# Brotli Compression: On
# Rocket Loader: On
# Auto Minify: CSS, JavaScript, HTML
# Mirage: On (for mobile)
# Polish: Lossless

# Caching Settings
# Browser Cache TTL: 1 month
# Always Online: On
# Development Mode: Off (for production)

# Firewall Rules
# Block requests from countries with high bot activity
# Rate limiting: 100 requests per minute per IP
# Challenge suspicious requests

# Analytics
# Web Analytics: On
# Bot Analytics: On
# Security Analytics: On