// Função para buscar os produtos da API
function fetchProdutos() {
    const url = 'http://127.0.0.1:5000/produtos'; // URL da API

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json(); // Converte a resposta para JSON
        })
        .then(data => {
            const produtosContainer = document.getElementById('cotacaoContainer');

            if (data && data.length > 0) {
                produtos = data; // Armazena os produtos na variável global
                renderizarProdutos(produtos);
            } else {
                produtosContainer.innerHTML = '<p>Nenhum produto encontrado.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao carregar os produtos:', error);
            document.getElementById('cotacaoContainer').innerHTML = '<p>Erro ao carregar os produtos.</p>';
        });
}

// Função para renderizar os produtos na tela
function renderizarProdutos(produtos) {
    const produtosContainer = document.getElementById('cotacaoContainer');
    produtosContainer.innerHTML = ''; // Limpa o conteúdo atual

    produtos.forEach(produto => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // Imagem do produto
        const img = document.createElement('img');
        img.src = produto.imagem || 'placeholder.jpg'; // Usa um placeholder se a imagem não estiver disponível
        img.alt = produto.descricao_produto;
        productCard.appendChild(img);

        // Nome do produto
        const nome = document.createElement('h3');
        nome.textContent = produto.descricao_produto;
        productCard.appendChild(nome);

        // Código de barras
        const codigoBarras = document.createElement('p');
        codigoBarras.classList.add('codigo-barras');
        codigoBarras.textContent = `Código: ${produto.cod_barras}`;
        productCard.appendChild(codigoBarras);

        // Botão de adicionar ao carrinho
        const addBtn = document.createElement('button');
        addBtn.textContent = 'Adicionar';
        addBtn.classList.add('adicionar-btn');
        addBtn.onclick = () => adicionarProduto(produto);
        productCard.appendChild(addBtn);

        produtosContainer.appendChild(productCard);
    });
}

// Função para adicionar o produto ao carrinho
async function adicionarProduto(produto) {
    const quantidade = prompt("Quantas unidades deseja adicionar?");
    if (quantidade && quantidade > 0) {
        try {
            const response = await fetch('http://127.0.0.1:5000/carrinho', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    categoria: produto.categoria || 'Indefinida', // Adicionando categoria com fallback
                    cod_barras: produto.cod_barras,
                    descricao_produto: produto.descricao_produto,
                    id: produto.id, // Ajustando para "id", conforme seu JSON
                    imagem: produto.imagem || 'placeholder.jpg',
                    quantidade: parseInt(quantidade),
                }),
            });

            if (!response.ok) throw new Error('Erro ao adicionar produto ao carrinho');

            alert('Produto adicionado ao carrinho!');
        } catch (error) {
            console.error('Erro ao adicionar o produto:', error);
            alert('Erro ao adicionar o produto ao carrinho');
        }
    } else {
        alert('Por favor, insira uma quantidade válida.');
    }
}

// Chama a função para carregar os produtos quando a página for carregada
window.onload = fetchProdutos;
