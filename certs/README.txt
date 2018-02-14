openssl req -new -newkey rsa:2048 -nodes -keyout genexp.northwestern.edu.key -out genexp.northwestern.edu.csr
openssl dhparam -out dhparam.pem 2048
openssl rsa -in genexp.northwestern.edu.key -out genexp.northwestern.edu.rsa.key


## The cert from the NUIT is: as X509 Certificate only, Base64 encoded: