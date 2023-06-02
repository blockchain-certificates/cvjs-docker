## building the image

```shell
    docker build . -t cert-verifier-js ## or whatever name
```

## running the image
```shell
    docker run -p 9000:4000 -d cert-verifier-js ## 9000 or whatever local machine port
```

## example call (outputs expected API data)
```shell
    curl -i localhost:9000
```

## example verification call
```javascript
    const verificationStatus = await fetch('http://localhost:9000/verification', {
        body: JSON.stringify({
            certificate: blockcerts
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }).then((res) => res.json());
```
