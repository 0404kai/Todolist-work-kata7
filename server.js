const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errHandle = require('./errorHandle');
const todos = [];

const requireListener = (req, res) =>{
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    let body = '';
    req.on('data', (chunk) =>{
        body += chunk;
    })

    if(req.url == '/todos' && req.method == 'GET'){
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            'status': 'success',
            'data': todos
        }));
        res.end();
    }else if(req.url == '/todos' && req.method == 'POST'){
        req.on('end', () =>{
            try{
                const title = JSON.parse(body).title;
                const todo = {
                    'title': title,
                    'id': uuidv4()
                }
                if(title !== undefined){
                    todos.push(todo);
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        'status': 'success',
                        'data': todos
                    }));
                    res.end();                    
                }else{
                    errHandle(res);
                }
            }catch{
                errHandle(res);
            }
        })
    }else if(req.url == '/todos' && req.method == 'DELETE'){
        todos.length = 0;
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            'status': 'success',
            'message': '刪除所有資料!'
        }));
        res.end();
    }else if(req.url.startsWith('/todos/') && req.method == 'DELETE'){
        const id = req.url.split('/').pop();
        const index = todos.findIndex(data => data.id == id);
        if(index !== -1){
            todos.splice(index, 1);
            res.writeHead(200, headers);
            res.write(JSON.stringify({
                'status': 'success',
                'message': '刪除單筆資料!'
            }));
            res.end();
        }else{
            errHandle(res);
        }
    }else if(req.url.startsWith('/todos/') && req.method == 'PATCH'){
        req.on('end', () =>{
            try{
                const id = req.url.split('/').pop();
                const index = todos.findIndex(data => data.id == id);        
                const title = JSON.parse(body).title;
                if(title !== undefined && index !== -1){
                    todos[index].title = title;
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        'status': 'success',
                        'data': todos
                    }));
                    res.end();                    
                }else{
                    errHandle(res);
                }
            }catch{
                errHandle(res);
            }
        })
    }else if(req.method == 'OPTIONS'){
        res.writeHead(200, headers);
        res.end();
    }else{
        errHandle(res);
    }
}

const server = http.createServer(requireListener);
server.listen(process.env.PORT || 8080);