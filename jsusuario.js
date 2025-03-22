// Função para buscar os produtos da API
function fetchProdutos() {
    const url = 'http://127.0.0.1:5000/produtos'; // URL da API

    fetch(url)
        .then(response => {
            // Verifique se a resposta é OK (status 200)
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json(); // Converte a resposta para JSON
        })
        .then(data => {
            const produtosContainer = document.getElementById('cotacaoContainer');
            
            // Verifique se há produtos retornados da API
            if (data && data.length > 0) {
                produtos = data; // Armazena os produtos na variável global
                renderizarProdutos(produtos); // Chama a função para renderizar os produtos
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
    produtosContainer.innerHTML = '';  // Limpa o conteúdo atual

    // Renderiza os produtos
    produtos.forEach(produto => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // Imagem do produto
        const img = document.createElement('img');
        img.src = produto.imagem;  // Supondo que o campo da imagem seja 'imagem'
        img.alt = produto.descricao_produto;  // Usando 'descricao_produto' para o alt
        productCard.appendChild(img);

        // Nome do produto
        const nome = document.createElement('h3');
        nome.textContent = produto.descricao_produto;  // Usando 'descricao_produto'
        productCard.appendChild(nome);

        // Código de barras
        const codigoBarras = document.createElement('p');
        codigoBarras.classList.add('codigo-barras');
        codigoBarras.textContent = `Código: ${produto.cod_barras}`;  // Usando 'cod_barras'
        productCard.appendChild(codigoBarras);

        // Adiciona o card ao container de produtos
        produtosContainer.appendChild(productCard);
    });

    // Atualiza o contador de produtos
    updateProductCount();
}

// Função para filtrar os produtos com base no termo de pesquisa
function filterProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();  // Obtém o valor da pesquisa
    const filteredProducts = produtos.filter(produto => {
        const productName = produto.descricao_produto.toLowerCase();  // Nome do produto
        return productName.includes(query);  // Filtra os produtos com base na pesquisa
    });

    renderizarProdutos(filteredProducts);  // Renderiza os produtos filtrados
}

// Função para atualizar o contador de produtos visíveis
function updateProductCount() {
    const visibleProducts = document.querySelectorAll('.product-card');
    const productCount = visibleProducts.length;  // Número de produtos visíveis
    const productCountDisplay = document.getElementById('productCount');
    productCountDisplay.textContent = `Produtos encontrados: ${productCount}`;
}

// Adiciona o evento de input para pesquisa
document.getElementById('searchInput').addEventListener('input', filterProducts);

// Função para deletar um produto na API e removê-lo do LocalStorage
async function deletarProduto(codigoBarras) {
    try {
        const response = await fetch(`${API_URL}/produto/${codigoBarras}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Erro ao deletar produto");
        
        // Remove o produto do LocalStorage
        let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
        produtos = produtos.filter(produto => produto.cod_barras !== codigoBarras);
        localStorage.setItem("produtos", JSON.stringify(produtos));
        
        alert("Produto deletado com sucesso!");
        fetchProdutos(); // Recarrega a lista de produtos
    } catch (error) {
        console.error("Erro ao deletar produto:", error);
    }
}

// Chama a função para carregar os produtos quando a página for carregada
window.onload = fetchProdutos;
