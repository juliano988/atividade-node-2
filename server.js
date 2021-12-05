const express = require('express');
const app = express();
const port = 3000;

const lista_produtos = {
  produtos: [
    { id: 1, descricao: "Arroz parboilizado 5Kg", valor: 25.00, marca: "Tio João" },
    { id: 2, descricao: "Maionese 250gr", valor: 7.20, marca: "Helmans" },
    { id: 3, descricao: "Iogurte Natural 200ml", valor: 2.50, marca: "Itambé" },
    { id: 4, descricao: "Batata Maior Palha 300gr", valor: 15.20, marca: "Chipps" },
    { id: 5, descricao: "Nescau 400gr", valor: 8.00, marca: "Nestlé" },
  ]
}

app.use(express.json()) // for parsing application/json

app.get('/produtos', (req, res) => {
  return res.status(200).json(lista_produtos);
})

app.get('/produtos/:id', (req, res) => {
  const id = Number(req.params.id);
  const selectedProduct = lista_produtos.produtos.find(function (produto) { return produto.id === id });

  if (selectedProduct) {
    return res.status(200).json(selectedProduct);
  } else {
    return res.status(404).json({ message: 'Produto não encontrado' });
  }

})

app.post('/produtos', (req, res) => {

  const descricao = req.query.descricao;
  const valor = Number(req.query.valor);
  const marca = req.query.marca;

  if (!descricao || !valor || !marca) {
    res.status(400).json({ message: 'Parametros incorretos, favor fornecer valores de descricao, valor, e marca validos.' })
  } else {

    const ids = lista_produtos.produtos.map(function (produto) { return Number(produto.id) });

    const newProduct = {
      id: Math.max(...ids) + 1,
      descricao: descricao,
      valor: valor,
      marca: marca
    }

    lista_produtos.produtos.push(newProduct);

    return res.status(200).json({ message: 'Produto adicionado com sucesso!', produto: newProduct })

  }

})

app.put('/produtos/:id', (req, res) => {

  const id = Number(req.params.id);

  if (!id) {
    return res.status(404).json({ message: 'id não encontrada' });
  } else {

    const newDescricao = req.body?.descricao;
    const newValor = Number(req.body?.valor);
    const newMarca = req.body?.marca;

    const selectedProduct = lista_produtos.produtos.find(function (produto) { return produto.id === id });

    if (!selectedProduct) { return res.status(404).json({ message: 'Produto não encontrado.' }) }

    selectedProduct.descricao = newDescricao || selectedProduct.descricao;
    selectedProduct.valor = newValor || selectedProduct.valor;
    selectedProduct.marca = newMarca || selectedProduct.marca;

    lista_produtos.produtos.map(function (produto) { if (produto.id === id) { return selectedProduct } else { produto } })

    return res.status(200).json({ message: 'Produto atualizado com sucesso!', produto: selectedProduct })

  }

})

app.delete('/produtos/:id', (req, res) => {

  const id = Number(req.params.id);

  const deletedProduct = lista_produtos.produtos.find(function (produto) { return Number(produto.id) === id })

  if (!deletedProduct) {
    return res.status(404).json({ message: 'id não encontrada' });
  } else {

    lista_produtos.produtos = lista_produtos.produtos.filter(function (produto) { return Number(produto.id) !== id });

    return res.status(200).json({message: 'Produto deletado com sucesso!',produto: deletedProduct})

  }

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})