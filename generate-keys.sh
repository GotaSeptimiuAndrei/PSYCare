#!/bin/bash

# Create directory
mkdir -p src/main/resources/certs

# Generate RSA keypair
openssl genrsa -out keypair.pem 2048

# Extract public key
openssl rsa -in keypair.pem -pubout -out backend/src/main/resources/certs/public.pem

# Convert to PKCS#8 private key (unencrypted)
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in keypair.pem -out backend/src/main/resources/certs/private.pem

# Remove temporary keypair file
rm keypair.pem
