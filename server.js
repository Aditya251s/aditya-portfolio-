const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json({limit:'50mb'}));
app.use(express.static(__dirname));
let DB_FILE='db.json';
if(!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({categories:[], designs:[]}));
function readDB(){return JSON.parse(fs.readFileSync(DB_FILE));}
function writeDB(d){fs.writeFileSync(DB_FILE, JSON.stringify(d,null,2));}
const upload = multer({storage: multer.memoryStorage()});
app.get('/api/data',(req,res)=>{res.json(readDB())});
app.post('/api/designs', upload.single('image'), (req,res)=>{
  let db=readDB();
  const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  const newDesign={id:'id_'+Date.now(), title:req.body.title, cat:req.body.cat, price:req.body.price, img:base64};
  db.designs.push(newDesign);
  writeDB(db);
  res.json(newDesign);
});
app.get('/',(req,res)=>{res.sendFile(__dirname+'/index.html')});
app.listen(PORT, ()=>console.log(`Running on ${PORT}`));
