# ICET-CHECKSHEET

## Nginx file
### /etc/nginx/conf.d/decault.conf 

```nginx
upstream backend_api {
        server 127.0.0.1:5000;
}

server {
    listen       80;
    server_name 35.183.100.104;
    
    root /home/ubuntu/icet-checksheet-deploy/client/build;
    
     index  index.html index.htm index.nginx-debian.html;
     
    client_body_buffer_size 50k;


        #Static files and SPA support
    location / {   
        try_files $uri /index.html;
    }

        # API requests
    location /api {
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Socket.io requests
    location /socket.io/ {
        proxy_pass http://backend_api;   # Node.js server URL for socket.io
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
   }


#Favicon
 location = /favicon.ico {
        log_not_found off;
        access_log off;
        try_files $uri /404.html;
    }
}
