openssl req -x509 -out localhost.crt -keyout localhost.key \
 -newkey rsa:2048 -nodes -sha256 \
 -subj '/CN=localhost' -extensions EXT -config <( \
 printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

// the above is not good enough for chrome, so use the below with mkcert instead

// install mkcert on macos if not done allready
brew install mkcert

// generate cert
mkcert localhost 127.0.0.1 ::1 // this will generate localhost+2.pem and localhost+2-key.pem
