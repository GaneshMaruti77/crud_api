const express = require("express");
const app = express();
app.use(express.json());
let products = [
 {id:1,name:"Laptop",price:50000},
 {id:2,name:"Phone",price:20000}
];
app.get("/products",(req,res)=>{
  res.json(products)
})
app.post("/products",(req,res)=>{
  const newitem = req.body;
  if(!newitem.name || typeof newitem.price !== "number"){
    return res.status(400).json({error : "name and price require"})
  }
  const maxId = products.reduce((max,p)=>(p.id>max?p.id:max),0);
  newitem.id = maxId + 1;
  products.push(newitem);
  res.json(newitem);
})
app.put("/products/:id",(req,res,next)=>{
  try{
  const id = parseInt(req.params.id);
  const product = products.find(p=>p.id===id);
  if(!product){
    throw new Error("product not found ");
  }
  const updateitem = req.body;
  if(updateitem.name!==undefined){
    product.name=updateitem.name;
  }
  if(updateitem.price!==undefined){
    product.price=updateitem.price;
  }
  res.status(200).json(product);
}catch(err){
  next(err);
}
})
app.delete("/products/:id",(req,res,next)=>{
  try{
  const id = parseInt(req.params.id)
  const Index = products.findIndex(p=>p.id===id);
  if(Index===-1){
    throw new Error("Item not found");
  }

  products.splice(Index,1);
  
  res.status(200).json({message:"item deleted"});
}catch(err){
  next(err);
}
})
app.listen(3000,()=>
{
  console.log("Server is running on 3000");
})
app.get("/crash",(req,res,next)=>{
  try{
  throw new Error("manual error");
  }catch(err){
  next(err);
  }
})
app.use((err,req,res,next)=>{
  console.error("Error:", err.message);
  res.status(500).json({error:err.message});
})