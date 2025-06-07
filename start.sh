envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Jalankan Nginx di foreground
nginx -g 'daemon off;'